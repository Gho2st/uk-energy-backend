// zrodla uznawane za "czysta energie"

export const CLEAN_FUELS = ["biomass", "nuclear", "hydro", "wind", "solar"];

export function computeDailyAverages(intervals) {
  const szafka = new Map();
  for (const interval of intervals) {
    const dzien = interval.from.slice(0, 10); // sama data
    if (!szafka.has(dzien)) szafka.set(dzien, []);
    szafka.get(dzien).push(interval);
  }

  const wynik = [];
  for (const [date, dayIntervals] of szafka) {
    const sumy = {};
    const liczba = dayIntervals.length;

    for (const interval of dayIntervals) {
      for (const g of interval.generationmix) {
        sumy[g.fuel] = (sumy[g.fuel] || 0) + g.perc;
      }
    }

    const mix = {};
    for (const fuel in sumy) {
      mix[fuel] = sumy[fuel] / liczba;
    }

    const cleanPercentage = CLEAN_FUELS.reduce(
      (sum, fuel) => sum + (mix[fuel] || 0),
      0,
    );

    wynik.push({ date, mix, cleanPercentage });
  }

  wynik.sort((a, b) => a.date.localeCompare(b.date));
  return wynik;
}
