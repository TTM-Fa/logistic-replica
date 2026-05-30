/**
 * Mock data for the Visibility → Data Network section.
 *
 * Covers three sub-pages:
 *   - Carrier Network   → carriers you exchange visibility with (onboarding
 *                         + GPS-sharing consent status)
 *   - Customers         → companies you share live visibility with
 *   - Road Performance  → how much of the network is delivering GPS, by country
 *
 * All demo data. Company names are plausible GCC logistics/shipper names.
 */

// ─── Carrier network ──────────────────────────────────────────────────
export type OnboardStatus = "accepted" | "invited" | "pending" | "declined";
export type ConsentStatus = "granted" | "pending" | "declined";

export type Carrier = {
  id: string;
  company: string;
  companyAr: string;
  reference: string;
  relationId: string;
  onboarding: OnboardStatus;
  consent: ConsentStatus;
  vehicles: number;
};

export const CARRIERS: Carrier[] = [
  { id: "c1", company: "Al Najm Logistics",   companyAr: "النجم اللوجستية",   reference: "ANL-204", relationId: "SA-10204", onboarding: "accepted", consent: "granted", vehicles: 12 },
  { id: "c2", company: "Emirates Road Cargo",  companyAr: "شحن طرق الإمارات",  reference: "ERC-118", relationId: "AE-30118", onboarding: "accepted", consent: "granted", vehicles: 9 },
  { id: "c3", company: "Peninsula Transport",  companyAr: "نقل الجزيرة",        reference: "PEN-077", relationId: "SA-90077", onboarding: "accepted", consent: "granted", vehicles: 14 },
  { id: "c4", company: "Desert Line",          companyAr: "خط الصحراء",        reference: "DSL-340", relationId: "AE-77340", onboarding: "accepted", consent: "pending", vehicles: 7 },
  { id: "c5", company: "Gulf Freight Co.",     companyAr: "شركة غلف للشحن",     reference: "GFC-512", relationId: "QA-33512", onboarding: "invited",  consent: "pending", vehicles: 0 },
  { id: "c6", company: "Sahara Express",       companyAr: "صحارى إكسبريس",      reference: "SHX-261", relationId: "KW-11261", onboarding: "pending",  consent: "pending", vehicles: 0 },
  { id: "c7", company: "Falcon Carriers",      companyAr: "ناقلات الصقر",       reference: "FAL-089", relationId: "BH-20089", onboarding: "declined", consent: "declined", vehicles: 0 },
];

export function onboardingCounts(carriers: Carrier[]) {
  return {
    accepted: carriers.filter((c) => c.onboarding === "accepted").length,
    invited: carriers.filter((c) => c.onboarding === "invited").length,
    pending: carriers.filter((c) => c.onboarding === "pending").length,
    declined: carriers.filter((c) => c.onboarding === "declined").length,
  };
}

// ─── Customers ────────────────────────────────────────────────────────
export type CustomerStatus = "active" | "pending";
export type TrackingAccess = "full" | "limited";

export type Customer = {
  id: string;
  company: string;
  companyAr: string;
  reference: string;
  sharedViews: number;
  access: TrackingAccess;
  status: CustomerStatus;
};

export const CUSTOMERS: Customer[] = [
  { id: "u1", company: "Almarai Foods",   companyAr: "أغذية المراعي",  reference: "CUST-501", sharedViews: 8, access: "full",    status: "active" },
  { id: "u2", company: "Gulf Steel Co.",  companyAr: "حديد الخليج",    reference: "CUST-502", sharedViews: 5, access: "full",    status: "active" },
  { id: "u3", company: "Lulu Retail",     companyAr: "لولو للتجزئة",   reference: "CUST-503", sharedViews: 3, access: "limited", status: "active" },
  { id: "u4", company: "Agthia Group",    companyAr: "مجموعة أغذية",   reference: "CUST-504", sharedViews: 2, access: "limited", status: "pending" },
  { id: "u5", company: "Zad Holding",     companyAr: "زاد القابضة",    reference: "CUST-505", sharedViews: 4, access: "full",    status: "active" },
];

// ─── Road performance (tracking rate by country) ──────────────────────
export type CountryPerf = {
  id: string;
  name: string;
  nameAr: string;
  tracked: number;
  total: number;
};

export const COUNTRY_PERF: CountryPerf[] = [
  { id: "sa", name: "Saudi Arabia",        nameAr: "السعودية",      tracked: 412, total: 480 },
  { id: "ae", name: "United Arab Emirates", nameAr: "الإمارات",      tracked: 305, total: 330 },
  { id: "qa", name: "Qatar",               nameAr: "قطر",           tracked: 88,  total: 100 },
  { id: "om", name: "Oman",                nameAr: "عُمان",         tracked: 70,  total: 95 },
  { id: "kw", name: "Kuwait",              nameAr: "الكويت",        tracked: 64,  total: 90 },
  { id: "bh", name: "Bahrain",             nameAr: "البحرين",       tracked: 41,  total: 55 },
];

export function perfTotals(rows: CountryPerf[]) {
  const tracked = rows.reduce((s, r) => s + r.tracked, 0);
  const total = rows.reduce((s, r) => s + r.total, 0);
  return { tracked, total, untracked: total - tracked, rate: total ? tracked / total : 0 };
}
