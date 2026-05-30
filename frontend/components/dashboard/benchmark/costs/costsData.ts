/**
 * costsData.ts — Mock data for the Costs sub-pages (Market + Lane).
 *
 * Total Cost of Ownership (TCO) model — 5 cost components that together
 * make up a carrier's index of running a fleet:
 *
 *   1. Services & others (cost to serve)
 *   2. Toll
 *   3. Vehicle (truck maintenance)
 *   4. Fuel & AdBlue (diesel)
 *   5. Driver costs (driver salaries)
 *
 * Quarterly cadence, 20 quarters total = 5 years:
 *   - 16 historical quarters
 *   - 4 forecast quarters (visualised distinctly in the chart + table)
 *
 * Data is generated deterministically from a seed derived from the
 * region or lane, so the chart looks the same on every reload.
 */

// ─── Geography ────────────────────────────────────────────────────────

export type Country = { code: string; name: string };

export const COUNTRIES: Country[] = [
  { code: "GCC", name: "GCC (All)" },
  { code: "QA",  name: "Qatar" },
  { code: "SA",  name: "Saudi Arabia" },
  { code: "AE",  name: "UAE" },
  { code: "OM",  name: "Oman" },
  { code: "BH",  name: "Bahrain" },
  { code: "KW",  name: "Kuwait" },
];

// ─── Cost components ─────────────────────────────────────────────────

export type ComponentKey =
  | "services"
  | "toll"
  | "vehicle"
  | "fuel"
  | "driver";

export type ComponentDef = {
  key: ComponentKey;
  labelKey: string;
  color: string;
  /** Approximate share of the total cost index (out of 100) */
  baselineShare: number;
  /** Per-quarter volatility */
  volatility: number;
  /** Total drift over the 20-quarter window */
  totalTrend: number;
};

/**
 * Baseline proportions chosen to roughly match real-world EU fleet TCO
 * splits and the Insights screenshot values. They sum to 100.
 */
export const COMPONENTS: ComponentDef[] = [
  { key: "services", labelKey: "costs.metric.services", color: "#F5C26B", baselineShare: 12, volatility: 0.6, totalTrend: 1.5 },
  { key: "toll",     labelKey: "costs.metric.toll",     color: "#7AC8E2", baselineShare: 12, volatility: 0.5, totalTrend: 1.0 },
  { key: "vehicle",  labelKey: "costs.metric.vehicle",  color: "#9CCB7B", baselineShare: 18, volatility: 0.7, totalTrend: 2.0 },
  { key: "fuel",     labelKey: "costs.metric.fuel",     color: "#E89A6C", baselineShare: 28, volatility: 1.6, totalTrend: 4.5 },
  { key: "driver",   labelKey: "costs.metric.driver",   color: "#D26A6A", baselineShare: 30, volatility: 1.0, totalTrend: 6.0 },
];

export function getComponent(key: ComponentKey): ComponentDef {
  const c = COMPONENTS.find((x) => x.key === key);
  if (!c) throw new Error(`Unknown cost component: ${key}`);
  return c;
}

// ─── Quarter labels ──────────────────────────────────────────────────

export type QuarterLabel = {
  /** "Q1 '21" */
  short: string;
  /** "Q1 2021" */
  full: string;
  quarter: 1 | 2 | 3 | 4;
  year: number;
  isForecast: boolean;
};

const QUARTERS_TOTAL = 20;
const FORECAST_QUARTERS = 4;

/**
 * Generate 20 quarterly labels ending at the current quarter. Last 4 are
 * marked as forecast. So if "today" is Q2 2026, we get Q3 '21 → Q2 '26
 * historical, then Q3 '26 → Q2 '27 as forecast.
 */
export function generateQuarterLabels(): QuarterLabel[] {
  const today = new Date();
  const currentQuarter = (Math.floor(today.getMonth() / 3) + 1) as 1 | 2 | 3 | 4;
  const currentYear = today.getFullYear();

  // Walk back QUARTERS_TOTAL - FORECAST_QUARTERS quarters from "today",
  // then forward the same amount, plus FORECAST_QUARTERS forward.
  const labels: QuarterLabel[] = [];
  const historyCount = QUARTERS_TOTAL - FORECAST_QUARTERS;

  for (let i = 0; i < QUARTERS_TOTAL; i++) {
    // Offset relative to "now": negative = past, 0 = current, positive = future
    const offset = i - (historyCount - 1);
    let q = currentQuarter + offset;
    let y = currentYear;
    while (q < 1) { q += 4; y -= 1; }
    while (q > 4) { q -= 4; y += 1; }
    labels.push({
      short: `Q${q} '${String(y).slice(-2)}`,
      full:  `Q${q} ${y}`,
      quarter: q as 1 | 2 | 3 | 4,
      year:    y,
      isForecast: i >= historyCount,
    });
  }
  return labels;
}

// ─── Seeded data generation ──────────────────────────────────────────

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
 * Generate a quarterly series for one component on one lane/region.
 *
 * Each component drifts according to its `totalTrend` over the full
 * 20-quarter window, with mean-reverting noise around the moving target.
 * The 4 forecast quarters are smoother (lower volatility) since they
 * represent a model prediction, not actual data.
 */
function generateComponentSeries(
  comp: ComponentDef,
  baseSeed: number,
): number[] {
  const seed = (baseSeed + hashString(comp.key) * 13) >>> 0;
  const rng = seededRandom(seed);
  const out: number[] = [];
  const start = comp.baselineShare;
  const end = start + comp.totalTrend;

  let current = start;
  for (let i = 0; i < QUARTERS_TOTAL; i++) {
    const t = i / (QUARTERS_TOTAL - 1);
    const target = start + (end - start) * t;
    const isForecast = i >= QUARTERS_TOTAL - FORECAST_QUARTERS;
    const vol = isForecast ? comp.volatility * 0.25 : comp.volatility;
    const drift = (rng() - 0.5) * vol;
    const pullback = (target - current) * 0.18;
    current += drift + pullback;
    out.push(Math.round(current * 100) / 100);
  }
  return out;
}

const CACHE = new Map<string, Record<ComponentKey, number[]>>();

/**
 * Get all 5 cost-component series for a region or lane.
 * Cached after first call per key.
 *
 * The `key` should be:
 *   - a country code (e.g., "QA") for the Market Costs page
 *   - a lane key (e.g., "QA-SA") for the Lane Costs page
 */
export function getCostsData(key: string): Record<ComponentKey, number[]> {
  const cached = CACHE.get(key);
  if (cached) return cached;
  const seed = hashString(key);
  const result = {} as Record<ComponentKey, number[]>;
  for (const comp of COMPONENTS) {
    result[comp.key] = generateComponentSeries(comp, seed);
  }
  CACHE.set(key, result);
  return result;
}

// ─── Helpers ─────────────────────────────────────────────────────────

/** Sum the 5 components at a given quarter to get the total cost index */
export function totalAtQuarter(
  data: Record<ComponentKey, number[]>,
  quarter: number,
): number {
  return COMPONENTS.reduce((sum, c) => sum + data[c.key][quarter], 0);
}

/** Build the totals array (cost index over time) from a data record */
export function getTotalsSeries(
  data: Record<ComponentKey, number[]>,
): number[] {
  const len = data.services.length;
  return Array.from({ length: len }, (_, i) => totalAtQuarter(data, i));
}

/**
 * Convert absolute index values to per-quarter percent shares.
 * Used by the "percentage" view mode — each quarter's components sum to 100.
 */
export function toPercentageData(
  data: Record<ComponentKey, number[]>,
): Record<ComponentKey, number[]> {
  const totals = getTotalsSeries(data);
  const out = {} as Record<ComponentKey, number[]>;
  for (const comp of COMPONENTS) {
    out[comp.key] = data[comp.key].map((v, i) =>
      totals[i] > 0 ? Math.round((v / totals[i]) * 10000) / 100 : 0,
    );
  }
  return out;
}

export const FORECAST_COUNT = FORECAST_QUARTERS;
