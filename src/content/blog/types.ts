import type { ImageKey } from "../media";

export type BlogLocale = "en" | "ru";

export type Post = {
  /** Same key across translations of one article; used for hreflang and the language switch. */
  translationKey: string;
  slug: string;
  title: string;
  /** Optional shorter `<title>` when the headline is too long for search results. */
  seoTitle?: string;
  description: string;
  keywords: string[];
  category: string;
  /** ISO dates (YYYY-MM-DD). */
  published: string;
  updated?: string;
  cover: ImageKey;
  coverAlt: string;
  /** 40-55 word, brand-free answer to the main query; shown under the headline and easy for search engines and LLMs to quote. */
  keyTakeaway: string;
  /** Article body in Markdown. */
  body: string;
  /** Rendered as the FAQ section and as FAQPage JSON-LD from the same data, so both always match. */
  faq: { q: string; a: string }[];
};
