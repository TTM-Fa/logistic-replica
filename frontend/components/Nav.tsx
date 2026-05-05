"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

const DEMO_URL = "https://calendly.com/shenatech/30min";

// Each "Services" sub-item links to the Platform section on the homepage.
// (Real per-service pages can replace these later.)
const SERVICES: { id: string; href: string }[] = [
  { id: "nav.services.visibility", href: "/#platform" },
  { id: "nav.services.marketplace", href: "/#platform" },
  { id: "nav.services.benchmark", href: "/#platform" },
];

export function Nav() {
  const { lang, toggle } = useLanguage();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Mobile-only: lets the user expand/collapse the Services group inside the drawer.
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Re-sync the scrolled state on every client-side navigation. Without this,
  // navigating from a scrolled position on Home to Contact would leave
  // `scrolled` stuck at `true`, making the nav cream over the dark hero
  // until the user manually scrolls.
  useEffect(() => {
    setScrolled(window.scrollY > 20);
  }, [pathname]);

  const closeDrawer = () => {
    setDrawerOpen(false);
    setMobileServicesOpen(false);
  };

  // Pages with a DARK hero strip at the top — on these the nav stays
  // transparent (white text) until the user scrolls past it, then transitions
  // to cream. On other pages (FAQ, etc.) we force cream immediately so the
  // text is readable on the light background.
  const DARK_HERO_PATHS = ["/", "/contact", "/faq", "/about"];
  const hasDarkHero = DARK_HERO_PATHS.includes(pathname);
  const showScrolled = scrolled || !hasDarkHero;

  return (
    <nav
      className={`nav${showScrolled ? " scrolled" : ""}`}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container">
        <div className="nav__inner">
          {/* LEFT: brand logo */}
          <div className="nav__side nav__side--left">
            <Link
              href="/"
              className="nav__logo"
              aria-label="Shenatech home"
              dangerouslySetInnerHTML={{
                __html:
                  lang === "ar"
                    ? "شحنتك"
                    : 'SHENA<span class="logo-thin">TECH</span>',
              }}
            />
          </div>

          {/* CENTER: main menu (hidden on mobile, replaced by the hamburger below) */}
          <ul className="nav__links" role="menubar">
            <li role="none">
              <Link href="/" role="menuitem">
                <T id="nav.home" />
              </Link>
            </li>

            {/* Services with hover-dropdown (desktop) */}
            <li role="none" className="nav__has-dropdown">
              <button
                type="button"
                className="nav__dropdown-trigger"
                aria-haspopup="true"
                role="menuitem"
              >
                <T id="nav.services" />
                <svg
                  className="nav__caret"
                  width="10"
                  height="10"
                  viewBox="0 0 10 10"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 3.5l3 3 3-3"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className="nav__dropdown" role="menu">
                {SERVICES.map((s) => (
                  <a key={s.id} href={s.href} role="menuitem">
                    <T id={s.id} />
                  </a>
                ))}
              </div>
            </li>

            <li role="none">
              <Link href="/about" role="menuitem">
                <T id="nav.about" />
              </Link>
            </li>
            <li role="none">
              <Link href="/contact" role="menuitem">
                <T id="nav.contact" />
              </Link>
            </li>
          </ul>

          {/* RIGHT: sign-in + language toggle + primary CTA + mobile hamburger */}
          <div className="nav__side nav__side--right">
            {/* Sign in — circular icon button by default; on hover the pill
                expands horizontally to reveal the "Sign in" text. */}
            <a
              href="#"
              className="nav__signin"
              aria-label="Sign in"
              onClick={(e) => e.preventDefault()}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span className="nav__signin-text">
                <T id="nav.signin" />
              </span>
            </a>

            <button
              type="button"
              className="nav__lang"
              aria-label="Switch language"
              role="switch"
              aria-checked={lang === "ar"}
              onClick={toggle}
            >
              <span className="nav__lang-opt nav__lang-opt--en">English</span>
              <span className="nav__lang-divider" aria-hidden="true" />
              <span className="nav__lang-opt nav__lang-opt--ar">العربية</span>
            </button>

            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--gold"
            >
              <T id="nav.request_demo" />
            </a>

            <button
              ref={toggleBtnRef}
              className="nav__toggle"
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="nav-drawer"
              onClick={() => setDrawerOpen((v) => !v)}
            >
              <span
                style={
                  drawerOpen
                    ? { transform: "translateY(6.5px) rotate(45deg)" }
                    : undefined
                }
              />
              <span style={drawerOpen ? { opacity: 0 } : undefined} />
              <span
                style={
                  drawerOpen
                    ? { transform: "translateY(-6.5px) rotate(-45deg)" }
                    : undefined
                }
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer: tappable list including expandable Services group */}
      <div
        className={`nav__drawer${drawerOpen ? " open" : ""}`}
        id="nav-drawer"
        role="menu"
        aria-hidden={!drawerOpen}
      >
        <Link href="/" role="menuitem" onClick={closeDrawer}>
          <T id="nav.home" />
        </Link>

        {/* Services as a tappable expand/collapse group on mobile */}
        <button
          type="button"
          className="nav__drawer-group"
          aria-expanded={mobileServicesOpen}
          onClick={() => setMobileServicesOpen((v) => !v)}
        >
          <T id="nav.services" />
          <svg
            className={`nav__caret${mobileServicesOpen ? " is-open" : ""}`}
            width="12"
            height="12"
            viewBox="0 0 10 10"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M2 3.5l3 3 3-3"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {mobileServicesOpen &&
          SERVICES.map((s) => (
            <a
              key={s.id}
              href={s.href}
              role="menuitem"
              className="nav__drawer-sublink"
              onClick={closeDrawer}
            >
              <T id={s.id} />
            </a>
          ))}

        <Link href="/about" role="menuitem" onClick={closeDrawer}>
          <T id="nav.about" />
        </Link>
        <Link href="/contact" role="menuitem" onClick={closeDrawer}>
          <T id="nav.contact" />
        </Link>
        <a href="#" role="menuitem" onClick={(e) => { e.preventDefault(); closeDrawer(); }}>
          <T id="nav.signin" />
        </a>

        <a
          href={DEMO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--gold"
          role="menuitem"
          onClick={closeDrawer}
        >
          <T id="nav.request_demo" />
        </a>
      </div>
    </nav>
  );
}
