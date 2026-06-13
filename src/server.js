import express from "express";
import { fetchGBGenerationMix, toApiTime } from "./carbonClient.js";
import { computeDailyAverages } from "./energyMix.js";
import { findOptimalWindow } from "./optimalWindow.js";

const app = express();
const PORT = process.env.PORT || 3000;
const ALLOWED_ORIGIN = process.env.FRONTEND_URL || "http://localhost:3001";

app.use((req, res, next) => {
  // Wpuszczamy tylko skonfigurowany front (lokalnie localhost, na produkcji
  // adres z Rendera). Adres podajemy zmienną FRONTEND_URL.
  res.header("Access-Control-Allow-Origin", ALLOWED_ORIGIN);
  next();
});

function getRange(days) {
  const start = new Date();
  start.setUTCHours(0, 0, 0, 0);
  const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
  return { from: toApiTime(start), to: toApiTime(end) };
}

// a) Miks energetyczny: średnie dzienne dla 3 dni.
app.get("/api/energy-mix", async (req, res) => {
  try {
    const { from, to } = getRange(3);
    const intervals = await fetchGBGenerationMix(from, to);

    // slice(0, 3): bierzemy równo trzy dni (dzisiaj, jutro, pojutrze).
    // Horyzont prognozy API to ~48h, więc trzeci dzień bywa częściowy.
    const days = computeDailyAverages(intervals).slice(0, 3);

    res.json({ days });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// b) Optymalne okno ładowania: ?hours=1..6
app.get("/api/optimal-window", async (req, res) => {
  const hours = Number(req.query.hours);
  if (!Number.isInteger(hours) || hours < 1 || hours > 6) {
    return res.status(400).json({
      error: "Parametr 'hours' musi być liczbą całkowitą z zakresu 1–6.",
    });
  }
  try {
    const { from, to } = getRange(2);
    const intervals = await fetchGBGenerationMix(from, to);
    const result = findOptimalWindow(intervals, hours);
    res.json(result);
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend działa na http://localhost:${PORT}`);
});
