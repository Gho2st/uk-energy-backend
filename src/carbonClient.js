// klient do publicznego API carbon intensity

const BASE_URL = "https://api.carbonintensity.org.uk";

// format daty wymagany przez API: "2024-06-09T00:00Z"

export function toApiTime(date) {
  return date.toISOString().slice(0, 16) + "Z"; // pierwsze 16 znakow + Z
}

// z surowej odpowiedzi (wszystkie regiony) zostawiamy GB i upraszczamy

function extractGB(rawIntervals) {
  return rawIntervals.map((interval) => {
    const gb = interval.regions.find((r) => r.shortname === "GB");
    if (!gb) {
      throw new Error(`Brak regionu "GB" w interwale ${interval.from}`);
    }
    return {
      from: interval.from, // np. "2024-06-09T00:00Z"
      to: interval.to,
      generationmix: gb.generationmix, // [{ fuel: "wind", perc: 12.3 }, ...]
    };
  });
}

export async function fetchGBGenerationMix(fromISO, toISO) {
  const url = `${BASE_URL}/regional/intensity/${fromISO}/${toISO}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Carbon Intensity API zwrocilo status ${res.status}`);
  }
  const body = await res.json();
  if (!body.data || !Array.isArray(body.data)) {
    throw new Error("Nieoczekiwany ksztalt odpowiedzi z API");
  }
  return extractGB(body.data);
}
