"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { T } from "@/lib/T";

/**
 * BenchmarkSidebar — full-height left rail for the Rate Benchmark dashboard.
 *
 * Layout (top → bottom):
 *   - Brand zone:  SHENATECH wordmark + DASHBOARD pill. Clicking the
 *                  whole brand block goes back to /dashboard (the
 *                  3-models hub).
 *   - Primary nav: 7 flat category items. Each is icon + label, no
 *                  expand/collapse. Active category gets a gold left
 *                  border + soft background.
 *   - Utility row: Notifications, Help, Theme toggle, Language toggle.
 *   - User zone:   Operator name + Sign out at the very bottom.
 *
 * Theme-aware via the global `--d-*` tokens.
 *
 * The sub-pages within a category are NOT shown in this sidebar — they
 * live in the horizontal <SubTabs /> row above the page content.
 */

// Flat list of primary categories. Add/remove a category here, then create
// the matching route folder under app/dashboard/benchmark/<key>/.
type Category = {
  key: string;
  href: string; // first-page destination (parent route — may redirect to a sub-page)
  labelKey: string;
  icon: React.ReactNode;
};

const CATEGORIES: Category[] = [
  {
    key: "market",
    href: "/dashboard/benchmark/market",
    labelKey: "benchmark.nav.market",
    icon: (
      // Trending-up — represents market direction
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M3 17l6-6 4 4 7-8M14 7h7v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "rates",
    href: "/dashboard/benchmark/rates",
    labelKey: "benchmark.nav.rates",
    icon: (
      // Coins / currency
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <ellipse cx="12" cy="6" rx="8" ry="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M4 6v6c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    key: "capacity",
    href: "/dashboard/benchmark/capacity",
    labelKey: "benchmark.nav.capacity",
    icon: (
      // Truck — capacity is about transport availability
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M1 17V6h14v11M15 9h4l3 4v4h-7M5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "costs",
    href: "/dashboard/benchmark/costs",
    labelKey: "benchmark.nav.costs",
    icon: (
      // Receipt
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M5 3v18l2-1 2 1 2-1 2 1 2-1 2 1 2-1V3l-2 1-2-1-2 1-2-1-2 1-2-1-2 1zM9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "rate-on-demand",
    href: "/dashboard/benchmark/rate-on-demand",
    labelKey: "benchmark.nav.rate_on_demand",
    icon: (
      // Crosshair — quick lookup / on-demand
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "news",
    href: "/dashboard/benchmark/news",
    labelKey: "benchmark.nav.news",
    icon: (
      // Newspaper
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M4 4h14v16H4zM18 8h2v10a2 2 0 0 1-2 2M8 8h6M8 12h6M8 16h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "reports",
    href: "/dashboard/benchmark/reports",
    labelKey: "benchmark.nav.reports",
    icon: (
      // Bookmark — user's saved/pinned views
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M5 3h14v18l-7-5-7 5z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function BenchmarkSidebar() {
  const pathname = usePathname();
  const { lang, toggle: toggleLang } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();

  // A category is active if the current URL starts with its href.
  // Stripping any trailing slash for safety.
  const isCategoryActive = (cat: Category) => {
    const clean = cat.href.replace(/\/$/, "");
    return pathname === clean || pathname.startsWith(clean + "/");
  };

  return (
    <aside className="bm-sidebar" aria-label="Rate Benchmark navigation">
      {/* ─── Brand zone — wordmark only, centered horizontally ──── */}
      <Link href="/dashboard" className="bm-sidebar__brand" aria-label="Back to workspace">
        <span
          className="bm-sidebar__brand-mark"
          // Renders "SHENA" semi-bold + "TECH" thin
          dangerouslySetInnerHTML={{
            __html:
              lang === "ar"
                ? "شحنتك"
                : 'SHENA<span class="logo-thin">TECH</span>',
          }}
        />
      </Link>

      {/* ─── Primary nav (7 flat categories) ─────────────────────── */}
      <nav className="bm-sidebar__nav" aria-label="Categories">
        <ul>
          {CATEGORIES.map((cat) => {
            const active = isCategoryActive(cat);
            return (
              <li key={cat.key}>
                <Link
                  href={cat.href}
                  className={`bm-sidebar__nav-item${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="bm-sidebar__nav-icon" aria-hidden="true">{cat.icon}</span>
                  <span className="bm-sidebar__nav-label">
                    <T id={cat.labelKey} />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ─── Utility cluster ─────────────────────────────────────── */}
      <div className="bm-sidebar__divider" aria-hidden="true" />
      <div className="bm-sidebar__utility">
        {/* Notifications — placeholder (no real notif system yet) */}
        <button type="button" className="bm-sidebar__util-btn" title="Notifications">
          <span className="bm-sidebar__util-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="bm-sidebar__util-label">
            <T id="benchmark.util.notifications" />
          </span>
          <span className="bm-sidebar__util-badge">3</span>
        </button>

        {/* Help */}
        <button type="button" className="bm-sidebar__util-btn" title="Help">
          <span className="bm-sidebar__util-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
              <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7M12 17h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="bm-sidebar__util-label">
            <T id="benchmark.util.help" />
          </span>
        </button>

        {/* Theme toggle — icon flips between sun and moon */}
        <button
          type="button"
          className="bm-sidebar__util-btn"
          onClick={toggleTheme}
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          <span className="bm-sidebar__util-icon">
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className="bm-sidebar__util-label">
            <T id={theme === "dark" ? "benchmark.util.theme_light" : "benchmark.util.theme_dark"} />
          </span>
        </button>

        {/* Language toggle */}
        <button
          type="button"
          className="bm-sidebar__util-btn"
          onClick={toggleLang}
          title="Switch language"
          aria-label="Switch language"
        >
          <span className="bm-sidebar__util-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
              <path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          </span>
          <span className="bm-sidebar__util-label">
            {lang === "ar" ? "English" : "العربية"}
          </span>
        </button>
      </div>

      {/* ─── User zone ──────────────────────────────────────────── */}
      <div className="bm-sidebar__divider" aria-hidden="true" />
      <div className="bm-sidebar__user">
        <div className="bm-sidebar__user-info">
          <span className="bm-sidebar__user-avatar" aria-hidden="true">
            {/* Initial avatar (first letter of the user's name) */}
            O
          </span>
          <div className="bm-sidebar__user-text">
            <span className="bm-sidebar__user-name">Operator</span>
            <span className="bm-sidebar__user-role">
              <T id="benchmark.user.role" />
            </span>
          </div>
        </div>
        <Link href="/" className="bm-sidebar__signout" title="Sign out">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      {/* ─── Back to workspace — always-visible link at the very bottom ── */}
      <Link href="/dashboard" className="bm-sidebar__workspace">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <T id="benchmark.brand.workspace_hint" />
      </Link>
    </aside>
  );
}
