"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

// Contact details — edit here when they change.
const SALES_EMAIL = "sales@shenatech.com";
const SUPPORT_EMAIL = "info@shenatech.com";
const PHONE_1_DISPLAY = "+974 6600 7110";
const PHONE_1_TEL = "+97466007110";
const PHONE_2_DISPLAY = "+974 6655 2667";
const PHONE_2_TEL = "+97466552667";
const WHATSAPP_URL = "https://wa.me/97466007110";
const DEMO_URL = "https://calendly.com/shenatech/30min";

export function Contact() {
  const { t } = useLanguage();

  // Simple no-backend form: submit composes a mailto: link with the user's
  // input prefilled, opening their default mail client. When you wire in a
  // real backend (Formspree / Web3Forms / your API), swap handleSubmit.
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    topic: "demo",
    message: "",
  });

  const update =
    (field: keyof typeof form) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const recipient = form.topic === "sales" ? SALES_EMAIL : SUPPORT_EMAIL;
    const subject = `[${form.topic}] inquiry from ${form.name}`;
    const body =
      `From: ${form.name} (${form.email})\n` +
      (form.company ? `Company: ${form.company}\n` : "") +
      `Topic: ${form.topic}\n\n` +
      form.message;
    window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  return (
    <>
      {/* ─── Hero strip (Idea 2 — dark) ─── */}
      <section className="contact-hero contact-hero--dark">
        <div className="container">
          <div className="contact-hero__inner reveal">
            <T as="p" id="contact.hero.eyebrow" className="eyebrow" style={{ marginBottom: "1rem" }} />
            <span className="gold-line" aria-hidden="true" />
            <h1
              className="display-lg contact-hero__heading"
              dangerouslySetInnerHTML={{ __html: t("contact.hero.heading_html") }}
            />
            <T as="p" id="contact.hero.sub" className="contact-hero__sub" />

            {/* Live status badge — signals responsiveness */}
            <div className="contact-hero__status" aria-hidden="true">
              <span className="contact-hero__status-dot" />
              SUPPORT TEAM ONLINE
            </div>
          </div>
        </div>
      </section>

      {/* ─── Main grid: channels (left) + form (right) ─── */}
      <section className="contact-main">
        <div className="container">
          <div className="contact-grid">
            {/* LEFT — channels, phone, WhatsApp, hours */}
            <aside className="contact-channels reveal">
              <div className="contact-channels__row">
                {/* Sales card */}
                <a href={`mailto:${SALES_EMAIL}`} className="channel-card">
                  <span className="channel-card__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                      <path d="M3 7l9 6 9-6M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <T as="p" id="contact.channels.sales.label" className="channel-card__label" />
                  <p className="channel-card__value">{SALES_EMAIL}</p>
                  <T as="p" id="contact.channels.sales.desc" className="channel-card__desc" />
                </a>

                {/* Support card */}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="channel-card">
                  <span className="channel-card__icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                      <path d="M12 2a10 10 0 0 0-10 10 10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2zM12 7v5l3 3"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <T as="p" id="contact.channels.support.label" className="channel-card__label" />
                  <p className="channel-card__value">{SUPPORT_EMAIL}</p>
                  <T as="p" id="contact.channels.support.desc" className="channel-card__desc" />
                </a>
              </div>

              {/* Phone numbers — full width */}
              <div className="channel-card channel-card--phones">
                <span className="channel-card__icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                    <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"
                      stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <T as="p" id="contact.channels.phone.label" className="channel-card__label" />
                <div className="channel-card__phones">
                  <a href={`tel:${PHONE_1_TEL}`} className="channel-card__value">{PHONE_1_DISPLAY}</a>
                  <a href={`tel:${PHONE_2_TEL}`} className="channel-card__value">{PHONE_2_DISPLAY}</a>
                </div>
              </div>

              {/* WhatsApp button — prominent green CTA */}
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="contact-whatsapp">
                <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true">
                  <path d="M17.4 14.4c-.3-.1-1.7-.8-2-1-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4-.1-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.3-.3.3-1 1-1 2.5 0 1.5 1.1 2.9 1.2 3.1.1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 2-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
                </svg>
                <T id="contact.channels.whatsapp" />
              </a>

              {/* Office hours block */}
              <div className="contact-hours">
                <T as="p" id="contact.hours.label" className="contact-hours__label" />
                <T as="p" id="contact.hours.value" className="contact-hours__value" />
                <T as="p" id="contact.hours.closed" className="contact-hours__closed" />
                <hr className="contact-hours__sep" />
                <T as="p" id="contact.hours.response" className="contact-hours__response" />
              </div>
            </aside>

            {/* RIGHT — contact form */}
            <form className="contact-form reveal" onSubmit={handleSubmit}>
              <T as="h2" id="contact.form.heading" className="contact-form__heading" />

              <div className="contact-form__row">
                <label className="contact-form__field">
                  <T as="span" id="contact.form.name" className="contact-form__lbl" />
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={update("name")}
                    className="contact-form__input"
                  />
                </label>
                <label className="contact-form__field">
                  <T as="span" id="contact.form.email" className="contact-form__lbl" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={update("email")}
                    className="contact-form__input"
                  />
                </label>
              </div>

              <label className="contact-form__field">
                <T as="span" id="contact.form.company" className="contact-form__lbl" />
                <input
                  type="text"
                  value={form.company}
                  onChange={update("company")}
                  className="contact-form__input"
                />
              </label>

              <label className="contact-form__field">
                <T as="span" id="contact.form.topic" className="contact-form__lbl" />
                <select
                  value={form.topic}
                  onChange={update("topic")}
                  className="contact-form__input contact-form__select"
                >
                  <option value="demo">{t("contact.form.topic.demo")}</option>
                  <option value="sales">{t("contact.form.topic.sales")}</option>
                  <option value="support">{t("contact.form.topic.support")}</option>
                  <option value="other">{t("contact.form.topic.other")}</option>
                </select>
              </label>

              <label className="contact-form__field">
                <T as="span" id="contact.form.message" className="contact-form__lbl" />
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={update("message")}
                  className="contact-form__input contact-form__textarea"
                  placeholder={t("contact.form.placeholder.message")}
                />
              </label>

              <button type="submit" className="btn btn--gold contact-form__submit">
                <T id="contact.form.submit" />
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ─── Bottom strip: FAQ link + Demo tile ─── */}
      <section className="contact-extras">
        <div className="container">
          <div className="contact-extras__row">
            <Link href="/faq" className="extra-tile extra-tile--faq">
              <span className="extra-tile__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.5-2.5 2-2.5 3.5M12 17h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <div className="extra-tile__body">
                <T as="p" id="contact.faq.heading" className="extra-tile__heading" />
                <T as="p" id="contact.faq.cta" className="extra-tile__cta" />
              </div>
              <svg className="extra-tile__arrow" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>

            <a href={DEMO_URL} target="_blank" rel="noopener noreferrer" className="extra-tile extra-tile--demo">
              <span className="extra-tile__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" width="22" height="22">
                  <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M3 9h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
              <div className="extra-tile__body">
                <T as="p" id="contact.demo.heading" className="extra-tile__heading" />
                <T as="p" id="contact.demo.desc" className="extra-tile__desc" />
              </div>
              <span className="extra-tile__cta extra-tile__cta--gold">
                <T id="contact.demo.cta" />
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
