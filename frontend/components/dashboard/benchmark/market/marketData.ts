/**
 * marketData.ts — Mock data for the Market Overview page.
 *
 * 5 high-level market indices, monthly cadence over 24 months,
 * generated deterministically per region.
 *
 * Metrics mirror what an executive-level freight market dashboard
 * typically tracks (capacity tightness vs demand, spot/contract/total
 * pricing pressure, carrier total cost of ownership).
 *
 * Replace `getMarketData` with a real API call when the backend lands —
 * the page component reads the same `{ [MetricKey]: number[] }` shape.
 */

// ─── Regions (GCC + per-country) ─────────────────────────────────────

export type Region = { code: string; name: string };

export const REGIONS: Region[] = [
  { code: "GCC", name: "GCC (All)" },
  { code: "QA",  name: "Qatar" },
  { code: "SA",  name: "Saudi Arabia" },
  { code: "AE",  name: "UAE" },
  { code: "OM",  name: "Oman" },
  { code: "BH",  name: "Bahrain" },
  { code: "KW",  name: "Kuwait" },
];

// ─── Metric catalogue ────────────────────────────────────────────────

export type MetricKey =
  | "capacity_index"
  | "spot_price_index"
  | "contract_price_index"
  | "total_price_index"
  | "cost_index";

export type MetricDef = {
  key: MetricKey;
  labelKey: string;
  color: string;
  baseline: number;
  volatility: number;
  /** Slow background trend (positive = upward over 2 years) */
  trend: number;
};

/**
 * Index baselines chosen so the 5 lines stay visually separable on a
 * shared Y-axis (everything between roughly 90 and 150), matching how
 * the Insights screenshot looks.
 */
export const METRICS: MetricDef[] = [
  { key: "capacity_index",        labelKey: "market.metric.capacity_index",        color: "#22C55E",         baseline:  94, volatility: 4.5, trend: -0.5 },
  { key: "spot_price_index",      labelKey: "market.metric.spot_price_index",      color: "var(--d-accent)", baseline: 128, volatility: 6.0, trend:  1.4 },
  { key: "contract_price_index",  labelKey: "market.metric.contract_price_index",  color: "#3B82F6",         baseline: 118, volatility: 2.0, trend:  0.7 },
  { key: "total_price_index",     labelKey: "market.metric.total_price_index",     color: "#A855F7",         baseline: 122, volatility: 3.0, trend:  1.0 },
  { key: "cost_index",            labelKey: "market.metric.cost_index",            color: "#F59E0B",         baseline: 110, volatility: 2.5, trend:  1.1 },
];

export function getMetric(key: MetricKey): MetricDef {
  const m = METRICS.find((x) => x.key === key);
  if (!m) throw new Error(`Unknown market metric: ${key}`);
  return m;
}

// ─── Month labels ────────────────────────────────────────────────────

export type MonthLabel = {
  /** "Sep" — abbreviated month */
  short: string;
  /** "Sep 2024" — full label for table headers */
  full: string;
  year: number;
};

const MONTHS_OF_HISTORY = 24;

/** Generate the last 24 month labels ending at the current month */
export function generateMonthLabels(): MonthLabel[] {
  const today = new Date();
  const labels: MonthLabel[] = [];
  for (let i = MONTHS_OF_HISTORY - 1; i >= 0; i--) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const short = d.toLocaleDateString("en-US", { month: "short" });
    labels.push({
      short,
      year: d.getFullYear(),
      full: `${short} ${d.getFullYear()}`,
    });
  }
  return labels;
}

// ─── Seeded series generation ────────────────────────────────────────

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Generate one metric's monthly time series for one region.
 * Mean-reverting walk with a slow background trend so each metric has
 * a distinctive shape over 2 years.
 */
function generateSeries(metric: MetricDef, regionSeed: number): number[] {
  const seed = (regionSeed + hashString(metric.key) * 13) >>> 0;
  const rng = seededRandom(seed);
  const out: number[] = [];
  let current = metric.baseline;
  for (let i = 0; i < MONTHS_OF_HISTORY; i++) {
    const trendShift = metric.trend * i / MONTHS_OF_HISTORY * MONTHS_OF_HISTORY * 0.3;
    const target = metric.baseline + trendShift;
    const drift = (rng() - 0.5) * metric.volatility;
    const pullback = (target - current) * 0.10;
    // Mild 6-month seasonality so the lines don't look like white noise
    const season = Math.sin((i / 6) * Math.PI) * metric.volatility * 0.4;
    current += drift + pullback;
    out.push(Math.round((current + season) * 100) / 100);
  }
  return out;
}

const CACHE = new Map<string, Record<MetricKey, number[]>>();

/** Get all 5 metric series for one region. Cached after first call. */
export function getMarketData(regionCode: string): Record<MetricKey, number[]> {
  const cached = CACHE.get(regionCode);
  if (cached) return cached;
  const seed = hashString(regionCode);
  const result = {} as Record<MetricKey, number[]>;
  for (const metric of METRICS) {
    result[metric.key] = generateSeries(metric, seed);
  }
  CACHE.set(regionCode, result);
  return result;
}

// ─── Derivations used by the KPI strip ───────────────────────────────

/**
 * Compute month-over-month and year-over-year changes for the most recent
 * data point of a metric series. Used by KPIStrip.
 */
export function computeKpiStats(values: number[]): {
  current: number;
  /** Absolute change vs the previous month */
  momAbs: number;
  /** Percent change vs the previous month */
  momPct: number;
  /** Absolute change vs 12 months ago */
  yoyAbs: number;
  /** Percent change vs 12 months ago */
  yoyPct: number;
} {
  const n = values.length;
  const current = values[n - 1];
  const prev = values[n - 2] ?? current;
  const yearAgo = values[n - 13] ?? values[0];
  const momAbs = current - prev;
  const momPct = prev !== 0 ? (momAbs / prev) * 100 : 0;
  const yoyAbs = current - yearAgo;
  const yoyPct = yearAgo !== 0 ? (yoyAbs / yearAgo) * 100 : 0;
  return { current, momAbs, momPct, yoyAbs, yoyPct };
}
