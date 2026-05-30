"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { T } from "@/lib/T";

/**
 * VisibilitySubTabs — horizontal tab row above the page content.
 *
 * Reads the current URL, figures out which section we're in, and renders
 * that section's sub-pages as tabs. Sections with no sub-pages render
 * nothing (returns null) — those pages get the full canvas.
 *
 * Reuses the theme-aware `bm-subtabs` CSS from the benchmark module.
 */

// Lookup: which sections have sub-tabs, and what they are.
// Keep in sync with the route folders under app/dashboard/visibility/.
type SubTab = { key: string; href: string; labelKey: string };

const SUB_TABS: Record<string, SubTab[]> = {
  vehicles: [
    { key: "dedicated",    href: "/dashboard/visibility/vehicles/dedicated",    labelKey: "visibility.sub.vehicles.dedicated" },
    { key: "partners",     href: "/dashboard/visibility/vehicles/partners",     labelKey: "visibility.sub.vehicles.partners" },
    { key: "integrations", href: "/dashboard/visibility/vehicles/integrations", labelKey: "visibility.sub.vehicles.integrations" },
  ],
  network: [
    { key: "customers",   href: "/dashboard/visibility/network/customers",   labelKey: "visibility.sub.network.customers" },
    { key: "carriers",    href: "/dashboard/visibility/network/carriers",    labelKey: "visibility.sub.network.carriers" },
    { key: "performance", href: "/dashboard/visibility/network/performance", labelKey: "visibility.sub.network.performance" },
  ],
  // dashboards, transports, fleet, analytics, notifications, shared → no sub-tabs
};

export function VisibilitySubTabs() {
  const pathname = usePathname();

  // Extract the section segment from the URL.
  // /dashboard/visibility/network/carriers → section = "network"
  const match = pathname.match(/^\/dashboard\/visibility\/([^/]+)/);
  const section = match?.[1];
  if (!section) return null;

  const tabs = SUB_TABS[section];
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
