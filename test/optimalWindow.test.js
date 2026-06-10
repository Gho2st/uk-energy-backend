import { describe, it, expect } from "vitest";
import { findOptimalWindow, cleanPercentageOf } from "../src/optimalWindow.js";

// Pomocnik: interwał z zadanym procentem czystej energii (jako wind), reszta to gas.
function interval(from, to, cleanPerc) {
  return {
    from,
    to,
    generationmix: [
      { fuel: "wind", perc: cleanPerc },
      { fuel: "gas", perc: 100 - cleanPerc },
    ],
  };
}

describe("cleanPercentageOf", () => {
  it("sumuje tylko czyste źródła", () => {
    expect(cleanPercentageOf(interval("a", "b", 40))).toBe(40);
  });
});

describe("findOptimalWindow", () => {
  it("dla 1h (2 interwały) wybiera najczystszą sąsiednią parę", () => {
    const data = [
      interval("2024-06-09T00:00Z", "2024-06-09T00:30Z", 10),
      interval("2024-06-09T00:30Z", "2024-06-09T01:00Z", 20),
      interval("2024-06-09T01:00Z", "2024-06-09T01:30Z", 80),
      interval("2024-06-09T01:30Z", "2024-06-09T02:00Z", 90),
    ];
    const res = findOptimalWindow(data, 1);
    expect(res.start).toBe("2024-06-09T01:00Z");
    expect(res.end).toBe("2024-06-09T02:00Z");
    expect(res.averageCleanPercentage).toBeCloseTo(85);
  });

  it("okno może przechodzić przez północ", () => {
    const data = [
      interval("2024-06-09T23:00Z", "2024-06-09T23:30Z", 50),
      interval("2024-06-09T23:30Z", "2024-06-10T00:00Z", 90),
      interval("2024-06-10T00:00Z", "2024-06-10T00:30Z", 90),
      interval("2024-06-10T00:30Z", "2024-06-10T01:00Z", 10),
    ];
    const res = findOptimalWindow(data, 1);
    expect(res.start).toBe("2024-06-09T23:30Z");
    expect(res.end).toBe("2024-06-10T00:30Z");
  });

  it("uwzględnia ostatnie możliwe okno (test na błąd o jeden)", () => {
    const data = [
      interval("2024-06-09T00:00Z", "2024-06-09T00:30Z", 10),
      interval("2024-06-09T00:30Z", "2024-06-09T01:00Z", 10),
      interval("2024-06-09T01:00Z", "2024-06-09T01:30Z", 95),
      interval("2024-06-09T01:30Z", "2024-06-09T02:00Z", 95),
    ];
    const res = findOptimalWindow(data, 1);
    expect(res.start).toBe("2024-06-09T01:00Z");
  });
});
