"use client";

import { T } from "@/lib/T";
import { useLanguage } from "@/lib/LanguageContext";

const DEMO_URL = "https://calendly.com/shenatech/30min";

export function CTA() {
  const { t } = useLanguage();
  return (
    <section className="cta-section" id="demo" aria-labelledby="cta-heading">
      <div className="container">
        <T as="p" id="cta.index" className="eyebrow" />
        <span
          className="gold-line"
          aria-hidden="true"
          style={{ margin: "1.25rem auto 1.5rem" }}
        />
        <h2 id="cta-heading" className="display-lg cta-section__headline reveal">
          {t("cta.headline")}
        </h2>
        <T as="p" id="cta.sub" className="cta-section__sub reveal" />
        <div className="cta-section__actions reveal">
          <a
            href={DEMO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--gold"
          >
            <T id="hero.cta_demo" />
          </a>
          <a href="mailto:info@shenatech.com" className="btn btn--ghost-cream">
            info@shenatech.com
          </a>
        </div>
      </div>
    </section>
  );
}
