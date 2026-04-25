"use client";

import { createElement, type HTMLAttributes, type JSX } from "react";
import { useLanguage } from "./LanguageContext";

type Tag = keyof JSX.IntrinsicElements;

type Props = Omit<HTMLAttributes<HTMLElement>, "id"> & {
  /** Translation key (not the HTML id — we deliberately shadow it). */
  id: string;
  /** Element tag to render. Defaults to `span`. */
  as?: Tag;
};

/**
 * Render a translated string. If the dictionary value contains markup (e.g. `<em>`, `<strong>`,
 * `<br />`), it's injected via `dangerouslySetInnerHTML`. Otherwise rendered as plain text.
 */
export function T({ id, as = "span", children: _children, ...rest }: Props) {
  const { t } = useLanguage();
  const raw = t(id);
  const hasMarkup = /<\/?[a-z][^>]*>/i.test(raw);
  if (hasMarkup) {
    return createElement(as, {
      ...rest,
      dangerouslySetInnerHTML: { __html: raw },
    });
  }
  return createElement(as, rest, raw);
}
