/**
 * Mock data for the Visibility → Fleet (Fleet monitor) page.
 *
 * Reuses the GCC city catalogue from the Transports page so vehicle
 * positions + trip routes line up with the same map. All demo data.
 *
 * Each vehicle carries an optional CURRENT trip (with a static progress +
 * ETA, so the roster renders identically on server and client) and an
 * optional NEXT scheduled trip.
 */

import { CITIES, type CityId } from "../transports/transportsData";

export { CITIES };
export type { CityId };

export type VehicleStatus = "driving" | "idle" | "loading" | "maintenance";
export type VehicleGroup = "dedicated" | "partner";

/** The trip a vehicle is on right now (only when status === "driving"). */
export type ActiveTrip = {
  from: CityId;
  to: CityId;
  /** 0 → 1 along the route. */
  progress: number;
  /** Minutes to destination. */
  etaMin: number;
  /** Running behind schedule. */
  delayed: boolean;
};

/** The next scheduled trip, if any. */
export type NextTrip = {
  from: CityId;
  to: CityId;
  /** Minutes until departure. */
  departsInMin: number;
};

export type Vehicle = {
  id: string;
  name: string;
  plate: string;
  carrier: string;
  carrierAr: string;
  driver: string;
  driverAr: string;
  type: string; // body-type label suffix (reefer, curtain, …)
  status: VehicleStatus;
  group: VehicleGroup;
  currentCity: CityId;
  active?: ActiveTrip;
  next?: NextTrip;
};

export const VEHICLES: Vehicle[] = [
  {
    id: "v1", name: "Volvo FH16", plate: "D 48213", carrier: "Gulf Freight Co.", carrierAr: "شركة غلف للشحن",
    driver: "Khalid A.", driverAr: "خالد أ.", type: "reefer", status: "driving", group: "dedicated", currentCity: "dubai",
    active: { from: "dubai", to: "doha", progress: 0.62, etaMin: 200, delayed: false },
    next: { from: "doha", to: "abudhabi", departsInMin: 360 },
  },
  {
    id: "v2", name: "Scania R500", plate: "R 90671", carrier: "Peninsula Transport", carrierAr: "نقل الجزيرة",
    driver: "Sami H.", driverAr: "سامي ح.", type: "curtain", status: "driving", group: "dedicated", currentCity: "riyadh",
    active: { from: "riyadh", to: "dammam", progress: 0.30, etaMin: 145, delayed: false },
  },
  {
    id: "v3", name: "MAN TGX", plate: "K 11254", carrier: "Al Najm Logistics", carrierAr: "النجم اللوجستية",
    driver: "Omar S.", driverAr: "عمر س.", type: "flatbed", status: "driving", group: "partner", currentCity: "kuwait",
    active: { from: "kuwait", to: "riyadh", progress: 0.48, etaMin: 320, delayed: true },
  },
  {
    id: "v4", name: "Mercedes Actros", plate: "AD 77390", carrier: "Desert Line", carrierAr: "خط الصحراء",
    driver: "Faisal R.", driverAr: "فيصل ر.", type: "reefer", status: "driving", group: "dedicated", currentCity: "abudhabi",
    active: { from: "abudhabi", to: "muscat", progress: 0.78, etaMin: 95, delayed: false },
  },
  {
    id: "v5", name: "Volvo FM", plate: "R 90712", carrier: "Peninsula Transport", carrierAr: "نقل الجزيرة",
    driver: "Nasser K.", driverAr: "ناصر ك.", type: "tanker", status: "idle", group: "dedicated", currentCity: "dammam",
    next: { from: "dammam", to: "manama", departsInMin: 480 },
  },
  {
    id: "v6", name: "DAF XF", plate: "Q 33108", carrier: "Gulf Freight Co.", carrierAr: "شركة غلف للشحن",
    driver: "Yousef M.", driverAr: "يوسف م.", type: "curtain", status: "loading", group: "partner", currentCity: "doha",
    next: { from: "doha", to: "abudhabi", departsInMin: 90 },
  },
  {
    id: "v7", name: "Iveco S-Way", plate: "D 61559", carrier: "Emirates Road Cargo", carrierAr: "شحن طرق الإمارات",
    driver: "—", driverAr: "—", type: "box", status: "maintenance", group: "dedicated", currentCity: "dubai",
  },
  {
    id: "v8", name: "Scania S730", plate: "M 50442", carrier: "Emirates Road Cargo", carrierAr: "شحن طرق الإمارات",
    driver: "Tariq B.", driverAr: "طارق ب.", type: "flatbed", status: "driving", group: "partner", currentCity: "muscat",
    active: { from: "muscat", to: "dubai", progress: 0.20, etaMin: 70, delayed: false },
    next: { from: "dubai", to: "abudhabi", departsInMin: 600 },
  },
];

// ─── Filters ──────────────────────────────────────────────────────────
export type GroupFilter = "all" | "dedicated" | "partner";
export type StatusFilter = "all" | "driving" | "idle" | "loading" | "maintenance";

export function filterVehicles(
  vehicles: Vehicle[],
  group: GroupFilter,
  status: StatusFilter,
): Vehicle[] {
  return vehicles.filter((v) => {
    if (group !== "all" && v.group !== group) return false;
    if (status !== "all" && v.status !== status) return false;
    return true;
  });
}

// ─── Summary counts (for the stat strip) ──────────────────────────────
export function fleetCounts(vehicles: Vehicle[]) {
  return {
    driving: vehicles.filter((v) => v.status === "driving").length,
    idle: vehicles.filter((v) => v.status === "idle").length,
    loading: vehicles.filter((v) => v.status === "loading").length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
    delayed: vehicles.filter((v) => v.active?.delayed).length,
  };
}
