/**
 * capacityData.ts — Mock data for the Capacity dashboard page.
 *
 * Generates 8 metric time-series for any GCC country pair:
 *   1. Capacity Index           (general)
 *   2. Spot Offers Index        (general)
 *   3. Contracted Load Rejection Rate (general — %)
 *   4. Diesel Price             (general — index)
 *   5. Contract Price QAR/km    (CONTRACT category)
 *   6. Contract Price Index     (CONTRACT category)
 *   7. Spot Price QAR/km        (SPOT category)
 *   8. Spot Price Index         (SPOT category)
 *
 * Everything is generated deterministically from a seed derived from the
 * (fromCountry, toCountry) pair, so the same lane always renders the
 * same chart on reload.
 *
 * When the real backend lands, replace `getCapacityData` with a fetch
 * that returns the same shape — components don't need to change.
 */

// ─── Country list (GCC) ──────────────────────────────────────────────

export type Country = { code: string; name: string };

export const COUNTRIES: Country[] = [
  { code: "QA", name: "Qatar" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "UAE" },
  { code: "OM", name: "Oman" },
  { code: "BH", name: "Bahrain" },
  { code: "KW", name: "Kuwait" },
];

// ─── Metric catalogue ────────────────────────────────────────────────

export type MetricKey =
  | "capacity_index"
  | "spot_offers_index"
  | "load_rejection_rate"
  | "diesel_price"
  | "contract_price_qar_km"
  | "contract_price_index"
  | "spot_price_qar_km"
  | "spot_price_index";

/** Category groupings shown in the metrics dropdown */
export type MetricCategory = "general" | "contract" | "spot";

export type MetricDef = {
  key: MetricKey;
  labelKey: string;       // translation key
  category: MetricCategory;
  color: string;          // line color in the chart + dot in the table
  yUnit: string;          // suffix shown in the table cell ("%", "QAR/km", "")
  /** Approximate baseline value used to seed the random walk */
  baseline: number;
  /** How jumpy the line is */
  volatility: number;
  /** Decimal precision for displayed value */
  decimals: number;
};

export const METRICS: MetricDef[] = [
  { key: "capacity_index",         labelKey: "capacity.metric.capacity_index",         category: "general",  color: "#22C55E", yUnit: "",       baseline: 95,  volatility: 4,  decimals: 2 },
  { key: "spot_offers_index",      labelKey: "capacity.metric.spot_offers_index",      category: "general",  color: "#A855F7", yUnit: "",       baseline: 108, volatility: 6,  decimals: 2 },
  { key: "load_rejection_rate",    labelKey: "capacity.metric.load_rejection_rate",    category: "general",  color: "#EF4444", yUnit: "%",      baseline: 14,  volatility: 2,  decimals: 1 },
  { key: "diesel_price",           labelKey: "capacity.metric.diesel_price",           category: "general",  color: "#F59E0B", yUnit: "",       baseline: 104, volatility: 3,  decimals: 2 },
  { key: "contract_price_qar_km",  labelKey: "capacity.metric.contract_price_qar_km",  category: "contract", color: "#06B6D4", yUnit: "QAR/km", baseline: 6.2, volatility: 0.25, decimals: 2 },
  { key: "contract_price_index",   labelKey: "capacity.metric.contract_price_index",   category: "contract", color: "#0EA5E9", yUnit: "",       baseline: 102, volatility: 2.5, decimals: 2 },
  { key: "spot_price_qar_km",      labelKey: "capacity.metric.spot_price_qar_km",      category: "spot",     color: "var(--d-accent)", yUnit: "QAR/km", baseline: 7.4, volatility: 0.5, decimals: 2 },
  { key: "spot_price_index",       labelKey: "capacity.metric.spot_price_index",       category: "spot",     color: "#3B82F6", yUnit: "",       baseline: 140, volatility: 7,  decimals: 2 },
];

/** Helper to grab a metric definition by key */
export function getMetric(key: MetricKey): MetricDef {
  const m = METRICS.find((x) => x.key === key);
  if (!m) throw new Error(`Unknown metric: ${key}`);
  return m;
}

// ─── Calendar week labels ────────────────────────────────────────────

export type WeekLabel = {
  cw: string;       // "CW36"
  year: number;     // 2024
  full: string;     // "CW36, 2024" — used in chart tooltip
};

const WEEKS_OF_HISTORY = 104; // 2 years

export function generateCapacityWeekLabels(): WeekLabel[] {
  const today = new Date();
  const labels: WeekLabel[] = [];

  for (let i = WEEKS_OF_HISTORY - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i * 7);

    // Approximate ISO week number
    const yearStart = new Date(d.getFullYear(), 0, 1);
    const dayOfYear = Math.floor((d.getTime() - yearStart.getTime()) / 86400000);
    const week = Math.ceil((dayOfYear + 1) / 7);

    labels.push({
      cw: `CW${week}`,
      year: d.getFullYear(),
      full: `CW${week}, ${d.getFullYear()}`,
    });
  }

  return labels;
}

// ─── Deterministic series generation ─────────────────────────────────

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Hash a (fromCountry, toCountry) pair into a stable integer seed */
function hashPair(from: string, to: string): number {
  let h = 5381;
  const s = `${from}-${to}`;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Build one weekly series for a metric on a specific lane.
 * Mean-reverting random walk with mild seasonality — same generator
 * we use elsewhere in the dashboard.
 */
function generateSeries(metric: MetricDef, laneSeed: number): number[] {
  // Combine lane seed with metric-specific offset so each metric
  // looks different on the same lane.
  const seed = (laneSeed + metric.key.length * 977) >>> 0;
  const rng = seededRandom(seed);
  const out: number[] = [];
  let current = metric.baseline;

  for (let i = 0; i < WEEKS_OF_HISTORY; i++) {
    const drift = (rng() - 0.5) * metric.volatility;
    const pullback = (metric.baseline - current) * 0.05;
    // Seasonality: gentle 26-week sinusoid scaled by metric volatility
    const season = Math.sin((i / 26) * Math.PI) * metric.volatility * 0.35;
    current += drift + pullback;

    // Round to the metric's decimal precision
    const mult = 10 ** metric.decimals;
    out.push(Math.round((current + season) * mult) / mult);
  }

  return out;
}

// Cache so we don't regenerate the same lane's data on every render
const CACHE = new Map<string, Record<MetricKey, number[]>>();

/**
 * Get all 8 metric series for a (from, to) country pair.
 * Cached after first call per pair.
 */
export function getCapacityData(
  fromCountry: string,
  toCountry: string,
): Record<MetricKey, number[]> {
  const cacheKey = `${fromCountry}-${toCountry}`;
  const cached = CACHE.get(cacheKey);
  if (cached) return cached;

  const seed = hashPair(fromCountry, toCountry);
  const result = {} as Record<MetricKey, number[]>;
  for (const metric of METRICS) {
    result[metric.key] = generateSeries(metric, seed);
  }
  CACHE.set(cacheKey, result);
  return result;
}
