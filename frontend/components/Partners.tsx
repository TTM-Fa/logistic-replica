"use client";

import { T } from "@/lib/T";
import { useLanguage } from "@/lib/LanguageContext";

type PartnerLogo = {
  href: string;
  src: string | null; // null → use the inline CSS class-based Rowwad logo
  altKey: string;
  className?: string;
  // Logo is designed white-on-dark — apply CSS filter so it shows up on our light background.
  invert?: boolean;
};

const LOGOS: PartnerLogo[] = [
  {
    href: "https://rowwad.qa",
    src: null,
    altKey: "partners.logo.rowwad_alt",
    className: "rowwad-logo",
  },
  {
    href: "https://syndicatemarket.com",
    src: "https://syndicatemarket.com/wp-content/uploads/2024/12/Syndicate-Logo-final.png",
    altKey: "partners.logo.syndicate_alt",
  },
  {
    href: "https://omanilawfirm.com",
    src: "https://omanilawfirm.com/wp-content/uploads/2025/06/Omani-law-firm-logo-wite.png",
    altKey: "partners.logo.omani_alt",
    invert: true,
  },
];

export function Partners() {
  const { t } = useLanguage();
  // Marquee duplicates: render the 2 logos eight times so the track is always
  // wider than the viewport on desktop (otherwise the -50% slide leaves a gap).
  const track = Array.from({ length: 8 }, () => LOGOS).flat();

  return (
    <section className="partners" aria-label="Our partners">
      <div className="container">
        <div className="partners__header reveal">
          <span className="gold-line" aria-hidden="true"></span>
          <T as="h2" id="partners.title" className="partners__title" />
          <T as="p" id="partners.sub" className="partners__sub" />
        </div>
      </div>
      <div className="partners__ticker">
        <div className="partners__track" aria-hidden="true">
          {track.map((logo, i) => (
            <a
              key={i}
              className={`partners__logo${logo.invert ? " partners__logo--invert" : ""}`}
              href={logo.href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {logo.src ? (
                <img src={logo.src} alt={t(logo.altKey)} />
              ) : (
                <span
                  className={logo.className}
                  role="img"
                  aria-label={t(logo.altKey)}
                />
              )}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
