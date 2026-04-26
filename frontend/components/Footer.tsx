"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

const DEMO_URL = "https://calendly.com/shenatech/30min";

export function Footer() {
  const { lang, t } = useLanguage();
  return (
    <footer className="footer" id="contact" aria-label="Site footer">
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
                <a href="mailto:info@shenatech.com">{t("nav.contact")}</a>
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
          <nav className="footer__legal" aria-label="Legal">
            <a href="#">{t("footer.privacy")}</a>
            <a href="#">{t("footer.terms")}</a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
