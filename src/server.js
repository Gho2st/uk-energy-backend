import express from "express";
import { fetchGBGenerationMix, toApiTime } from "./carbonClient.js";
import { computeDailyAverages } from "./energyMix.js";
import { findOptimalWindow } from "./optimalWindow.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // CORS — frontend na innym porcie
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
    const days = computeDailyAverages(intervals);
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
  console.log(`Podgląd surowych danych: http://localhost:${PORT}/api/raw`);
});
