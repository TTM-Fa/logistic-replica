/**
 * Mock data for the Visibility → Transports page.
 *
 * All demo data. When a backend exists, replace SHIPMENTS with values
 * fetched from the API; the City coordinates stay (they position the
 * markers on the real Leaflet/OpenStreetMap map).
 *
 * Coordinates are real-world latitude / longitude for each Gulf city, so
 * markers sit on their true geographic location and OSRM can route
 * between them along actual roads.
 */

export type CityId =
  | "kuwait"
  | "dammam"
  | "manama"
  | "riyadh"
  | "doha"
  | "abudhabi"
  | "dubai"
  | "muscat"
  | "jeddah";

export type City = { name: string; nameAr: string; lat: number; lng: number };

export const CITIES: Record<CityId, City> = {
  kuwait:   { name: "Kuwait City", nameAr: "مدينة الكويت", lat: 29.3759, lng: 47.9774 },
  dammam:   { name: "Dammam",      nameAr: "الدمام",       lat: 26.4207, lng: 50.0888 },
  manama:   { name: "Manama",      nameAr: "المنامة",      lat: 26.2285, lng: 50.5860 },
  riyadh:   { name: "Riyadh",      nameAr: "الرياض",       lat: 24.7136, lng: 46.6753 },
  doha:     { name: "Doha",        nameAr: "الدوحة",       lat: 25.2854, lng: 51.5310 },
  abudhabi: { name: "Abu Dhabi",   nameAr: "أبو ظبي",      lat: 24.4539, lng: 54.3773 },
  dubai:    { name: "Dubai",       nameAr: "دبي",          lat: 25.2048, lng: 55.2708 },
  muscat:   { name: "Muscat",      nameAr: "مسقط",         lat: 23.5880, lng: 58.3829 },
  jeddah:   { name: "Jeddah",      nameAr: "جدة",          lat: 21.4858, lng: 39.1925 },
};

// The seven operational statuses a shipment can be in.
export type ShipmentStatus =
  | "on_time"
  | "delayed"
  | "unknown"
  | "upcoming"
  | "untracked"
  | "completed"
  | "cancelled";

export type Shipment = {
  id: string;
  ref: string;
  from: CityId;
  to: CityId;
  carrier: string;
  carrierAr: string;
  plate: string;
  status: ShipmentStatus;
  /** Whether a live GPS feed is currently coming in for this vehicle. */
  tracking: boolean;
  /** Position along the route, 0 (origin) → 1 (destination). */
  progress: number;
  /** Minutes until the next stop, or null when not applicable. */
  etaMin: number | null;
  /** Minutes since the last GPS ping, or null when there is no signal. */
  updatedMin: number | null;
};

export const SHIPMENTS: Shipment[] = [
  {
    id: "s1", ref: "SHN-10421", from: "dubai", to: "doha",
    carrier: "Gulf Freight Co.", carrierAr: "شركة غلف للشحن", plate: "D 48213",
    status: "on_time", tracking: true, progress: 0.62, etaMin: 200, updatedMin: 2,
  },
  {
    id: "s2", ref: "SHN-10422", from: "riyadh", to: "dammam",
    carrier: "Peninsula Transport", carrierAr: "نقل الجزيرة", plate: "R 90671",
    status: "on_time", tracking: true, progress: 0.30, etaMin: 145, updatedMin: 1,
  },
  {
    id: "s3", ref: "SHN-10423", from: "kuwait", to: "riyadh",
    carrier: "Al Najm Logistics", carrierAr: "النجم اللوجستية", plate: "K 11254",
    status: "delayed", tracking: true, progress: 0.48, etaMin: 320, updatedMin: 4,
  },
  {
    id: "s4", ref: "SHN-10424", from: "abudhabi", to: "muscat",
    carrier: "Desert Line", carrierAr: "خط الصحراء", plate: "AD 77390",
    status: "on_time", tracking: true, progress: 0.78, etaMin: 95, updatedMin: 3,
  },
  {
    id: "s5", ref: "SHN-10425", from: "dammam", to: "manama",
    carrier: "Peninsula Transport", carrierAr: "نقل الجزيرة", plate: "R 90712",
    status: "upcoming", tracking: false, progress: 0, etaMin: null, updatedMin: null,
  },
  {
    id: "s6", ref: "SHN-10426", from: "doha", to: "abudhabi",
    carrier: "Gulf Freight Co.", carrierAr: "شركة غلف للشحن", plate: "Q 33108",
    status: "unknown", tracking: true, progress: 0.5, etaMin: null, updatedMin: 38,
  },
  {
    id: "s7", ref: "SHN-10427", from: "muscat", to: "dubai",
    carrier: "Emirates Road Cargo", carrierAr: "شحن طرق الإمارات", plate: "M 50442",
    status: "completed", tracking: false, progress: 1, etaMin: null, updatedMin: 64,
  },
  {
    id: "s8", ref: "SHN-10428", from: "manama", to: "kuwait",
    carrier: "Al Najm Logistics", carrierAr: "النجم اللوجستية", plate: "B 20817",
    status: "untracked", tracking: false, progress: 0.2, etaMin: null, updatedMin: null,
  },
  {
    id: "s9", ref: "SHN-10429", from: "riyadh", to: "jeddah",
    carrier: "Desert Line", carrierAr: "خط الصحراء", plate: "R 88204",
    status: "cancelled", tracking: false, progress: 0, etaMin: null, updatedMin: null,
  },
  {
    id: "s10", ref: "SHN-10430", from: "dubai", to: "abudhabi",
    carrier: "Emirates Road Cargo", carrierAr: "شحن طرق الإمارات", plate: "D 61559",
    status: "on_time", tracking: true, progress: 0.20, etaMin: 70, updatedMin: 1,
  },
];

// ─── Status tabs ──────────────────────────────────────────────────────
// "tracking" is a cross-cutting filter (any shipment with a live feed),
// the rest map 1:1 to a status value. "all" matches everything.
export type TabKey =
  | "all"
  | "tracking"
  | "on_time"
  | "delayed"
  | "unknown"
  | "upcoming"
  | "untracked"
  | "completed"
  | "cancelled";

export const TABS: { key: TabKey; labelKey: string }[] = [
  { key: "all",       labelKey: "visibility.tr.tab.all" },
  { key: "tracking",  labelKey: "visibility.tr.tab.tracking" },
  { key: "on_time",   labelKey: "visibility.tr.tab.on_time" },
  { key: "delayed",   labelKey: "visibility.tr.tab.delayed" },
  { key: "unknown",   labelKey: "visibility.tr.tab.unknown" },
  { key: "upcoming",  labelKey: "visibility.tr.tab.upcoming" },
  { key: "untracked", labelKey: "visibility.tr.tab.untracked" },
  { key: "completed", labelKey: "visibility.tr.tab.completed" },
  { key: "cancelled", labelKey: "visibility.tr.tab.cancelled" },
];

/** Does a shipment belong under the given tab? */
export function matchesTab(s: Shipment, tab: TabKey): boolean {
  if (tab === "all") return true;
  if (tab === "tracking") return s.tracking;
  return s.status === tab;
}

/** Count of shipments under each tab, keyed by tab. */
export function tabCounts(shipments: Shipment[]): Record<TabKey, number> {
  const out = {} as Record<TabKey, number>;
  for (const { key } of TABS) {
    out[key] = shipments.filter((s) => matchesTab(s, key)).length;
  }
  return out;
}
