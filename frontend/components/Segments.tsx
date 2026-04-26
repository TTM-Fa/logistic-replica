"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

export function Segments() {
  const { t } = useLanguage();

  const segs: { key: string; icon: React.ReactNode }[] = [
    {
      key: "forwarders",
      icon: (
        <svg className="segment__icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect x="3" y="9" width="22" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <path
            d="M3 13h22M9 9V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      key: "shippers",
      icon: (
        <svg className="segment__icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path
            d="M5 20V11l9-5 9 5v9l-9 5-9-5Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <path d="M14 6v16M5 11l9 5 9-5" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      ),
    },
    {
      key: "tpl",
      icon: (
        <svg className="segment__icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <rect x="2" y="7" width="24" height="14" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M2 13h24M8 7V5M20 7V5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: "manufacturers",
      icon: (
        <svg className="segment__icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path
            d="M7 23V14l7-7 7 7v9H7Z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <rect x="11" y="17" width="6" height="6" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      ),
    },
    {
      key: "retailers",
      icon: (
        <svg className="segment__icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
          <path
            d="M4 9h20v13a1.5 1.5 0 0 1-1.5 1.5h-17A1.5 1.5 0 0 1 4 22V9Z"
            stroke="currentColor"
            strokeWidth="1.4"
          />
          <path
            d="M4 9l2.5-3.5h15L24 9M10.5 16h7"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="segments" id="segments" aria-labelledby="segments-heading">
      <div className="container">
        <div className="segments__header reveal">
          <div>
            <T as="p" id="segments.index" className="eyebrow" style={{ marginBottom: "1rem" }} />
            <span className="gold-line" aria-hidden="true"></span>
            <h2
              id="segments-heading"
              className="display-lg"
              dangerouslySetInnerHTML={{ __html: t("segments.heading_html") }}
            />
          </div>
          <T as="p" id="segments.sub" className="segments__header-sub" />
        </div>

        <div className="segments__grid" role="list">
          {segs.map(({ key, icon }) => (
            <div key={key} className="segment reveal" role="listitem">
              {icon}
              <T as="h3" id={`segments.${key}`} className="segment__name" />
              <T as="p" id={`segments.${key}_desc`} className="segment__desc" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
