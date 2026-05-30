"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { T } from "@/lib/T";

/**
 * MarketplaceSidebar — full-height left rail for the Freight Marketplace
 * dashboard. Built to match VisibilitySidebar / BenchmarkSidebar so the
 * three models feel like one product; reuses the same theme-aware
 * `bm-sidebar` CSS. Only the nav items + icons differ.
 *
 * 9 flat sections (no sub-tabs). "Find" vs "Create" from the original is
 * folded into each page as an action button rather than duplicate nav.
 */

type Section = { key: string; href: string; labelKey: string; icon: React.ReactNode };

const SECTIONS: Section[] = [
  {
    key: "home",
    href: "/dashboard/marketplace/home",
    labelKey: "marketplace.nav.home",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M3 11l9-7 9 7M5 10v10h14V10M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "spot",
    href: "/dashboard/marketplace/spot",
    labelKey: "marketplace.nav.spot",
    icon: (
      // Radar / live load finder
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    key: "lanes",
    href: "/dashboard/marketplace/lanes",
    labelKey: "marketplace.nav.lanes",
    icon: (
      // Lane path — two endpoints joined
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <circle cx="5" cy="19" r="2.4" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="19" cy="5" r="2.4" stroke="currentColor" strokeWidth="1.7" />
        <path d="M6.7 17.3L17.3 6.7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "rfq",
    href: "/dashboard/marketplace/rfq",
    labelKey: "marketplace.nav.rfq",
    icon: (
      // Tender document
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M6 2h8l4 4v16H6zM14 2v4h4M9 13h6M9 17h6M9 9h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "analysis",
    href: "/dashboard/marketplace/analysis",
    labelKey: "marketplace.nav.analysis",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "perspectives",
    href: "/dashboard/marketplace/perspectives",
    labelKey: "marketplace.nav.perspectives",
    icon: (
      // Insight / lightbulb
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M9 18h6M10 21h4M12 3a6 6 0 0 1 4 10.5c-.6.6-1 1.3-1 2.1H9c0-.8-.4-1.5-1-2.1A6 6 0 0 1 12 3z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "profile",
    href: "/dashboard/marketplace/profile",
    labelKey: "marketplace.nav.profile",
    icon: (
      // Company building
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M3 21h18M5 21V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v16M15 9h3a1 1 0 0 1 1 1v11M8 8h2M8 12h2M8 16h2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "users",
    href: "/dashboard/marketplace/users",
    labelKey: "marketplace.nav.users",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1A4 4 0 0 1 16 11" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: "settings",
    href: "/dashboard/marketplace/settings",
    labelKey: "marketplace.nav.settings",
    icon: (
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export function MarketplaceSidebar() {
  const pathname = usePathname();
  const { lang, toggle: toggleLang } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();

  const isActive = (sec: Section) => {
    const clean = sec.href.replace(/\/$/, "");
    return pathname === clean || pathname.startsWith(clean + "/");
  };

  return (
    <aside className="bm-sidebar" aria-label="Marketplace navigation">
      {/* Brand → back to workspace */}
      <Link href="/dashboard" className="bm-sidebar__brand" aria-label="Back to workspace">
        <span
          className="bm-sidebar__brand-mark"
          dangerouslySetInnerHTML={{
            __html: lang === "ar" ? "شحنتك" : 'SHENA<span class="logo-thin">TECH</span>',
          }}
        />
      </Link>

      {/* Primary nav (9 flat sections) */}
      <nav className="bm-sidebar__nav" aria-label="Sections">
        <ul>
          {SECTIONS.map((sec) => {
            const active = isActive(sec);
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

      {/* Utility cluster */}
      <div className="bm-sidebar__divider" aria-hidden="true" />
      <div className="bm-sidebar__utility">
        <button type="button" className="bm-sidebar__util-btn" title="Notifications">
          <span className="bm-sidebar__util-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="bm-sidebar__util-label"><T id="benchmark.util.notifications" /></span>
          <span className="bm-sidebar__util-badge">2</span>
        </button>

        <button type="button" className="bm-sidebar__util-btn" title="Help">
          <span className="bm-sidebar__util-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
              <path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7M12 17h.01" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="bm-sidebar__util-label"><T id="benchmark.util.help" /></span>
        </button>

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

        <button type="button" className="bm-sidebar__util-btn" onClick={toggleLang} title="Switch language" aria-label="Switch language">
          <span className="bm-sidebar__util-icon">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
              <path d="M3 12h18M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18" stroke="currentColor" strokeWidth="1.7" />
            </svg>
          </span>
          <span className="bm-sidebar__util-label">{lang === "ar" ? "English" : "العربية"}</span>
        </button>
      </div>

      {/* User zone */}
      <div className="bm-sidebar__divider" aria-hidden="true" />
      <div className="bm-sidebar__user">
        <div className="bm-sidebar__user-info">
          <span className="bm-sidebar__user-avatar" aria-hidden="true">O</span>
          <div className="bm-sidebar__user-text">
            <span className="bm-sidebar__user-name">Operator</span>
            <span className="bm-sidebar__user-role"><T id="benchmark.user.role" /></span>
          </div>
        </div>
        <Link href="/" className="bm-sidebar__signout" title="Sign out">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M16 17l5-5-5-5M21 12H9M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </div>

      <Link href="/dashboard" className="bm-sidebar__workspace">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M12 7H2M6 3L2 7l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <T id="benchmark.brand.workspace_hint" />
      </Link>
    </aside>
  );
}
