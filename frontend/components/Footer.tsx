"use client";

import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

const DEMO_URL = "https://calendly.com/shenatech/30min";

// Social links — replace placeholders with your real handles when ready.
const SOCIALS = [
  {
    name: "Instagram",
    href: "https://instagram.com/shenatech",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.7" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com/company/shenatech",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.5 10H6v8h2.5v-8zm-1.25-1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM18 13.5c0-2.4-1.5-3.5-3-3.5-1.4 0-2.2.7-2.5 1.5V10H10v8h2.5v-4.5c0-.9.5-1.5 1.4-1.5.8 0 1.6.5 1.6 1.5V18H18v-4.5z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    href: "https://wa.me/97466007110",
    icon: (
      <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
        <path d="M17.4 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4-.1-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.3-.3.3-1 1-1 2.5 0 1.5 1.1 2.9 1.2 3.1.1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
      </svg>
    ),
  },
];

export function Footer() {
  const { lang, t } = useLanguage();
  const pathname = usePathname();

  // Dashboard area has its own (minimal) chrome — skip the marketing footer
  // on every /dashboard/* route so the app feel isn't broken by a big
  // marketing footer at the bottom.
  if (pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <footer className="footer" aria-label="Site footer">
      <div className="container">
        <div className="footer__top">
          <div>
            <div
              className="footer__logo"
              dangerouslySetInnerHTML={{
                __html:
                  lang === "ar" ? "شحنتك" : 'SHENA<span class="logo-thin">TECH</span>',
              }}
            />
            <T as="p" id="footer.tagline" className="footer__tagline" />
            <T as="p" id="footer.location" className="footer__location" />
          </div>

          <div className="footer__col">
            <T as="p" id="footer.col.platform" className="footer__col-title" />
            <ul>
              <li>
                <a href="#platform">{t("footer.link.visibility")}</a>
              </li>
              <li>
                <a href="#platform">{t("footer.link.eta")}</a>
              </li>
              <li>
                <a href="#platform">{t("footer.link.marketplace")}</a>
              </li>
              <li>
                <a
                  href="#platform"
                  dangerouslySetInnerHTML={{
                    __html: t("footer.link.epod_html"),
                  }}
                />
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <T as="p" id="footer.col.solutions" className="footer__col-title" />
            <ul>
              <li>
                <a href="#segments">{t("segments.forwarders")}</a>
              </li>
              <li>
                <a href="#segments">{t("segments.shippers")}</a>
              </li>
              <li>
                <a href="#segments">{t("segments.tpl")}</a>
              </li>
              <li>
                <a href="#segments">{t("segments.manufacturers")}</a>
              </li>
              <li>
                <a href="#segments">{t("segments.retailers")}</a>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <T as="p" id="footer.col.company" className="footer__col-title" />
            <ul>
              <li>
                <a href={DEMO_URL} target="_blank" rel="noopener noreferrer">
                  {t("nav.request_demo")}
                </a>
              </li>
              <li>
                <a href="/contact">{t("nav.contact")}</a>
              </li>
              <li>
                <a href="/faq">{t("nav.faq")}</a>
              </li>
              <li>
                <a href="#">{t("footer.link.about")}</a>
              </li>
              <li>
                <a href="#">{t("footer.link.careers")}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p
            className="footer__copy"
            dangerouslySetInnerHTML={{ __html: t("footer.copy_html") }}
          />
          <div className="footer__socials" aria-label="Social links">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="footer__social"
              >
                {s.icon}
              </a>
            ))}
          </div>
          <nav className="footer__legal" aria-label="Legal">
            <a href="#">{t("footer.privacy")}</a>
            <a href="#">{t("footer.terms")}</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
