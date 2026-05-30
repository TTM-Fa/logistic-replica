/**
 * Mock data for the Visibility → Vehicle Management section.
 *
 * Covers the three sub-pages:
 *   - My Vehicles      → dedicated vehicles + GPS connection health
 *   - Partner Vehicles → vehicles partner carriers shared with you
 *   - Integrations     → telematics/GPS providers you can connect
 *
 * Reuses the GCC city catalogue from the Transports page for "last seen".
 * Telematics provider names are real third-party GPS brands (not anything
 * specific to a competitor) — what a GCC carrier would actually use.
 */

import { CITIES, type CityId } from "../transports/transportsData";

export { CITIES };
export type { CityId };

export type ConnStatus = "connected" | "no_signal" | "pending";
export type VehicleGroup = "dedicated" | "partner";

export type ManagedVehicle = {
  id: string;
  plate: string;
  name: string;
  type: string; // body-type suffix (reefer, curtain, …) — reuses visibility.fl.type.*
  group: VehicleGroup;
  /** Owning carrier (the partner for partner vehicles; your own fleet otherwise). */
  carrier: string;
  carrierAr: string;
  /** Telematics provider feeding GPS, or "" when not yet connected. */
  provider: string;
  status: ConnStatus;
  lastCity: CityId;
  /** Minutes since the last GPS ping, or null when never connected. */
  lastSeenMin: number | null;
};

export const VEHICLES: ManagedVehicle[] = [
  // ── Dedicated (your own fleet) ──────────────────────────────────────
  { id: "m1", plate: "D 48213", name: "Volvo FH16", type: "reefer", group: "dedicated", carrier: "Shenatech Fleet", carrierAr: "أسطول شِنتك", provider: "Geotab", status: "connected", lastCity: "dubai", lastSeenMin: 2 },
  { id: "m2", plate: "R 90671", name: "Scania R500", type: "curtain", group: "dedicated", carrier: "Shenatech Fleet", carrierAr: "أسطول شِنتك", provider: "Samsara", status: "connected", lastCity: "riyadh", lastSeenMin: 1 },
  { id: "m3", plate: "AD 77390", name: "Mercedes Actros", type: "reefer", group: "dedicated", carrier: "Shenatech Fleet", carrierAr: "أسطول شِنتك", provider: "Webfleet", status: "connected", lastCity: "abudhabi", lastSeenMin: 3 },
  { id: "m4", plate: "R 90712", name: "Volvo FM", type: "tanker", group: "dedicated", carrier: "Shenatech Fleet", carrierAr: "أسطول شِنتك", provider: "Geotab", status: "connected", lastCity: "dammam", lastSeenMin: 6 },
  { id: "m5", plate: "Q 33108", name: "DAF XF", type: "curtain", group: "dedicated", carrier: "Shenatech Fleet", carrierAr: "أسطول شِنتك", provider: "Samsara", status: "no_signal", lastCity: "doha", lastSeenMin: 47 },
  { id: "m6", plate: "D 61559", name: "Iveco S-Way", type: "box", group: "dedicated", carrier: "Shenatech Fleet", carrierAr: "أسطول شِنتك", provider: "", status: "pending", lastCity: "dubai", lastSeenMin: null },
  { id: "m7", plate: "K 22841", name: "MAN TGS", type: "flatbed", group: "dedicated", carrier: "Shenatech Fleet", carrierAr: "أسطول شِنتك", provider: "Mix Telematics", status: "connected", lastCity: "kuwait", lastSeenMin: 4 },

  // ── Partner (shared by partner carriers) ────────────────────────────
  { id: "p1", plate: "K 11254", name: "MAN TGX", type: "flatbed", group: "partner", carrier: "Al Najm Logistics", carrierAr: "النجم اللوجستية", provider: "Geotab", status: "connected", lastCity: "kuwait", lastSeenMin: 5 },
  { id: "p2", plate: "M 50442", name: "Scania S730", type: "flatbed", group: "partner", carrier: "Emirates Road Cargo", carrierAr: "شحن طرق الإمارات", provider: "Samsara", status: "connected", lastCity: "muscat", lastSeenMin: 2 },
  { id: "p3", plate: "AD 31902", name: "Renault T", type: "curtain", group: "partner", carrier: "Desert Line", carrierAr: "خط الصحراء", provider: "Webfleet", status: "no_signal", lastCity: "abudhabi", lastSeenMin: 64 },
  { id: "p4", plate: "Q 78510", name: "Volvo FH", type: "reefer", group: "partner", carrier: "Gulf Freight Co.", carrierAr: "شركة غلف للشحن", provider: "", status: "pending", lastCity: "doha", lastSeenMin: null },
  { id: "p5", plate: "B 20817", name: "Iveco Stralis", type: "box", group: "partner", carrier: "Peninsula Transport", carrierAr: "نقل الجزيرة", provider: "Fleet Complete", status: "connected", lastCity: "manama", lastSeenMin: 8 },
];

export function vehiclesByGroup(group: VehicleGroup): ManagedVehicle[] {
  return VEHICLES.filter((v) => v.group === group);
}

/** Connection-status counts within a set of vehicles. */
export function connCounts(vehicles: ManagedVehicle[]) {
  return {
    connected: vehicles.filter((v) => v.status === "connected").length,
    no_signal: vehicles.filter((v) => v.status === "no_signal").length,
    pending: vehicles.filter((v) => v.status === "pending").length,
  };
}

// ─── Integrations (telematics/GPS providers) ──────────────────────────
export type IntegrationStatus = "connected" | "available";

export type Integration = {
  id: string;
  name: string;
  category: "telematics" | "eld";
  status: IntegrationStatus;
  /** Vehicles currently feeding through this provider. */
  vehicles: number;
};

export const INTEGRATIONS: Integration[] = [
  { id: "geotab", name: "Geotab", category: "telematics", status: "connected", vehicles: 3 },
  { id: "samsara", name: "Samsara", category: "telematics", status: "connected", vehicles: 3 },
  { id: "webfleet", name: "Webfleet", category: "telematics", status: "connected", vehicles: 2 },
  { id: "mix", name: "Mix Telematics", category: "telematics", status: "connected", vehicles: 1 },
  { id: "fleetcomplete", name: "Fleet Complete", category: "telematics", status: "connected", vehicles: 1 },
  { id: "teltonika", name: "Teltonika", category: "telematics", status: "available", vehicles: 0 },
  { id: "wialon", name: "Wialon", category: "telematics", status: "available", vehicles: 0 },
  { id: "motive", name: "Motive", category: "eld", status: "available", vehicles: 0 },
];
