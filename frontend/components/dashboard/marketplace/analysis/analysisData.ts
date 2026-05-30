/**
 * Mock data for the Marketplace → Analysis page.
 *
 * Each analysis is a freight cost/rate study a procurement team builds
 * over their lanes (rate benchmarks, lane-cost models, spend, savings).
 * All demo data; figures kept as preformatted strings (SAR / %).
 */

export type AnalysisType = "rate_benchmark" | "lane_cost" | "spend" | "savings";
export type AnalysisStatus = "ready" | "running" | "draft";

export type Analysis = {
  id: string;
  name: string;
  nameAr: string;
  type: AnalysisType;
  scope: string;
  scopeAr: string;
  status: AnalysisStatus;
  /** Preformatted headline figure, e.g. "+4.8%" or "SAR 18.4M". */
  resultValue: string;
  resultLabelKey: string;
  /** Result colour: ok=good, alert=bad, info=neutral. */
  resultTone: "ok" | "alert" | "info";
  lanes: number;
  updatedDaysAgo: number;
};

export const ANALYSES: Analysis[] = [
  {
    id: "an1", name: "GCC Reefer Rate Benchmark", nameAr: "مقارنة أسعار المبرّدات الخليجية",
    type: "rate_benchmark", scope: "Reefer · KSA ↔ UAE", scopeAr: "مبرّد · السعودية ↔ الإمارات",
    status: "ready", resultValue: "+4.8%", resultLabelKey: "marketplace.an.r.vs_market", resultTone: "alert",
    lanes: 14, updatedDaysAgo: 2,
  },
  {
    id: "an2", name: "Cross-border Lane Cost Model", nameAr: "نموذج تكلفة المسارات العابرة",
    type: "lane_cost", scope: "All cross-border lanes", scopeAr: "كل المسارات العابرة",
    status: "ready", resultValue: "SAR 7.90", resultLabelKey: "marketplace.an.r.per_km", resultTone: "info",
    lanes: 22, updatedDaysAgo: 5,
  },
  {
    id: "an3", name: "Annual Freight Spend 2026", nameAr: "إنفاق الشحن السنوي 2026",
    type: "spend", scope: "All modes · all regions", scopeAr: "كل الوسائط · كل المناطق",
    status: "ready", resultValue: "SAR 18.4M", resultLabelKey: "marketplace.an.r.spend", resultTone: "info",
    lanes: 60, updatedDaysAgo: 1,
  },
  {
    id: "an4", name: "Backhaul Savings Opportunity", nameAr: "فرصة توفير حمولات العودة",
    type: "savings", scope: "Empty-leg lanes", scopeAr: "مسارات الأرجل الفارغة",
    status: "running", resultValue: "12%", resultLabelKey: "marketplace.an.r.potential", resultTone: "ok",
    lanes: 8, updatedDaysAgo: 0,
  },
  {
    id: "an5", name: "Tanker Rate Study", nameAr: "دراسة أسعار الصهاريج",
    type: "rate_benchmark", scope: "Tanker · KSA", scopeAr: "صهريج · السعودية",
    status: "draft", resultValue: "−2.1%", resultLabelKey: "marketplace.an.r.vs_market", resultTone: "ok",
    lanes: 5, updatedDaysAgo: 9,
  },
];

export function analysisSummary(items: Analysis[]) {
  return {
    total: items.length,
    lanes: items.reduce((s, a) => s + a.lanes, 0),
  };
}
