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
          </div>

        </div>
      </div>
    </section>
  );
}
