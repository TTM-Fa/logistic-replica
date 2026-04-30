"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

// Real contact details — edit here when they change.
const EMAIL = "info@shenatech.com";
const PHONE_1_DISPLAY = "+974 6600 7110";
const PHONE_1_TEL = "+97466007110";
const PHONE_2_DISPLAY = "+974 6655 2667";
const PHONE_2_TEL = "+97466552667";

export function Contact() {
  const { t } = useLanguage();

  return (
    <section className="contact" id="contact" aria-labelledby="contact-heading">
      <div className="container">
        <div className="contact__intro reveal">
          <T as="p" id="contact.index" className="eyebrow" style={{ marginBottom: "1rem" }} />
          <span className="gold-line" aria-hidden="true" />
          <h2
            id="contact-heading"
            className="display-lg"
            dangerouslySetInnerHTML={{ __html: t("contact.heading_html") }}
          />
          <T as="p" id="contact.sub" className="contact__sub" />
        </div>

        <div className="contact__cards">
          {/* Email — entire card is a link */}
          <a href={`mailto:${EMAIL}`} className="contact__card reveal">
            <span className="contact__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <path d="M3 7l9 6 9-6M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <T as="p" id="contact.email_label" className="contact__label" />
            <p className="contact__value">{EMAIL}</p>
          </a>

          {/* Phone — single card with both numbers as separate clickable links */}
          <div className="contact__card reveal">
            <span className="contact__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            <T as="p" id="contact.phone_label" className="contact__label" />
            <div className="contact__phones">
              <a href={`tel:${PHONE_1_TEL}`} className="contact__value contact__value--link">{PHONE_1_DISPLAY}</a>
              <a href={`tel:${PHONE_2_TEL}`} className="contact__value contact__value--link">{PHONE_2_DISPLAY}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
