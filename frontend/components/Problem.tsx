"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

export function Problem() {
  const { t } = useLanguage();
  return (
    <section className="problem" aria-labelledby="problem-heading">
      <div className="container">
        <div className="problem__inner">
          <div className="problem__aside reveal">
            <T as="span" id="problem.index" className="problem__index" />
            <span className="gold-line" aria-hidden="true"></span>
            <h2
              id="problem-heading"
              className="display-md"
              dangerouslySetInnerHTML={{ __html: t("problem.heading_html") }}
            />
          </div>
          <div className="problem__body reveal">
            <T as="p" id="problem.p1" />
            <T as="p" id="problem.p2_html" />
            <T as="p" id="problem.p3" />
          </div>
        </div>
      </div>
    </section>
  );
}
