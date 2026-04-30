"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

export function Platform() {
  const { t } = useLanguage();
  return (
    <section className="platform" id="platform" aria-labelledby="platform-heading">
      <div className="container">
        <div className="platform__intro">
          <div className="reveal">
            <T
              as="p"
              id="platform.index"
              className="eyebrow"
              style={{ marginBottom: "1rem" }}
            />
            <span className="gold-line" aria-hidden="true"></span>
            <h2
              id="platform-heading"
              className="display-lg"
              dangerouslySetInnerHTML={{ __html: t("platform.heading_html") }}
            />
          </div>
          <div className="reveal">
            <T as="p" id="platform.sub" className="platform__intro-sub" />
          </div>
        </div>

        <div className="offerings">
          {(["01", "02", "03", "04"] as const).map((n) => {
            // Each offering number maps to a capability key, used to attach the
            // matching background image (public/illustrations/<key>.png) via CSS.
            const capability = (
              { "01": "visibility", "02": "prediction", "03": "marketplace", "04": "documentation" } as const
            )[n];
            return (
            <div key={n} className={`offering reveal offering--has-image offering--${capability}`}>
              <div className="offering__num">{n}</div>
              <div className="offering__meta">
                <T as="p" id={`offering.${n}.tag`} className="offering__tag" />
                {n === "04" ? (
                  <h3
                    className="offering__title"
                    dangerouslySetInnerHTML={{ __html: t("offering.04.title_html") }}
                  />
                ) : (
                  <T as="h3" id={`offering.${n}.title`} className="offering__title" />
                )}
              </div>
              <div className="offering__content">
                <T as="p" id={`offering.${n}.body`} className="offering__body" />
              </div>
              <span className="offering__explore" aria-hidden="true">
                <T id="offering.explore" />
                <svg
                  className="offering__explore-arrow"
                  width="12"
                  height="12"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 7h10M8 3l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
