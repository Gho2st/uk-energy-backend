import { computeDailyAverages } from "./energyMix.js";

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

console.log(JSON.stringify(computeDailyAverages(intervals), null, 2));
