import { CLEAN_FUELS } from "./energyMix.js";

export function cleanPercentageOf(interval) {
  return interval.generationmix
    .filter((g) => CLEAN_FUELS.includes(g.fuel))
    .reduce((sum, g) => sum + g.perc, 0);
}

export function findOptimalWindow(intervals, hours) {
  const windowSize = hours * 2;
  const sortedIntervals = [...intervals].sort((a, b) =>
    a.from.localeCompare(b.from),
  );

  let najlepszaSrednia = -1;
  let najlepszaPozycja = 0;

  for (let i = 0; i <= sortedIntervals.length - windowSize; i++) {
    const okno = sortedIntervals.slice(i, i + windowSize);
    let suma = 0;
    for (const x of okno) suma += cleanPercentageOf(x);
    const srednia = suma / windowSize;

    if (srednia > najlepszaSrednia) {
      najlepszaSrednia = srednia;
      najlepszaPozycja = i;
    }
  }

  const najlepszeOkno = sortedIntervals.slice(
    najlepszaPozycja,
    najlepszaPozycja + windowSize,
  );
  return {
    start: najlepszeOkno[0].from,
    end: najlepszeOkno[najlepszeOkno.length - 1].to,
    averageCleanPercentage: najlepszaSrednia,
  };
}
