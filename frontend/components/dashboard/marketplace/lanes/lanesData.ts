/**
 * Mock data for the Marketplace → Lane Requests ("Opportunities") page.
 *
 * Each lane request is a recurring-freight opportunity a carrier can bid
 * on. Reuses the GCC cities + body-type labels from Visibility. All demo
 * data; shipper names are plausible GCC shippers.
 */

import { CITIES, type CityId } from "../../visibility/transports/transportsData";

export { CITIES };
export type { CityId };

export type Equipment = "reefer" | "curtain" | "flatbed" | "box" | "tanker";
export type NegScope = "price" | "price_capacity";

export type LaneRequest = {
  id: string;
  from: CityId;
  to: CityId;
  shipper: string;
  shipperAr: string;
  equipment: Equipment;
  stops: number; // intermediate steps (0 = direct)
  shipments: number;
  contractMonths: number;
  scope: NegScope;
  postedDaysAgo: number;
  deadlineDays: number;
  isNew: boolean;
};

export const LANES: LaneRequest[] = [
  { id: "ln1", from: "jeddah", to: "riyadh", shipper: "Almarai Foods", shipperAr: "أغذية المراعي", equipment: "reefer", stops: 3, shipments: 91, contractMonths: 6, scope: "price", postedDaysAgo: 4, deadlineDays: 12, isNew: true },
  { id: "ln2", from: "dubai", to: "muscat", shipper: "Lulu Retail", shipperAr: "لولو للتجزئة", equipment: "curtain", stops: 0, shipments: 64, contractMonths: 12, scope: "price_capacity", postedDaysAgo: 1, deadlineDays: 5, isNew: false },
  { id: "ln3", from: "dammam", to: "kuwait", shipper: "Gulf Steel Co.", shipperAr: "حديد الخليج", equipment: "flatbed", stops: 0, shipments: 48, contractMonths: 9, scope: "price", postedDaysAgo: 2, deadlineDays: 20, isNew: true },
  { id: "ln4", from: "riyadh", to: "jeddah", shipper: "Gulf Petro", shipperAr: "غلف بترو", equipment: "tanker", stops: 0, shipments: 30, contractMonths: 12, scope: "price", postedDaysAgo: 9, deadlineDays: 8, isNew: false },
  { id: "ln5", from: "abudhabi", to: "doha", shipper: "Agthia Group", shipperAr: "مجموعة أغذية", equipment: "reefer", stops: 2, shipments: 72, contractMonths: 6, scope: "price_capacity", postedDaysAgo: 6, deadlineDays: 15, isNew: false },
  { id: "ln6", from: "manama", to: "dammam", shipper: "Zad Holding", shipperAr: "زاد القابضة", equipment: "box", stops: 0, shipments: 40, contractMonths: 3, scope: "price", postedDaysAgo: 0, deadlineDays: 3, isNew: true },
];

export const EQUIPMENT_TYPES: Equipment[] = ["reefer", "curtain", "flatbed", "box", "tanker"];

export function laneStats(lanes: LaneRequest[]) {
  return {
    open: lanes.length,
    fresh: lanes.filter((l) => l.isNew).length,
    closing: lanes.filter((l) => l.deadlineDays <= 7).length,
  };
}
