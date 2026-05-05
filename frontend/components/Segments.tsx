"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

/**
 * Section 002 · Who It's For — Showcase layout (idea 1, finalised)
 *
 * Vertical list of segments on the left (numbered, with a gold "active"
 * indicator bar that grows from 0 to 60% height when selected).
 * Large preview pane on the right shows the active segment's icon,
 * name, description, and a position counter (01 / 05).
 *
 * Auto-rotates every 5s; pauses on hover anywhere in the showcase.
 */
export function Segments() {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const segs: { key: string; icon: React.ReactNode }[] = [
    {
      key: "forwarders",
      icon: (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect x="3" y="9" width="22" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 13h22M9 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: "shippers",
      icon: (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M5 20V11l9-5 9 5v9l-9 5-9-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M14 6v16M5 11l9 5 9-5" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ),
    },
    {
      key: "tpl",
      icon: (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect x="2" y="7" width="24" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
          <path d="M2 13h24M8 7V5M20 7V5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: "manufacturers",
      icon: (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M7 23V14l7-7 7 7v9H7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <rect x="11" y="17" width="6" height="6" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      ),
    },
    {
      key: "retailers",
      icon: (
        <svg viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path d="M4 9h20v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 4 22V9Z" stroke="currentColor" strokeWidth="1.6" />
          <path d="M4 9l2.5-3.5h15L24 9M10.5 16h7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      ),
    },
  ];

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % segs.length);
    }, 5000);
    return () => clearInterval(id);
  }, [paused, segs.length]);

  return (
    <section className="segments" id="segments" aria-labelledby="segments-heading">
      <div className="container">
        <div className="segments__header reveal">
          <div className="segments__header-left">
            <T as="p" id="segments.index" className="eyebrow" style={{ marginBottom: "1rem" }} />
            <span className="gold-line" aria-hidden="true"></span>
            <h2
              id="segments-heading"
              className="display-lg"
              dangerouslySetInnerHTML={{ __html: t("segments.heading_html") }}
            />
          </div>
          <aside className="segments__header-right">
            <T as="p" id="segments.sub" className="segments__header-sub" />
          </aside>
        </div>

        <div
          className="segments__showcase reveal"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <ol className="segments__list" role="tablist" aria-label="Customer segments">
            {segs.map((seg, i) => (
              <li key={seg.key} role="presentation">
                <button
                  type="button"
                  role="tab"
                  className={`segments__list-item${i === activeIndex ? " is-active" : ""}`}
                  onMouseEnter={() => setActiveIndex(i)}
                  onClick={() => setActiveIndex(i)}
                  onFocus={() => setActiveIndex(i)}
                  aria-selected={i === activeIndex}
                  aria-controls={`segments-pane-${seg.key}`}
                >
                  <span className="segments__list-bar" aria-hidden="true" />
                  <span className="segments__list-num">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <T id={`segments.${seg.key}`} as="span" className="segments__list-name" />
                </button>
              </li>
            ))}
          </ol>

          <div className="segments__preview">
            {segs.map((seg, i) => (
              <div
                key={seg.key}
                id={`segments-pane-${seg.key}`}
                role="tabpanel"
                className={`segments__preview-pane${i === activeIndex ? " is-active" : ""}`}
                aria-hidden={i !== activeIndex}
              >
                <div className="segments__preview-icon">{seg.icon}</div>
                <T as="h3" id={`segments.${seg.key}`} className="segments__preview-name" />
                <T as="p" id={`segments.${seg.key}_desc`} className="segments__preview-desc" />
              </div>
            ))}
            <div className="segments__preview-counter" aria-hidden="true">
              <span className="segments__preview-counter-now">
                {String(activeIndex + 1).padStart(2, "0")}
              </span>
              <span className="segments__preview-counter-sep"> / </span>
              <span className="segments__preview-counter-total">
                {String(segs.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
