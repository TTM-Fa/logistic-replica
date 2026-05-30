"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

/**
 * DashboardSidebar (left column of the hub)
 *
 * Two stacked sections, matching the Transporeon-inspired pattern:
 *
 *   1. FAVOURITES — items the user has pinned. For now we just have
 *      "Home" pinned by default. A small edit pencil hints that the user
 *      will be able to manage pins (future work, no behaviour yet).
 *
 *   2. APPLICATIONS AND UTILITIES — our 3 product models. Each row is a
 *      clickable Link with an icon on the left, label on the right.
 *
 * Sidebar items are single-column (we only have 3 apps, so a 2-column
 * grid would look awkward with an empty slot). When we add more, this
 * can become a 2-column grid.
 */

// Icon for each app — kept inline so the sidebar file is self-contained.
const APPS: { key: "visibility" | "marketplace" | "benchmark"; href: string; icon: React.ReactNode }[] = [
  {
    key: "visibility",
    href: "/dashboard/visibility",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M12 2L3 7l9 5 9-5-9-5zM3 12l9 5 9-5M3 17l9 5 9-5"
              stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "marketplace",
    href: "/dashboard/marketplace",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 14h6"
              stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "benchmark",
    href: "/dashboard/benchmark",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2"
              stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function DashboardSidebar() {
  return (
    <aside className="dash-sidebar" aria-label="Sidebar navigation">
      {/* ─── FAVOURITES ─────────────────────────────────────────── */}
      <section className="dash-side-section">
        <header className="dash-side-section__header">
          <span className="dash-side-section__icon" aria-hidden="true">
            {/* Star icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7z" />
            </svg>
          </span>
          <h3 className="dash-side-section__title">
            <T id="dashboard.sidebar.favourites" />
          </h3>
          <button
            type="button"
            className="dash-side-section__edit"
            aria-label="Edit favourites"
          >
            {/* Pencil icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </header>

        <ul className="dash-side-list">
          <li>
            <Link href="/dashboard" className="dash-side-item dash-side-item--active">
              <span className="dash-side-item__icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 11l9-8 9 8M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <T id="dashboard.sidebar.home" />
            </Link>
          </li>
        </ul>
      </section>

      {/* ─── APPLICATIONS AND UTILITIES ────────────────────────── */}
      <section className="dash-side-section">
        <header className="dash-side-section__header">
          <span className="dash-side-section__icon" aria-hidden="true">
            {/* Box / app-grid icon */}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
              <path
                d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h3 className="dash-side-section__title">
            <T id="dashboard.sidebar.apps" />
          </h3>
        </header>

        <ul className="dash-side-list">
          {APPS.map((a) => (
            <li key={a.key}>
              <Link href={a.href} className="dash-side-item">
                <span className="dash-side-item__icon" aria-hidden="true">{a.icon}</span>
                <T id={`dashboard.${a.key}.title`} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}
