"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

const DEMO_URL = "https://calendly.com/shenatech/30min";

// FAQ structure: 4 categories, each with its own list of question IDs.
// To add a question to a category, just add its ID to the `qs` array
// and define `faq.<id>.q` / `faq.<id>.a` in translations.ts.
const CATEGORIES: { key: string; labelKey: string; qs: string[] }[] = [
  { key: "start",    labelKey: "faq.cat.start.label",    qs: ["03", "06", "07"] },
  { key: "platform", labelKey: "faq.cat.platform.label", qs: ["01", "02", "08"] },
  { key: "pricing",  labelKey: "faq.cat.pricing.label",  qs: ["04", "09"] },
  { key: "security", labelKey: "faq.cat.security.label", qs: ["05", "10"] },
];

export function FAQ() {
  const { t } = useLanguage();

  return (
    <>
      {/* ─── Dark hero (subpage-dark-hero pattern) ─── */}
      <section className="faq-hero faq-hero--dark">
        <div className="container">
          <div className="faq-hero__inner reveal">
            <T as="p" id="faq.hero.eyebrow" className="eyebrow" style={{ marginBottom: "1rem" }} />
            <span className="gold-line" aria-hidden="true" />
            <h1
              className="display-lg faq-hero__heading"
              dangerouslySetInnerHTML={{ __html: t("faq.hero.heading_html") }}
            />
            <T as="p" id="faq.hero.sub" className="faq-hero__sub" />
            <div className="faq-hero__status" aria-hidden="true">
              <span className="faq-hero__status-dot" />
              <T id="faq.hero.status" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Categorised FAQ accordion ─── */}
      <section className="faq-main" aria-label="Frequently Asked Questions">
        <div className="container">
          {CATEGORIES.map((cat, ci) => (
            <div key={cat.key} className="faq-cat reveal">
              <header className="faq-cat__header">
                <span className="faq-cat__num">{String(ci + 1).padStart(2, "0")}</span>
                <T as="h3" id={cat.labelKey} className="faq-cat__heading" />
                <span className="faq-cat__count">
                  {cat.qs.length} <T id="faq.cat.questions_label" as="span" />
                </span>
              </header>
              <div className="faq-cat__list">
                {cat.qs.map((q, qi) => (
                  <details
                    key={q}
                    className="faq-item"
                    open={ci === 0 && qi === 0 /* first question of first category opens by default */}
                  >
                    <summary className="faq-item__q">
                      <T id={`faq.${q}.q`} as="span" className="faq-item__q-text" />
                      <span className="faq-item__icon" aria-hidden="true">
                        <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
                          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </summary>
                    <div className="faq-item__a">
                      <T as="p" id={`faq.${q}.a`} />
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── "Still have questions?" CTA tiles ─── */}
      <section className="faq-cta">
        <div className="container">
          <T as="h2" id="faq.cta.heading" className="faq-cta__heading reveal" />
          <div className="faq-cta__tiles reveal">
            <Link href="/contact" className="extra-tile">
              <span className="extra-tile__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                  <path d="M3 7l9 6 9-6M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"
                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div className="extra-tile__body">
                <T as="p" id="faq.cta.tile1.heading" className="extra-tile__heading" />
                <T as="p" id="faq.cta.tile1.desc" className="extra-tile__desc" />
              </div>
              <span className="extra-tile__cta extra-tile__cta--gold">
                <T id="faq.cta.tile1.cta" />
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="extra-tile">
              <span className="extra-tile__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                  <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <div className="extra-tile__body">
                <T as="p" id="faq.cta.tile2.heading" className="extra-tile__heading" />
                <T as="p" id="faq.cta.tile2.desc" className="extra-tile__desc" />
              </div>
              <span className="extra-tile__cta extra-tile__cta--gold">
                <T id="faq.cta.tile2.cta" />
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
