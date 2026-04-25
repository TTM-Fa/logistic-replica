"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { HeroGlobe } from "./HeroGlobe";

const DEMO_URL = "https://calendly.com/shenatech/30min";

export function Hero() {
  const { lang } = useLanguage();

  return (
    <section className="hero" aria-labelledby="hero-h1">
      <HeroGlobe />
      <div className="container">
        <div
          className="hero__brand"
          aria-hidden="true"
          dangerouslySetInnerHTML={{
            __html:
              lang === "ar" ? "شحنتك" : 'SHENA<span class="logo-thin">TECH</span>',
          }}
        />

        <div className="hero__intro">
          <T as="h1" id="hero.headline_html" className="display-xl hero__headline" />

          <T as="p" id="hero.sub" className="hero__sub" />

          <div className="hero__ctas">
            <a
              href={DEMO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--gold"
            >
              <T id="hero.cta_demo" />
            </a>
            <a href="#platform" className="btn btn--ghost-cream">
              <T id="hero.cta_platform" />
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>

          <div className="hero__pillars" aria-label="Platform capabilities">
            <div className="hero__pillar">
              <T as="p" id="hero.pillar.visibility_tag" className="hero__pillar-tag" />
              <T as="p" id="hero.pillar.visibility_name" className="hero__pillar-name" />
            </div>
            <div className="hero__pillar">
              <T as="p" id="hero.pillar.prediction_tag" className="hero__pillar-tag" />
              <T as="p" id="hero.pillar.prediction_name" className="hero__pillar-name" />
            </div>
            <div className="hero__pillar">
              <T as="p" id="hero.pillar.marketplace_tag" className="hero__pillar-tag" />
              <T as="p" id="hero.pillar.marketplace_name" className="hero__pillar-name" />
            </div>
            <div className="hero__pillar">
              <T as="p" id="hero.pillar.documentation_tag" className="hero__pillar-tag" />
              <T as="p" id="hero.pillar.documentation_name" className="hero__pillar-name" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
