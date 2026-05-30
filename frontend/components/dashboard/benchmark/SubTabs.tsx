"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/lib/T";

/**
 * SubTabs — horizontal tab row that sits above the page content.
 *
 * Reads the current URL, figures out which category we're in, and renders
 * that category's sub-pages as tabs. Categories with no sub-pages render
 * nothing (the component returns null) — those pages get the full
 * canvas to themselves.
 */

// Lookup: which categories have sub-tabs, and what they are.
// Keep in sync with the route folders under app/dashboard/benchmark/.
type SubTab = { key: string; href: string; labelKey: string };

const SUB_TABS: Record<string, SubTab[]> = {
  rates: [
    { key: "overview",         href: "/dashboard/benchmark/rates/overview",         labelKey: "benchmark.sub.rates.overview" },
    { key: "forecast",         href: "/dashboard/benchmark/rates/forecast",         labelKey: "benchmark.sub.rates.forecast" },
    { key: "spot-vs-contract", href: "/dashboard/benchmark/rates/spot-vs-contract", labelKey: "benchmark.sub.rates.spot_vs_contract" },
  ],
  costs: [
    { key: "market", href: "/dashboard/benchmark/costs/market", labelKey: "benchmark.sub.costs.market" },
    { key: "lane",   href: "/dashboard/benchmark/costs/lane",   labelKey: "benchmark.sub.costs.lane" },
  ],
  "rate-on-demand": [
    { key: "spot",     href: "/dashboard/benchmark/rate-on-demand/spot",     labelKey: "benchmark.sub.rate_on_demand.spot" },
    { key: "contract", href: "/dashboard/benchmark/rate-on-demand/contract", labelKey: "benchmark.sub.rate_on_demand.contract" },
  ],
  // market, capacity, news, reports → no sub-pages, no row rendered
};

export function SubTabs() {
  const pathname = usePathname();

  // Extract the category segment from the URL.
  // /dashboard/benchmark/market/overview → category = "market"
  const match = pathname.match(/^\/dashboard\/benchmark\/([^/]+)/);
  const category = match?.[1];
  if (!category) return null;

  const tabs = SUB_TABS[category];
  if (!tabs || tabs.length === 0) return null;

  return (
    <nav className="bm-subtabs" aria-label="Sub-pages">
      <ul>
        {tabs.map((tab) => {
          const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
          return (
            <li key={tab.key}>
              <Link
                href={tab.href}
                className={`bm-subtab${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                <T id={tab.labelKey} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
