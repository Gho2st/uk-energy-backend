import { CLEAN_FUELS } from "./energyMix.js";

// Procent czystej energii w interwale = suma udziałów źródeł z CLEAN_FUELS
export function cleanPercentageOf(interval) {
  return interval.generationmix
    .filter((g) => CLEAN_FUELS.includes(g.fuel))
    .reduce((sum, g) => sum + g.perc, 0);
}

export function findOptimalWindow(intervals, hours) {
  const windowSize = hours * 2; // interwały półgodzinne: 1h = 2 interwały

  if (intervals.length < windowSize) {
    throw new Error("Za mało danych, aby wyznaczyć okno o tej długości.");
  }

  // Sortujemy interwały w jedną ciągłą oś czasu, dzięki czemu okno może
  // naturalnie przechodzić przez północ (koniec jednego dnia + początek następnego).
  const sorted = [...intervals].sort((a, b) => a.from.localeCompare(b.from));

  let bestAverage = -1;
  let bestPosition = 0;

  // Pętla sięga i <= length - windowSize (a nie < length): ostatnie ważne
  // okno zaczyna się dokładnie windowSize interwałów przed końcem listy.
  for (let i = 0; i <= sorted.length - windowSize; i++) {
    const window = sorted.slice(i, i + windowSize);
    let sum = 0;
    for (const interval of window) sum += cleanPercentageOf(interval);
    const average = sum / windowSize;

    if (average > bestAverage) {
      bestAverage = average;
      bestPosition = i;
    }
  }

  const bestWindow = sorted.slice(bestPosition, bestPosition + windowSize);
  return {
    start: bestWindow[0].from,
    end: bestWindow[bestWindow.length - 1].to,
    averageCleanPercentage: bestAverage,
  };
}
