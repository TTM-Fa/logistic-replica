"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

const QUESTIONS = ["01", "02", "03", "04", "05", "06"] as const;

export function FAQ() {
  const { t } = useLanguage();

  return (
    <section className="faq" id="faq" aria-labelledby="faq-heading">
      <div className="container">
        <div className="faq__intro reveal">
          <T as="p" id="faq.index" className="eyebrow" style={{ marginBottom: "1rem" }} />
          <span className="gold-line" aria-hidden="true" />
          <h2
            id="faq-heading"
            className="display-lg"
            dangerouslySetInnerHTML={{ __html: t("faq.heading_html") }}
          />
          <T as="p" id="faq.sub" className="faq__sub" />
        </div>

        <div className="faq__list">
          {QUESTIONS.map((n, i) => (
            <details key={n} className="faq__item reveal" open={i === 0}>
              <summary className="faq__q">
                <T id={`faq.${n}.q`} as="span" className="faq__q-text" />
                <span className="faq__q-icon" aria-hidden="true">
                  <svg viewBox="0 0 14 14" fill="none" width="14" height="14">
                    <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              </summary>
              <div className="faq__a">
                <T as="p" id={`faq.${n}.a`} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
