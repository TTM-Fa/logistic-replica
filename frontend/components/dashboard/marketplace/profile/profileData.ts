/**
 * Mock data for the Marketplace → Profile page (your company profile).
 * All demo data — the operator's own carrier company.
 */

export const COMPANY = {
  name: "Trust Logistics",
  nameAr: "ثقة للخدمات اللوجستية",
  legalName: "Trust Logistics LLC",
  legalNameAr: "ثقة للخدمات اللوجستية ذ.م.م",
  location: "Riyadh, Saudi Arabia",
  locationAr: "الرياض، السعودية",
  memberSince: "2024",
  registration: "CR-1010583924",
  fleetSize: 48,
  founded: "2019",
  verified: true,
};

export const STATS = [
  { key: "shipments", value: "1,240", labelKey: "marketplace.pf.stat.shipments", tone: "info" },
  { key: "ontime", value: "96%", labelKey: "marketplace.pf.stat.ontime", tone: "ok" },
  { key: "rating", value: "4.8", labelKey: "marketplace.pf.stat.rating", tone: "violet" },
  { key: "lanes", value: "32", labelKey: "marketplace.pf.stat.lanes", tone: "muted" },
] as const;

// Regions the carrier operates in (bilingual labels).
export const REGIONS: { en: string; ar: string }[] = [
  { en: "Saudi Arabia", ar: "السعودية" },
  { en: "UAE", ar: "الإمارات" },
  { en: "Qatar", ar: "قطر" },
  { en: "Kuwait", ar: "الكويت" },
  { en: "Bahrain", ar: "البحرين" },
  { en: "Oman", ar: "عُمان" },
];

// Equipment types reuse the visibility body-type label keys.
export const EQUIPMENT = ["reefer", "curtain", "flatbed", "box", "tanker"] as const;

export type DocStatus = "valid" | "expiring" | "missing";

export type DocItem = {
  key: string;
  status: DocStatus;
  /** Days until expiry (for "expiring"), or null. */
  expiresInDays: number | null;
  /** Expiry year (for "valid"), or null. */
  expiryYear: string | null;
};

export const DOCUMENTS: DocItem[] = [
  { key: "cr", status: "valid", expiresInDays: null, expiryYear: "2027" },
  { key: "licence", status: "valid", expiresInDays: null, expiryYear: "2026" },
  { key: "insurance", status: "expiring", expiresInDays: 30, expiryYear: null },
  { key: "vat", status: "valid", expiresInDays: null, expiryYear: "2028" },
  { key: "bank", status: "missing", expiresInDays: null, expiryYear: null },
];

export function verificationPct(docs: DocItem[]) {
  const ok = docs.filter((d) => d.status !== "missing").length;
  return Math.round((ok / docs.length) * 100);
}
