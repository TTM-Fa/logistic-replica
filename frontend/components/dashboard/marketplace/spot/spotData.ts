/**
 * Mock data for the Marketplace → Spot load board.
 *
 * Reuses the GCC city catalogue + body-type labels from the Visibility
 * module. All demo data; shipper names are plausible GCC shippers.
 */

import { CITIES, type CityId } from "../../visibility/transports/transportsData";

export { CITIES };
export type { CityId };

// Equipment reuses the visibility body-type label keys (visibility.fl.type.*).
export type Equipment = "reefer" | "curtain" | "flatbed" | "box" | "tanker";

/** Relative pickup/drop day — rendered via marketplace.spot.day.* keys. */
export type DayKey = "today" | "tomorrow" | "in2" | "in3";

export type SpotLoad = {
  id: string;
  ref: string;
  from: CityId;
  to: CityId;
  pickupDay: DayKey;
  dropDay: DayKey;
  timeWindow: string; // shared across languages (e.g. "08:00–17:00")
  distanceKm: number;
  equipment: Equipment;
  pallets: number;
  weightT: number;
  temp?: string; // for reefer, e.g. "2–8°C"
  shipper: string;
  shipperAr: string;
  rate: number; // SAR
  deadlineMin: number; // minutes until the offer deadline
  isNew: boolean;
};

export const LOADS: SpotLoad[] = [
  { id: "l1", ref: "SPOT-3920", from: "jeddah", to: "riyadh", pickupDay: "today", dropDay: "tomorrow", timeWindow: "08:00–17:00", distanceKm: 949, equipment: "reefer", pallets: 33, weightT: 21, temp: "2–8°C", shipper: "Almarai Foods", shipperAr: "أغذية المراعي", rate: 4200, deadlineMin: 153, isNew: true },
  { id: "l2", ref: "SPOT-3921", from: "dubai", to: "doha", pickupDay: "today", dropDay: "tomorrow", timeWindow: "06:00–14:00", distanceKm: 680, equipment: "curtain", pallets: 26, weightT: 18, shipper: "Lulu Retail", shipperAr: "لولو للتجزئة", rate: 3100, deadlineMin: 45, isNew: false },
  { id: "l3", ref: "SPOT-3922", from: "dammam", to: "kuwait", pickupDay: "tomorrow", dropDay: "tomorrow", timeWindow: "07:00–18:00", distanceKm: 410, equipment: "flatbed", pallets: 0, weightT: 24, shipper: "Gulf Steel Co.", shipperAr: "حديد الخليج", rate: 2400, deadlineMin: 320, isNew: false },
  { id: "l4", ref: "SPOT-3923", from: "riyadh", to: "dammam", pickupDay: "tomorrow", dropDay: "in2", timeWindow: "09:00–17:00", distanceKm: 410, equipment: "box", pallets: 30, weightT: 15, shipper: "Zad Holding", shipperAr: "زاد القابضة", rate: 1900, deadlineMin: 600, isNew: true },
  { id: "l5", ref: "SPOT-3924", from: "abudhabi", to: "muscat", pickupDay: "today", dropDay: "tomorrow", timeWindow: "10:00–20:00", distanceKm: 480, equipment: "reefer", pallets: 28, weightT: 16, temp: "0–4°C", shipper: "Agthia Group", shipperAr: "مجموعة أغذية", rate: 2800, deadlineMin: 90, isNew: false },
  { id: "l6", ref: "SPOT-3925", from: "jeddah", to: "dubai", pickupDay: "in2", dropDay: "in3", timeWindow: "06:00–22:00", distanceKm: 1500, equipment: "tanker", pallets: 0, weightT: 28, shipper: "Gulf Petro", shipperAr: "غلف بترو", rate: 6400, deadlineMin: 240, isNew: false },
  { id: "l7", ref: "SPOT-3926", from: "kuwait", to: "riyadh", pickupDay: "today", dropDay: "tomorrow", timeWindow: "08:00–16:00", distanceKm: 540, equipment: "curtain", pallets: 24, weightT: 17, shipper: "Al Najm Logistics", shipperAr: "النجم اللوجستية", rate: 2600, deadlineMin: 30, isNew: true },
  { id: "l8", ref: "SPOT-3927", from: "manama", to: "dammam", pickupDay: "tomorrow", dropDay: "tomorrow", timeWindow: "09:00–13:00", distanceKm: 120, equipment: "box", pallets: 20, weightT: 10, shipper: "Lulu Retail", shipperAr: "لولو للتجزئة", rate: 900, deadlineMin: 480, isNew: false },
  { id: "l9", ref: "SPOT-3928", from: "muscat", to: "dubai", pickupDay: "in2", dropDay: "in2", timeWindow: "07:00–19:00", distanceKm: 440, equipment: "flatbed", pallets: 0, weightT: 22, shipper: "Desert Line", shipperAr: "خط الصحراء", rate: 2300, deadlineMin: 720, isNew: false },
  { id: "l10", ref: "SPOT-3929", from: "doha", to: "abudhabi", pickupDay: "today", dropDay: "tomorrow", timeWindow: "08:00–18:00", distanceKm: 620, equipment: "reefer", pallets: 31, weightT: 19, temp: "2–8°C", shipper: "Almarai Foods", shipperAr: "أغذية المراعي", rate: 3500, deadlineMin: 200, isNew: true },
];

export const EQUIPMENT_TYPES: Equipment[] = ["reefer", "curtain", "flatbed", "box", "tanker"];

export function spotStats(loads: SpotLoad[]) {
  return {
    open: loads.length,
    closing: loads.filter((l) => l.deadlineMin < 180).length,
    fresh: loads.filter((l) => l.isNew).length,
  };
}
