"use client";

import { useLanguage } from "@/lib/LanguageContext";
import { T } from "@/lib/T";

/**
 * Section 001 · Context
 *
 * Layout:
 *   1. Header — eyebrow, gold line, headline, lead paragraph.
 *   2. Three "problem" cards with stylized visuals (chat / paper / dial).
 *   3. Dark "THE COST" panel with three big bold tiles (TIME / TRUST / MONEY).
 *   4. Closing line that bridges to the platform section below.
 */
export function Problem() {
  const { t } = useLanguage();
  return (
    <section className="problem" aria-labelledby="problem-heading">
      <div className="container">
        {/* ─── Header ─── */}
        <div className="problem__header reveal">
          <T as="span" id="problem.index" className="problem__index" />
          <span className="gold-line" aria-hidden="true" />
          <h2
            id="problem-heading"
            className="display-md problem__title"
            dangerouslySetInnerHTML={{ __html: t("problem.heading_html") }}
          />
          <T as="p" id="problem.lead" className="problem__lead" />
        </div>

        {/* ─── Three problem cards ─── */}
        <div className="problem__cards">
          {/* CARD 1 — chat updates */}
          <article className="problem-card reveal">
            <div
              className="problem-card__visual problem-card__visual--chat"
              aria-hidden="true"
            >
              {/*
                The story the timestamps tell:
                  09:14 — Dispatcher asks "Where is truck 1008?"
                  10:47 — Still no reply, sends "?" out of frustration
                  10:51 — Finally a half-apology, "Sorry, I will check now"
                          + typing dots that go nowhere
              */}
              <div className="chat-bubble chat-bubble--out">
                <span className="chat-text">{t("problem.chat.q")}</span>
                <span className="chat-time">09:14</span>
              </div>
              <div className="chat-bubble chat-bubble--out chat-bubble--narrow">
                <span className="chat-text">{t("problem.chat.q2")}</span>
                <span className="chat-time">10:47</span>
              </div>
              <div className="chat-bubble chat-bubble--in">
                <span className="chat-text">{t("problem.chat.a")}</span>
                <span className="chat-time chat-time--in">10:51</span>
              </div>
              <div className="chat-bubble chat-bubble--in">
                <span className="chat-dot" />
                <span className="chat-dot" />
                <span className="chat-dot" />
              </div>
            </div>
            <h3 className="problem-card__title">
              <T id="problem.card1.title" />
            </h3>
            <T as="p" id="problem.card1.desc" className="problem-card__desc" />
          </article>

          {/* CARD 2 — paper PODs */}
          <article className="problem-card reveal">
            <div
              className="problem-card__visual problem-card__visual--paper"
              aria-hidden="true"
            >
              <div className="paper-doc paper-doc--back" />
              <div className="paper-doc">
                <span className="paper-line" />
                <span className="paper-line paper-line--short" />
                <span className="paper-line" />
                <span className="paper-line paper-line--short" />
                <span className="paper-stamp">POD</span>
              </div>
            </div>
            <h3 className="problem-card__title">
              <T id="problem.card2.title" />
            </h3>
            <T as="p" id="problem.card2.desc" className="problem-card__desc" />
          </article>

          {/* CARD 3 — guesswork dial */}
          <article className="problem-card reveal">
            <div
              className="problem-card__visual problem-card__visual--guess"
              aria-hidden="true"
            >
              <div className="guess-circle">
                <span className="guess-mark">?</span>
              </div>
              <div className="guess-times">
                <span>13:00</span>
                <span>14:30</span>
                <span>15:??</span>
              </div>
            </div>
            <h3 className="problem-card__title">
              <T id="problem.card3.title" />
            </h3>
            <T as="p" id="problem.card3.desc" className="problem-card__desc" />
          </article>
        </div>

        {/* ─── "THE COST" dark impact panel ─── */}
        <div className="problem__cost reveal">
          <T
            as="p"
            id="problem.cost.eyebrow"
            className="problem__cost-eyebrow"
          />
          <span className="problem__cost-line" aria-hidden="true" />

          <div className="problem__cost-grid">
            <div className="cost-tile">
              <T as="p" id="problem.cost.tile1.label" className="cost-tile__label" />
              <T as="p" id="problem.cost.tile1.body" className="cost-tile__body" />
            </div>
            <div className="cost-tile">
              <T as="p" id="problem.cost.tile2.label" className="cost-tile__label" />
              <T as="p" id="problem.cost.tile2.body" className="cost-tile__body" />
            </div>
            <div className="cost-tile">
              <T as="p" id="problem.cost.tile3.label" className="cost-tile__label" />
              <T as="p" id="problem.cost.tile3.body" className="cost-tile__body" />
            </div>
          </div>
        </div>

        {/* ─── Closing line ─── */}
        <p className="problem__closing reveal">
          <T id="problem.closing" />
        </p>
      </div>
    </section>
  );
}
