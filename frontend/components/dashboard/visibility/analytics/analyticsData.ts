/**
 * Mock data for the Visibility → Analytics ("Tracking Performance") page.
 *
 * All demo data. Carrier names match the Data Network section for
 * cohesion. Timeline series are percentages (0–100) over the last 12
 * weeks; the headline summary is raw transport counts.
 */

// ─── Headline summary (last 90 days) ──────────────────────────────────
export const SUMMARY = {
  total: 1240,
  tracked: 1042,
  allocated: 1153,
  allStopsVisited: 958,
  allStopsEta: 843,
};

export const pct = (n: number, of: number) => (of ? Math.round((n / of) * 100) : 0);

// ─── Weekly timeline (12 weeks of percentages) ────────────────────────
export const WEEKS = 12;

export type MetricKey = "tracked" | "allocated" | "stops_visited" | "stops_eta";

export const TIMELINE: Record<MetricKey, number[]> = {
  allocated:     [90, 91, 92, 91, 93, 94, 93, 95, 94, 95, 96, 93],
  tracked:       [76, 78, 80, 79, 82, 81, 83, 84, 85, 84, 86, 84],
  stops_visited: [70, 71, 73, 72, 74, 75, 76, 77, 78, 79, 80, 82],
  stops_eta:     [60, 62, 61, 63, 65, 64, 66, 68, 67, 69, 70, 68],
};

// Series order + colors + label keys for the chart legend.
export const METRICS: { key: MetricKey; labelKey: string; color: string }[] = [
  { key: "allocated",     labelKey: "visibility.an.m.allocated",     color: "var(--d-accent)" },
  { key: "tracked",       labelKey: "visibility.an.m.tracked",       color: "#22C55E" },
  { key: "stops_visited", labelKey: "visibility.an.m.stops_visited", color: "#3B82F6" },
  { key: "stops_eta",     labelKey: "visibility.an.m.stops_eta",     color: "#8B5CF6" },
];

// ─── Per-carrier performance ──────────────────────────────────────────
export type CarrierPerf = {
  id: string;
  name: string;
  nameAr: string;
  transports: number;
  allocated: number;
  tracked: number;
  allStopsEta: number;
};

export const CARRIER_PERF: CarrierPerf[] = [
  { id: "c3", name: "Peninsula Transport", nameAr: "نقل الجزيرة",       transports: 342, allocated: 330, tracked: 300, allStopsEta: 250 },
  { id: "c1", name: "Al Najm Logistics",   nameAr: "النجم اللوجستية",   transports: 320, allocated: 305, tracked: 286, allStopsEta: 214 },
  { id: "c2", name: "Emirates Road Cargo", nameAr: "شحن طرق الإمارات",  transports: 268, allocated: 255, tracked: 240, allStopsEta: 190 },
  { id: "c4", name: "Desert Line",         nameAr: "خط الصحراء",        transports: 180, allocated: 168, tracked: 150, allStopsEta: 96 },
  { id: "c5", name: "Gulf Freight Co.",    nameAr: "شركة غلف للشحن",     transports: 130, allocated: 95,  tracked: 66,  allStopsEta: 40 },
];
