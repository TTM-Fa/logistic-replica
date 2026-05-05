"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";
import { HeroGlobe } from "./HeroGlobe";

/**
 * Mock shipments shown in the live ticker at the bottom of the hero.
 * The track below renders this list twice — that's how the CSS infinite
 * scroll loops back to its starting position seamlessly.
 */
const TICKER_ITEMS = [
  { id: "SHN-2847", route: "Jebel Ali → Doha",         status: "transit",   label: "IN TRANSIT" },
  { id: "SHN-2851", route: "Riyadh → Dammam",          status: "port",      label: "AT PORT" },
  { id: "SHN-2839", route: "Salalah → Muscat",         status: "delivered", label: "DELIVERED" },
  { id: "SHN-2862", route: "Doha → Bahrain",           status: "transit",   label: "IN TRANSIT" },
  { id: "SHN-2867", route: "Abu Dhabi → Khalifa Port", status: "port",      label: "AT PORT" },
  { id: "SHN-2871", route: "Kuwait → Riyadh",          status: "transit",   label: "IN TRANSIT" },
  { id: "SHN-2855", route: "Sohar → Jebel Ali",        status: "delivered", label: "DELIVERED" },
  { id: "SHN-2873", route: "Dammam → Manama",          status: "transit",   label: "IN TRANSIT" },
];

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
        </div>
      </div>

      {/* Live shipments ticker — fills the dead space at the bottom of the hero
          with a slow horizontal scroll. The track is rendered twice in source
          order so the CSS animation can loop seamlessly. */}
      <div className="hero__ticker" aria-hidden="true">
        <div className="hero__ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="ticker-item">
              <span className="ticker-item__id">{item.id}</span>
              <span className="ticker-item__route">{item.route}</span>
              <span className={`ticker-status ticker-status--${item.status}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
