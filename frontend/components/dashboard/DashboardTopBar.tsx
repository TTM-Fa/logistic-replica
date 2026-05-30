"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { useTheme } from "@/lib/ThemeContext";
import { T } from "@/lib/T";

/**
 * DashboardTopBar (Transporeon-inspired)
 *
 * A dark, full-width app header with three logical zones:
 *
 *   LEFT      — brand mark + global "Menu" launcher + the current page tab
 *   RIGHT     — user identity card (name + company) + notification + help
 *
 * The header is sticky so it stays visible as the user scrolls through
 * sidebar/center/right content below.
 */
export function DashboardTopBar() {
  const { lang, toggle, t } = useLanguage();
  const { theme, toggle: toggleTheme } = useTheme();
  const pathname = usePathname();

  // Rate Benchmark, Visibility, and Marketplace each have their own
  // full-height sidebar that replaces this top bar — suppress here so we
  // don't render both.
  if (
    pathname?.startsWith("/dashboard/benchmark") ||
    pathname?.startsWith("/dashboard/visibility") ||
    pathname?.startsWith("/dashboard/marketplace")
  ) {
    return null;
  }

  return (
    <header className="dash-topbar" role="banner">
      <div className="dash-topbar__inner">
        {/* ─── LEFT ZONE ─────────────────────────────────────────── */}
        <div className="dash-topbar__left">
          {/* Brand mark — a small gold "S" logo that doubles as a link back
              to the public marketing site. */}
          <Link href="/" className="dash-topbar__brand" aria-label="Home">
            <span className="dash-topbar__logo" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                <rect width="100" height="100" rx="22" fill="#FCBA02" />
                <text
                  x="50"
                  y="74"
                  fontFamily="Inter, Arial, sans-serif"
                  fontSize="72"
                  fontWeight="900"
                  fill="#0B0D0F"
                  textAnchor="middle"
                >
                  S
                </text>
              </svg>
            </span>
          </Link>

          {/* "Menu" launcher — a 9-dot grid icon. For now this is a
              placeholder button (no menu opens yet); once we have more
              models/utilities we'll wire it to a full app drawer. */}
          <button type="button" className="dash-topbar__menu" aria-label="Open menu">
            <span className="dash-topbar__menu-grid" aria-hidden="true">
              <span /><span /><span />
              <span /><span /><span />
              <span /><span /><span />
            </span>
            <T id="dashboard.topbar.menu" />
          </button>

          {/* Current page tab. Stays "Home" while on /dashboard. Will become
              a breadcrumb when we add deeper routes. */}
          <span className="dash-topbar__tab dash-topbar__tab--active">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 11l9-8 9 8M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <T id="dashboard.topbar.home_tab" />
          </span>
        </div>

        {/* ─── RIGHT ZONE ────────────────────────────────────────── */}
        <div className="dash-topbar__right">
          {/* User identity card — placeholder name + company until auth lands.
              On click in the future this will open a profile dropdown
              (account settings, sign out, switch workspace, etc.). */}
          <button type="button" className="dash-topbar__user" aria-label="Open user menu">
            <span className="dash-topbar__user-text">
              <span className="dash-topbar__user-name">
                <T id="dashboard.user.name" />
              </span>
              <span className="dash-topbar__user-company">
                <T id="dashboard.user.company" />
              </span>
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path
                d="M3 4.5l3 3 3-3"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Notification bell — placeholder, no real notifications yet. */}
          <button
            type="button"
            className="dash-topbar__icon-btn"
            aria-label="Notifications"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21a2 2 0 0 0 4 0"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Help icon */}
          <button type="button" className="dash-topbar__icon-btn" aria-label="Help">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
              <path
                d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7M12 17h.01"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Theme toggle — sun in dark mode, moon in light mode (the icon
              shows what you'll switch TO when clicked). */}
          <button
            type="button"
            onClick={toggleTheme}
            className="dash-topbar__icon-btn"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? (
              // Sun icon (currently dark → click to go light)
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              // Moon icon (currently light → click to go dark)
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          {/* Language toggle — small text-only button so it doesn't compete
              with the icons. */}
          <button
            type="button"
            onClick={toggle}
            className="dash-topbar__lang"
            aria-label="Switch language"
          >
            {lang === "ar" ? "EN" : "العربية"}
          </button>
        </div>
      </div>
    </header>
  );
}
