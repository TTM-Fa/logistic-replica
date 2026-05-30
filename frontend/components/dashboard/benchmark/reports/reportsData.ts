/**
 * reportsData.ts — Mock saved reports for the "My Reports" page.
 *
 * In production, these would be saved per user when they click "Add to
 * dashboard" on any page (Rates Overview, Capacity, etc.). The mock
 * here showcases the variety of report types a power user might pin.
 */

// ─── Types ────────────────────────────────────────────────────────────

/** Where the saved view originated — used to label the source */
export type ReportSource =
  | "rates_overview"
  | "rates_forecast"
  | "rates_spot_vs_contract"
  | "capacity"
  | "rod_spot"
  | "rod_contract"
  | "news"
  | "costs";

/**
 * The kind of mini-preview the card shows. Different shapes give the
 * grid visual variety without needing a heavy chart library.
 */
export type PreviewKind = "sparkline" | "stacked-bar" | "kpi" | "count";

export type Report = {
  id: string;
  nameKey: string;
  descKey: string;
  source: ReportSource;
  /** ISO date the user last opened this report */
  lastOpenedISO: string;
  /** Lifetime open count */
  opens: number;
  /** User-starred favorite */
  favorite: boolean;
  /** Shared by another teammate; if set, we show their name */
  sharedBy?: string;
  preview:
    | { kind: "sparkline"; data: number[]; color: string }
    | { kind: "stacked-bar"; parts: { label: string; value: number; color: string }[] }
    | { kind: "kpi"; value: string; deltaPct: number }
    | { kind: "count"; value: number; label: string };
};

// ─── Six sample reports ──────────────────────────────────────────────

export const REPORTS: Report[] = [
  {
    id: "doha-riyadh-weekly",
    nameKey: "reports.r1.name",
    descKey: "reports.r1.desc",
    source: "rates_overview",
    lastOpenedISO: "2026-05-21",
    opens: 24,
    favorite: true,
    preview: {
      kind: "sparkline",
      color: "var(--d-accent)",
      data: [1740, 1755, 1730, 1715, 1745, 1770, 1795, 1790, 1810, 1825, 1840, 1820],
    },
  },
  {
    id: "diesel-watch-gcc",
    nameKey: "reports.r2.name",
    descKey: "reports.r2.desc",
    source: "capacity",
    lastOpenedISO: "2026-05-19",
    opens: 12,
    favorite: false,
    preview: {
      kind: "sparkline",
      color: "#F59E0B",
      data: [98, 100, 101, 99, 102, 103, 105, 104, 106, 107, 108, 109],
    },
  },
  {
    id: "q3-cost-benchmark",
    nameKey: "reports.r3.name",
    descKey: "reports.r3.desc",
    source: "costs",
    lastOpenedISO: "2026-05-18",
    opens: 8,
    favorite: false,
    sharedBy: "reports.r3.shared_by",
    preview: {
      kind: "stacked-bar",
      parts: [
        { label: "Fuel",      value: 38, color: "#F59E0B" },
        { label: "Labor",     value: 27, color: "#3B82F6" },
        { label: "Equipment", value: 18, color: "#A855F7" },
        { label: "Tolls",     value: 11, color: "#14B8A6" },
        { label: "Other",     value:  6, color: "var(--d-text-muted)" },
      ],
    },
  },
  {
    id: "competitor-lanes",
    nameKey: "reports.r4.name",
    descKey: "reports.r4.desc",
    source: "rates_overview",
    lastOpenedISO: "2026-05-20",
    opens: 18,
    favorite: true,
    preview: {
      kind: "sparkline",
      color: "#3B82F6",
      data: [2620, 2680, 2640, 2700, 2710, 2680, 2740, 2720, 2700, 2680, 2660, 2640],
    },
  },
  {
    id: "hot-capacity-alert",
    nameKey: "reports.r5.name",
    descKey: "reports.r5.desc",
    source: "capacity",
    lastOpenedISO: "2026-05-16",
    opens: 6,
    favorite: false,
    preview: {
      kind: "kpi",
      value: "94.2",
      deltaPct: +5.7,
    },
  },
  {
    id: "neom-news-watch",
    nameKey: "reports.r6.name",
    descKey: "reports.r6.desc",
    source: "news",
    lastOpenedISO: "2026-05-14",
    opens: 4,
    favorite: false,
    preview: {
      kind: "count",
      value: 7,
      label: "reports.r6.count_label",
    },
  },
];

// ─── Tab definitions ─────────────────────────────────────────────────

export type TabKey = "all" | "favorites" | "recent" | "shared";

export const TABS: { key: TabKey; labelKey: string }[] = [
  { key: "all",       labelKey: "reports.tabs.all" },
  { key: "favorites", labelKey: "reports.tabs.favorites" },
  { key: "recent",    labelKey: "reports.tabs.recent" },
  { key: "shared",    labelKey: "reports.tabs.shared" },
];

/** Counts per tab — drives the "[3]" badge next to each tab label */
export function countForTab(tab: TabKey, reports: Report[]): number {
  switch (tab) {
    case "all":       return reports.length;
    case "favorites": return reports.filter((r) => r.favorite).length;
    case "recent": {
      // "Recent" = opened in the last 7 days
      const sevenDaysAgo = Date.now() - 7 * 86400000;
      return reports.filter((r) => new Date(r.lastOpenedISO).getTime() >= sevenDaysAgo).length;
    }
    case "shared":    return reports.filter((r) => !!r.sharedBy).length;
  }
}

/** Filter the list by the active tab */
export function filterByTab(tab: TabKey, reports: Report[]): Report[] {
  switch (tab) {
    case "all":       return reports;
    case "favorites": return reports.filter((r) => r.favorite);
    case "recent": {
      const sevenDaysAgo = Date.now() - 7 * 86400000;
      return reports.filter((r) => new Date(r.lastOpenedISO).getTime() >= sevenDaysAgo);
    }
    case "shared":    return reports.filter((r) => !!r.sharedBy);
  }
}

// ─── Source page metadata ────────────────────────────────────────────
// Used to show "from Rates · Overview" and to link the report card
// back to its origin page.

export const SOURCE_META: Record<ReportSource, { labelKey: string; href: string }> = {
  rates_overview:         { labelKey: "reports.source.rates_overview",         href: "/dashboard/benchmark/rates/overview" },
  rates_forecast:         { labelKey: "reports.source.rates_forecast",         href: "/dashboard/benchmark/rates/forecast" },
  rates_spot_vs_contract: { labelKey: "reports.source.rates_spot_vs_contract", href: "/dashboard/benchmark/rates/spot-vs-contract" },
  capacity:               { labelKey: "reports.source.capacity",               href: "/dashboard/benchmark/capacity" },
  rod_spot:               { labelKey: "reports.source.rod_spot",               href: "/dashboard/benchmark/rate-on-demand/spot" },
  rod_contract:           { labelKey: "reports.source.rod_contract",           href: "/dashboard/benchmark/rate-on-demand/contract" },
  news:                   { labelKey: "reports.source.news",                   href: "/dashboard/benchmark/news" },
  costs:                  { labelKey: "reports.source.costs",                  href: "/dashboard/benchmark/costs/overview" },
};

// ─── Helpers ─────────────────────────────────────────────────────────

/** Format last-opened as a relative phrase: "Today", "Yesterday", "3 days ago"... */
export function formatRelative(iso: string, lang: "en" | "ar"): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const days = Math.floor((now - then) / 86400000);
  if (lang === "ar") {
    if (days < 1) return "اليوم";
    if (days === 1) return "أمس";
    if (days < 7) return `قبل ${days} أيام`;
    if (days < 14) return "قبل أسبوع";
    return `قبل ${Math.floor(days / 7)} أسابيع`;
  }
  if (days < 1) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 14) return "1 week ago";
  return `${Math.floor(days / 7)} weeks ago`;
}
