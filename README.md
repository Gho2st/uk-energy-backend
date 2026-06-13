# UK Energy – Backend

API serving the UK energy mix and computing the optimal EV charging window
by clean energy share. Data from the public Carbon Intensity API.

## Stack
Node.js + Express, Vitest, Docker.

## Endpoints

**`GET /api/energy-mix`** – average energy mix for three days (today, tomorrow,
day after), with per-source shares and clean energy percentage per day.

**`GET /api/optimal-window?hours=1..6`** – finds the window of the given length
with the highest average clean energy share over the next two days.

Clean energy: biomass, nuclear, hydro, wind, solar.

## Run locally
```bashnpm install

npm run dev    # http://localhost:3000

npm test

## Environment variables
- `PORT` – server port (default 3000)
- `FRONTEND_URL` – origin allowed by CORS (default http://localhost:3001)

## Notes
- Uses the `/generation/{from}/{to}` endpoint (national GB mix, half-hourly,
  including forecast).
- The API also returns the interval covering the range start (beginning before
  `from`); it is filtered out in the client so daily grouping stays correct.
- Window length in hours maps to `hours * 2` half-hourly intervals.
- Forecast horizon is ~48h, so the third day of the mix may be partial.

## Links
- Frontend repo: [LINK]
- Live app: [LINK]