// Źródła uznawane za "czystą energię"
export const CLEAN_FUELS = ["biomass", "nuclear", "hydro", "wind", "solar"];

// Grupuje półgodzinne interwały po dacie i liczy dla każdego dnia średni udział
// każdego źródła oraz łączny procent czystej energii (suma średnich CLEAN_FUELS).
export function computeDailyAverages(intervals) {
  const byDate = new Map();
  for (const interval of intervals) {
    const date = interval.from.slice(0, 10); // sama data, np. "2026-06-12"
    if (!byDate.has(date)) byDate.set(date, []);
    byDate.get(date).push(interval);
  }

  const result = [];
  for (const [date, dayIntervals] of byDate) {
    const sums = {};
    const count = dayIntervals.length;

    for (const interval of dayIntervals) {
      for (const g of interval.generationmix) {
        sums[g.fuel] = (sums[g.fuel] || 0) + g.perc;
      }
    }

    const mix = {};
    for (const fuel in sums) {
      mix[fuel] = sums[fuel] / count;
    }

    const cleanPercentage = CLEAN_FUELS.reduce(
      (sum, fuel) => sum + (mix[fuel] || 0),
      0,
    );

    result.push({ date, mix, cleanPercentage });
  }

  result.sort((a, b) => a.date.localeCompare(b.date));
  return result;
}
