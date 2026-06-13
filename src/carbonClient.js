// Klient do publicznego API Carbon Intensity (National Energy System Operator).
//
// Używamy krajowego endpointu /generation/{from}/{to}, który zwraca miks
// energetyczny całej Wielkiej Brytanii w interwałach półgodzinnych — zarówno
// dane bieżące, jak i prognozę na kolejne dni.

const BASE_URL = "https://api.carbonintensity.org.uk";

// Format daty wymagany przez API: "2024-06-09T00:00Z" (bez sekund, zakończone Z).
export function toApiTime(date) {
  return date.toISOString().slice(0, 16) + "Z";
}

/**
 * Pobiera półgodzinne interwały miksu energetycznego GB w zadanym zakresie.
 * @param {string} fromISO format API, np. "2024-06-09T00:00Z"
 * @param {string} toISO   format API
 * @returns {Promise<Array<{from: string, to: string, generationmix: Array<{fuel: string, perc: number}>}>>}
 */
export async function fetchGBGenerationMix(fromISO, toISO) {
  const url = `${BASE_URL}/generation/${fromISO}/${toISO}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) {
    throw new Error(`Carbon Intensity API zwróciło status ${res.status}`);
  }
  const body = await res.json();
  if (!body.data || !Array.isArray(body.data)) {
    throw new Error("Nieoczekiwany kształt odpowiedzi z API");
  }

  // API zwraca też interwał obejmujący punkt startowy (np. wczoraj 23:30),
  // czyli zaczynający się przed żądanym zakresem. Odrzucamy go tutaj, na
  // granicy z API, żeby logika wyżej dostawała wyłącznie interwały z zakresu.
  return body.data.filter((interval) => interval.from >= fromISO);
}
