/**
 * Mock data for the Marketplace → RFQ (tender events) page.
 *
 * An RFQ is a strategic, multi-lane tender from a shipper for long-term,
 * high-volume freight. It moves through a lifecycle: open → closing →
 * in evaluation → awarded. All demo data; GCC shippers + themes.
 */

export type RfqStatus = "open" | "closing" | "evaluation" | "awarded";

export type Rfq = {
  id: string;
  name: string;
  nameAr: string;
  shipper: string;
  shipperAr: string;
  desc: string;
  descAr: string;
  status: RfqStatus;
  lanes: number;
  annualVolume: number; // shipments / year
  termMonths: number;
  regions: string;
  regionsAr: string;
  round: number;
  totalRounds: number;
  publishedDaysAgo: number;
  deadlineDays: number | null; // null once submissions are closed
};

export const RFQS: Rfq[] = [
  {
    id: "rfq1", name: "GCC Reefer Network 2026", nameAr: "شبكة مبرّدات الخليج 2026",
    shipper: "Almarai Foods", shipperAr: "أغذية المراعي",
    desc: "Temperature-controlled distribution across Gulf retail DCs.", descAr: "توزيع مبرّد عبر مراكز التجزئة في الخليج.",
    status: "open", lanes: 12, annualVolume: 3400, termMonths: 12, regions: "KSA · UAE · Qatar", regionsAr: "السعودية · الإمارات · قطر",
    round: 1, totalRounds: 2, publishedDaysAgo: 5, deadlineDays: 2,
  },
  {
    id: "rfq2", name: "Cross-border Dry FTL Tender", nameAr: "مناقصة الحمولات الجافة العابرة",
    shipper: "Lulu Retail", shipperAr: "لولو للتجزئة",
    desc: "Full-truckload dry freight on core cross-border lanes.", descAr: "حمولات كاملة جافة على المسارات العابرة الرئيسية.",
    status: "open", lanes: 8, annualVolume: 2100, termMonths: 24, regions: "GCC-wide", regionsAr: "كل دول الخليج",
    round: 1, totalRounds: 1, publishedDaysAgo: 2, deadlineDays: 9,
  },
  {
    id: "rfq3", name: "Industrial Flatbed Programme", nameAr: "برنامج المسطّحات الصناعية",
    shipper: "Gulf Steel Co.", shipperAr: "حديد الخليج",
    desc: "Steel and heavy industrial loads to plants and ports.", descAr: "حمولات الحديد والصناعات الثقيلة إلى المصانع والموانئ.",
    status: "closing", lanes: 6, annualVolume: 1200, termMonths: 12, regions: "KSA · Bahrain", regionsAr: "السعودية · البحرين",
    round: 2, totalRounds: 2, publishedDaysAgo: 18, deadlineDays: 1,
  },
  {
    id: "rfq4", name: "Fuel & Chemicals Haulage", nameAr: "نقل الوقود والكيماويات",
    shipper: "Gulf Petro", shipperAr: "غلف بترو",
    desc: "ADR tanker haulage for fuel and bulk chemicals.", descAr: "نقل صهاريج للوقود والكيماويات السائبة.",
    status: "evaluation", lanes: 5, annualVolume: 900, termMonths: 36, regions: "KSA", regionsAr: "السعودية",
    round: 2, totalRounds: 2, publishedDaysAgo: 34, deadlineDays: null,
  },
  {
    id: "rfq5", name: "Retail Replenishment 2026", nameAr: "تموين التجزئة 2026",
    shipper: "Zad Holding", shipperAr: "زاد القابضة",
    desc: "Store replenishment runs on a fixed weekly schedule.", descAr: "رحلات تموين المتاجر بجدول أسبوعي ثابت.",
    status: "awarded", lanes: 10, annualVolume: 2800, termMonths: 12, regions: "Qatar · UAE", regionsAr: "قطر · الإمارات",
    round: 2, totalRounds: 2, publishedDaysAgo: 52, deadlineDays: null,
  },
];

export type TabKey = "all" | RfqStatus;

export const TABS: { key: TabKey; labelKey: string }[] = [
  { key: "all", labelKey: "marketplace.rfq.tab.all" },
  { key: "open", labelKey: "marketplace.rfq.tab.open" },
  { key: "closing", labelKey: "marketplace.rfq.tab.closing" },
  { key: "evaluation", labelKey: "marketplace.rfq.tab.evaluation" },
  { key: "awarded", labelKey: "marketplace.rfq.tab.awarded" },
];

export function matchesTab(r: Rfq, tab: TabKey) {
  return tab === "all" || r.status === tab;
}

export function tabCounts(rfqs: Rfq[]): Record<TabKey, number> {
  const out = {} as Record<TabKey, number>;
  for (const { key } of TABS) out[key] = rfqs.filter((r) => matchesTab(r, key)).length;
  return out;
}
