import { describe, it, expect } from "vitest";
import { computeDailyAverages } from "../src/energyMix.js";

describe("computeDailyAverages", () => {
  it("grupuje interwały po dacie i liczy średnie", () => {
    const intervals = [
      {
        from: "2024-06-09T00:00Z",
        to: "2024-06-09T00:30Z",
        generationmix: [
          { fuel: "wind", perc: 40 },
          { fuel: "gas", perc: 60 },
        ],
      },
      {
        from: "2024-06-09T00:30Z",
        to: "2024-06-09T01:00Z",
        generationmix: [
          { fuel: "wind", perc: 60 },
          { fuel: "gas", perc: 40 },
        ],
      },
      {
        from: "2024-06-10T00:00Z",
        to: "2024-06-10T00:30Z",
        generationmix: [
          { fuel: "wind", perc: 80 },
          { fuel: "gas", perc: 20 },
        ],
      },
    ];

    const result = computeDailyAverages(intervals);
    expect(result.length).toBe(2);
    expect(result[0].date).toBe("2024-06-09");
    expect(result[0].cleanPercentage).toBeCloseTo(50);
    expect(result[1].cleanPercentage).toBeCloseTo(80);
  });
});
