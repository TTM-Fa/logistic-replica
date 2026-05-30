/**
 * Mock data for the Visibility → Shared Views page.
 *
 * A shared view is a public tracking link you give a customer so they can
 * follow their shipments without a Shenatech login. All demo data; the
 * customer names match the Data Network section for cohesion.
 */

export type ViewStatus = "active" | "paused" | "expired";

export type SharedView = {
  id: string;
  name: string;
  nameAr: string;
  customer: string;
  customerAr: string;
  scope: string;
  scopeAr: string;
  status: ViewStatus;
  shipments: number;
  views: number;
  /** Minutes since the link was last opened, or null if never. */
  lastMin: number | null;
  /** URL slug → track.shenatech.com/<slug>. */
  slug: string;
};

export const SHARED_VIEWS: SharedView[] = [
  {
    id: "v1", name: "Almarai — Daily Deliveries", nameAr: "المراعي — تسليمات يومية",
    customer: "Almarai Foods", customerAr: "أغذية المراعي",
    scope: "Reefer shipments to Riyadh DC", scopeAr: "شحنات مبرّدة إلى مركز الرياض",
    status: "active", shipments: 24, views: 312, lastMin: 120, slug: "almarai-daily",
  },
  {
    id: "v2", name: "Lulu — Cross-border GCC", nameAr: "لولو — عبور حدود الخليج",
    customer: "Lulu Retail", customerAr: "لولو للتجزئة",
    scope: "All GCC cross-border transports", scopeAr: "كل شحنات عبور حدود الخليج",
    status: "active", shipments: 31, views: 540, lastMin: 12, slug: "lulu-gcc",
  },
  {
    id: "v3", name: "Gulf Steel — Inbound Raw Materials", nameAr: "حديد الخليج — مواد خام واردة",
    customer: "Gulf Steel Co.", customerAr: "حديد الخليج",
    scope: "Flatbed inbound to Dammam plant", scopeAr: "شحنات مسطّحة واردة لمصنع الدمام",
    status: "active", shipments: 18, views: 145, lastMin: 300, slug: "gulfsteel-inbound",
  },
  {
    id: "v4", name: "Agthia — Weekly Summary", nameAr: "أغذية — ملخّص أسبوعي",
    customer: "Agthia Group", customerAr: "مجموعة أغذية",
    scope: "Completed deliveries, last 7 days", scopeAr: "تسليمات مكتملة، آخر 7 أيام",
    status: "paused", shipments: 12, views: 87, lastMin: 4320, slug: "agthia-weekly",
  },
  {
    id: "v5", name: "Zad — Q2 Project Cargo", nameAr: "زاد — شحنات مشروع الربع الثاني",
    customer: "Zad Holding", customerAr: "زاد القابضة",
    scope: "Oversized project cargo lanes", scopeAr: "مسارات شحنات المشاريع كبيرة الحجم",
    status: "expired", shipments: 8, views: 64, lastMin: 20160, slug: "zad-q2",
  },
];

export const SHARE_DOMAIN = "track.shenatech.com";

export function viewStats(views: SharedView[]) {
  return {
    active: views.filter((v) => v.status === "active").length,
    opens: views.reduce((s, v) => s + v.views, 0),
    shipments: views.reduce((s, v) => s + v.shipments, 0),
  };
}
