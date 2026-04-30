"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

const DEMO_URL = "https://calendly.com/shenatech/30min";

// Top-bar menu. Anchor hrefs use absolute "/#xxx" so they work from any page
// (clicking "Platform" on /faq jumps to homepage and scrolls there).
// Items marked `placeholder` don't navigate yet — they'll get real routes later.
const MENU: { id: string; href: string; placeholder?: boolean }[] = [
  { id: "nav.platform", href: "/#platform" },
  { id: "nav.solutions", href: "/#segments" },
  { id: "nav.faq", href: "/faq" },
  { id: "nav.contact", href: "/contact" },
  { id: "nav.pricing", href: "#", placeholder: true },
  { id: "nav.company", href: "#", placeholder: true },
];

export function Nav() {
  const { lang, toggle } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <nav
      className={`nav${scrolled ? " scrolled" : ""}`}
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
            {MENU.map((item) => (
              <li key={item.id} role="none">
                <a
                  href={item.href}
                  role="menuitem"
                  onClick={item.placeholder ? (e) => e.preventDefault() : undefined}
                >
                  <T id={item.id} />
                </a>
              </li>
            ))}
          </ul>

          {/* RIGHT: language toggle + primary CTA + mobile hamburger */}
          <div className="nav__side nav__side--right">
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

      {/* Mobile drawer: same menu items, expanded list + CTA */}
      <div
        className={`nav__drawer${drawerOpen ? " open" : ""}`}
        id="nav-drawer"
        role="menu"
        aria-hidden={!drawerOpen}
      >
        {MENU.map((item) => (
          <a
            key={item.id}
            href={item.href}
            role="menuitem"
            onClick={(e) => {
              if (item.placeholder) e.preventDefault();
              closeDrawer();
            }}
          >
            <T id={item.id} />
          </a>
        ))}
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
