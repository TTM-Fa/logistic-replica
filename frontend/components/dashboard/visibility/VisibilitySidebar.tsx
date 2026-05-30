"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { T } from "@/lib/T";

/**
 * VisibilitySidebar — full-height left rail for the Visibility dashboard.
 *
 * Built to mirror BenchmarkSidebar so the two modules feel like one
 * product. It reuses the same theme-aware `bm-sidebar` CSS classes; only
 * the nav items and their icons differ.
 *
 * Layout (top → bottom):
 *   - Brand zone:  SHENATECH wordmark. Clicking it returns to /dashboard
 *                  (the 3-models hub).
 *   - Primary nav: 8 flat sections (Dashboards … Shared Views). Active
 *                  section gets a gold left border + soft background.
 *   - Utility row: Notifications, Help, Theme toggle, Language toggle.
 *   - User zone:   Operator name + Sign out.
 *   - Workspace:   "← WORKSPACE" link pinned at the very bottom.
 *
 * Sub-pages (for Vehicle Management and Data Network) are NOT listed
 * here — they live in the horizontal <VisibilitySubTabs /> row above the
 * page content.
 */

// Flat list of primary sections. Add/remove a section here, then create
// the matching route folder under app/dashboard/visibility/<key>/.
type Section = {
  key: string;
  href: string; // first-page destination (parent route may redirect to a sub-page)
  labelKey: string;
  icon: React.ReactNode;
};

const SECTIONS: Section[] = [
  {
    key: "dashboards",
    href: "/dashboard/visibility/dashboards",
    labelKey: "visibility.nav.dashboards",
    icon: (
      // 2x2 grid of widgets — a customizable board
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    key: "transports",
    href: "/dashboard/visibility/transports",
    labelKey: "visibility.nav.transports",
    icon: (
      // Package / shipment box
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8M12 13v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "fleet",
    href: "/dashboard/visibility/fleet",
    labelKey: "visibility.nav.fleet",
    icon: (
      // Truck — fleet of vehicles
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M1 17V6h14v11M15 9h4l3 4v4h-7M5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM18 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "vehicles",
    href: "/dashboard/visibility/vehicles",
    labelKey: "visibility.nav.vehicles",
    icon: (
      // Truck with a signal — connect/manage vehicles
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M2 16V8h11v8M13 11h4l3 3v2h-6M6 20a1.7 1.7 0 1 0 0-3.4A1.7 1.7 0 0 0 6 20zM17 20a1.7 1.7 0 1 0 0-3.4A1.7 1.7 0 0 0 17 20z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 4a4 4 0 0 1 4 4M16.5 6.5a1.5 1.5 0 0 1 1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "network",
    href: "/dashboard/visibility/network",
    labelKey: "visibility.nav.network",
    icon: (
      // Connected nodes — the carrier/customer data network
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <circle cx="5" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="19" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="18" r="2.4" stroke="currentColor" strokeWidth="1.7" />
        <path d="M6.7 7.6l4 8.4M17.3 7.6l-4 8.4M7.4 6h9.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "analytics",
    href: "/dashboard/visibility/analytics",
    labelKey: "visibility.nav.analytics",
    icon: (
      // Bar chart — tracking performance analytics
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "notifications",
    href: "/dashboard/visibility/notifications",
    labelKey: "visibility.nav.notifications",
    icon: (
      // Bell — notification rules
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "shared",
    href: "/dashboard/visibility/shared",
    labelKey: "visibility.nav.shared",
    icon: (
      // Share nodes — shared views for customers
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <circle cx="18" cy="5" r="2.6" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="6" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="18" cy="19" r="2.6" stroke="currentColor" strokeWidth="1.7" />
        <path d="M8.3 10.8l7.4-4.3M8.3 13.2l7.4 4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function VisibilitySidebar() {
  const pathname = usePathname();
  const { lang, toggle: toggleLang } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();

  // A section is active if the current URL starts with its href
  // (trailing slash stripped for safety).
  const isSectionActive = (sec: Section) => {
    const clean = sec.href.replace(/\/$/, "");
    return pathname === clean || pathname.startsWith(clean + "/");
  };

  return (
    <aside className="bm-sidebar" aria-label="Visibility navigation">
      {/* ─── Brand zone — wordmark, links back to the workspace hub ─── */}
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

      {/* ─── Primary nav (8 flat sections) ───────────────────────── */}
      <nav className="bm-sidebar__nav" aria-label="Sections">
        <ul>
          {SECTIONS.map((sec) => {
            const active = isSectionActive(sec);
            return (
              <li key={sec.key}>
                <Link
                  href={sec.href}
                  className={`bm-sidebar__nav-item${active ? " is-active" : ""}`}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="bm-sidebar__nav-icon" aria-hidden="true">{sec.icon}</span>
                  <span className="bm-sidebar__nav-label">
                    <T id={sec.labelKey} />
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
