"use client";

import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

// Real number once we have a backend; for now an animated marketing number.
const TARGET_COUNT = 1247;
const INFO_EMAIL = "info@shenatech.com";

export function Waitlist() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [count, setCount] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const startedRef = useRef(false);

  // Count up from 0 → TARGET_COUNT when the section first comes into view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const noMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (noMotion) {
      setCount(TARGET_COUNT);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !startedRef.current) {
            startedRef.current = true;
            const duration = 1600;
            const start = performance.now();
            const tick = (now: number) => {
              const elapsed = now - start;
              const progress = Math.min(elapsed / duration, 1);
              // ease-out cubic for a satisfying decel
              const eased = 1 - Math.pow(1 - progress, 3);
              setCount(Math.round(TARGET_COUNT * eased));
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Without a backend yet, fire a mailto so the email lands in the team's inbox.
    const subject = encodeURIComponent("Join Waitlist");
    const body = encodeURIComponent(`Please add me to the waitlist. My email: ${email}`);
    window.location.href = `mailto:${INFO_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  return (
    <section className="waitlist" id="waitlist" ref={sectionRef} aria-labelledby="waitlist-heading">
      {/* Animated background layers */}
      <div className="waitlist__atmosphere" aria-hidden="true" />
      <div className="waitlist__grid" aria-hidden="true" />

      <div className="container">
        <div className="waitlist__content">
          <T as="p" id="waitlist.index" className="eyebrow waitlist__eyebrow" />
          <span className="gold-line" aria-hidden="true" />
          <T as="h2" id="waitlist.heading" className="display-lg waitlist__heading" />
          <T as="p" id="waitlist.sub" className="waitlist__sub" />

          {!submitted ? (
            <form className="waitlist__form" onSubmit={handleSubmit} noValidate>
              <input
                type="email"
                required
                aria-label={t("waitlist.email_placeholder")}
                placeholder={t("waitlist.email_placeholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="waitlist__input"
              />
              <button type="submit" className="btn btn--gold waitlist__submit">
                <T id="waitlist.cta" />
              </button>
            </form>
          ) : (
            <div className="waitlist__success" role="status">
              <T id="waitlist.success" />
            </div>
          )}

          <p className="waitlist__counter">
            <span className="waitlist__counter-num">{count.toLocaleString()}</span>
            {" "}
            <T id="waitlist.counter_text" as="span" />
          </p>
        </div>
      </div>
    </section>
  );
}
