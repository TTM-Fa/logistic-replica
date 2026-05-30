/**
 * mockData.ts — Synthetic but realistic-looking rate data for the
 * Rates dashboard pages. Everything is generated deterministically
 * from a seed so the chart looks identical on every reload.
 *
 * When the real backend is wired, replace `getRateSeriesForLane` with
 * an API call that returns the same `{ spot, contract, diesel, yours }`
 * shape — the components don't need to change.
 */

// ─── Types ────────────────────────────────────────────────────────────

export type Lane = {
  key: string;           // "DOH-RUH"
  from: string;          // "Doha"
  to: string;            // "Riyadh"
  fromCode: string;      // "DOH"
  toCode: string;        // "RUH"
  /** Rough baseline spot price in QAR/trip — drives mock generation */
  baseline: number;
};

export type RateSeries = {
  spot: number[];
  contract: number[];
  diesel: number[];
  yours: number[];
};

export type WeekLabel = {
  /** Display string like "CW13" */
  cw: string;
  /** "CW1 · Jan '25" — used as a tooltip / first-of-year marker */
  full: string;
  /** ISO-week index (0-based) so caller can use it for keys */
  index: number;
};

// ─── GCC lanes ────────────────────────────────────────────────────────
// Six corridors that an operator running freight across the GCC would
// actually care about. Each has a different baseline price so the chart
// looks different per lane.

export const LANES: Lane[] = [
  { key: "DOH-RUH",  from: "Doha",          to: "Riyadh",        fromCode: "DOH", toCode: "RUH", baseline: 1850 },
  { key: "DOH-JEA",  from: "Doha",          to: "Jebel Ali",     fromCode: "DOH", toCode: "JEA", baseline: 2640 },
  { key: "RUH-JED",  from: "Riyadh",        to: "Jeddah",        fromCode: "RUH", toCode: "JED", baseline: 1240 },
  { key: "JEA-RUH",  from: "Jebel Ali",     to: "Riyadh",        fromCode: "JEA", toCode: "RUH", baseline: 2840 },
  { key: "KHL-HMD",  from: "Khalifa Port",  to: "Hamad Port",    fromCode: "KHL", toCode: "HMD", baseline:  920 },
  { key: "SOH-DOH",  from: "Sohar",         to: "Doha",          fromCode: "SOH", toCode: "DOH", baseline: 1520 },
];

/** All cities used as `from`/`to` options in the filter bar */
export const ALL_CITIES: { code: string; name: string }[] = [
  { code: "DOH", name: "Doha" },
  { code: "RUH", name: "Riyadh" },
  { code: "JEA", name: "Jebel Ali" },
  { code: "JED", name: "Jeddah" },
  { code: "KHL", name: "Khalifa Port" },
  { code: "HMD", name: "Hamad Port" },
  { code: "SOH", name: "Sohar" },
  { code: "DXB", name: "Dubai" },
  { code: "AUH", name: "Abu Dhabi" },
  { code: "DMM", name: "Dammam" },
  { code: "BAH", name: "Manama" },
  { code: "MCT", name: "Muscat" },
];

// ─── Week labels ──────────────────────────────────────────────────────
// We generate 104 weeks (2 years) of synthetic history ending at the
// most recent calendar week (~CW20 of 2026 for current playtest dates).

const WEEKS_OF_HISTORY = 104;

export function generateWeekLabels(): WeekLabel[] {
  // Generate labels working backward from the current week
  const today = new Date();
  const labels: WeekLabel[] = [];

  for (let i = WEEKS_OF_HISTORY - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i * 7);

    // Approximate ISO week number — close enough for synthetic labels
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((d.getTime() - yearStart.getTime()) / 86400000);
    const week = Math.ceil((dayOfYear + 1) / 7);
    const yearTag = `'${String(d.getFullYear()).slice(-2)}`;

    const cw = `CW${week}`;
    // Mark the first calendar week of each year with the year tag for clarity
    const full = week === 1 ? `${cw}, Jan ${yearTag}` : `${cw} ${yearTag}`;

    labels.push({ cw, full, index: WEEKS_OF_HISTORY - 1 - i });
  }

  return labels;
}

// ─── Series generation ────────────────────────────────────────────────

/**
 * Tiny seeded PRNG so the same lane always produces the same data.
 * Linear congruential — good enough for visual mock data.
 */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/**
 * Generates a realistic-looking weekly price series:
 *   - starts at `base`
 *   - random walk with mean-reversion (drifts but pulls back)
 *   - mild seasonality (small sinusoidal component on a ~26-week cycle)
 *
 * `volatility` controls how jumpy the line is. `seasonality` is the
 * amplitude of the seasonal swing.
 */
function generateSeries(
  base: number,
  volatility: number,
  seasonality: number,
  weeks: number,
  seed: number,
): number[] {
  const rng = seededRandom(seed);
  const values: number[] = [];
  let current = base;

  for (let i = 0; i < weeks; i++) {
    // Mean-reverting random walk
    const drift = (rng() - 0.5) * volatility;
    const pullback = (base - current) * 0.04;
    // Seasonal component — peaks every ~26 weeks
    const season = Math.sin((i / 26) * Math.PI) * seasonality;

    current += drift + pullback;
    values.push(Math.round(current + season));
  }

  return values;
}

// ─── Forecast generation ──────────────────────────────────────────────

/**
 * Forecast result for a lane. The `history` is the last `historyWeeks`
 * of actual spot prices; `forecast` is the predicted values for the
 * next `forecastWeeks`. `upper` and `lower` are the confidence band
 * (1.5× std-dev of recent volatility, widening as we go further out —
 * the classic "cone of uncertainty" shape).
 */
export type ForecastResult = {
  history: number[];
  forecast: number[];
  upper: number[];
  lower: number[];
  /** Predicted next-week value (forecast[0]) — surfaced separately so the KPI strip can show it without recomputing */
  nextWeek: number;
  /** Most-recent actual value — used to compute the change-vs-current KPI */
  current: number;
  /** Percent change predicted week-over-week */
  changePct: number;
  /** Average uncertainty as a percentage of the forecast — surfaced for the KPI */
  confidencePct: number;
};

export function getForecastForLane(
  laneKey: string,
  forecastWeeks: number,
  historyWeeks: number = 26,
): ForecastResult {
  const allSpot = getRateSeriesForLane(laneKey).spot;
  const history = allSpot.slice(-historyWeeks);
  const current = history[history.length - 1];

  // Trend from the last 8 weeks (simple linear extrapolation)
  const lookback = Math.min(8, history.length - 1);
  const recentSlope =
    (history[history.length - 1] - history[history.length - 1 - lookback]) / lookback;

  // Recent volatility — std-dev of week-over-week deltas in last 12 weeks
  const recentValues = history.slice(-12);
  const deltas: number[] = [];
  for (let i = 1; i < recentValues.length; i++) {
    deltas.push(recentValues[i] - recentValues[i - 1]);
  }
  const mean = deltas.reduce((a, b) => a + b, 0) / deltas.length || 0;
  const variance =
    deltas.reduce((sum, d) => sum + (d - mean) ** 2, 0) / deltas.length || 1;
  const sigma = Math.sqrt(variance);

  const forecast: number[] = [];
  const upper: number[] = [];
  const lower: number[] = [];

  for (let i = 1; i <= forecastWeeks; i++) {
    // Linear extrapolation with mild mean-reversion drift
    const predicted = current + recentSlope * i * 0.7;
    forecast.push(Math.round(predicted));

    // Uncertainty grows with sqrt(time) — wider further out
    const uncertainty = sigma * 1.5 * Math.sqrt(i);
    upper.push(Math.round(predicted + uncertainty));
    lower.push(Math.round(predicted - uncertainty));
  }

  const nextWeek = forecast[0];
  const changePct = ((nextWeek - current) / current) * 100;
  // Average half-width of the confidence band as % of the forecast value
  const avgUncertainty =
    forecast.reduce(
      (sum, f, i) => sum + (upper[i] - lower[i]) / 2 / f,
      0,
    ) / forecast.length;
  const confidencePct = avgUncertainty * 100;

  return {
    history,
    forecast,
    upper,
    lower,
    nextWeek,
    current,
    changePct,
    confidencePct,
  };
}

/** Pre-build a map of lane key → series so we don't regenerate on every render */
const SERIES_CACHE: Record<string, RateSeries> = {};

export function getRateSeriesForLane(laneKey: string): RateSeries {
  if (SERIES_CACHE[laneKey]) return SERIES_CACHE[laneKey];

  const lane = LANES.find((l) => l.key === laneKey);
  if (!lane) throw new Error(`Unknown lane: ${laneKey}`);

  // Hash the lane key into an int seed so each lane gets a different walk
  let seed = 0;
  for (let i = 0; i < laneKey.length; i++) {
    seed = (seed * 31 + laneKey.charCodeAt(i)) >>> 0;
  }

  const base = lane.baseline;
  const series: RateSeries = {
    // Spot: most volatile, biggest seasonal swing
    spot: generateSeries(base, base * 0.04, base * 0.05, WEEKS_OF_HISTORY, seed),
    // Contract: steadier, mild upward drift, very little seasonality
    contract: generateSeries(base * 1.02, base * 0.012, base * 0.01, WEEKS_OF_HISTORY, seed + 1),
    // Diesel: anchored lower, gradual upward trend over 2 years
    diesel: generateSeries(base * 0.88, base * 0.018, base * 0.015, WEEKS_OF_HISTORY, seed + 2),
    // Your rate: tracks spot loosely, slightly under it on average
    yours: generateSeries(base * 0.98, base * 0.03, base * 0.04, WEEKS_OF_HISTORY, seed + 3),
  };

  SERIES_CACHE[laneKey] = series;
  return series;
}
