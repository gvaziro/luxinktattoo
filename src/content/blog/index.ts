import type { Locale } from "../i18n";
import type { BlogLocale, Post } from "./types";

import enHoliday from "./posts/en/tattoo-on-holiday-in-batumi";
import enChoose from "./posts/en/how-to-choose-a-tattoo-studio-in-batumi";
import enAftercare from "./posts/en/tattoo-aftercare-guide";
import enStyles from "./posts/en/tattoo-styles-guide";
import enPrepare from "./posts/en/how-to-prepare-for-a-tattoo";
import enPain from "./posts/en/does-getting-a-tattoo-hurt";

import ruHoliday from "./posts/ru/tatu-v-otpuske-v-batumi";
import ruChoose from "./posts/ru/kak-vybrat-tatu-salon-v-batumi";
import ruAftercare from "./posts/ru/uhod-za-tatuirovkoj";
import ruStyles from "./posts/ru/stili-tatuirovok";
import ruPrepare from "./posts/ru/kak-podgotovitsya-k-tatu-seansu";
import ruPain from "./posts/ru/bolno-li-delat-tatu";

export type { BlogLocale, Post } from "./types";

/** Listed newest first; posts sharing a date keep this order. */
const posts: Record<BlogLocale, Post[]> = {
  en: [enHoliday, enChoose, enAftercare, enStyles, enPrepare, enPain],
  ru: [ruHoliday, ruChoose, ruAftercare, ruStyles, ruPrepare, ruPain],
};

export const blogLocales = Object.keys(posts) as BlogLocale[];

export const hasBlog = (lang: string): lang is BlogLocale => (blogLocales as string[]).includes(lang);

export const blogPath = (lang: Locale) => (lang === "en" ? "/blog" : `/${lang}/blog`);
export const postPath = (lang: Locale, slug: string) => `${blogPath(lang)}/${slug}`;

export function getPosts(lang: BlogLocale): Post[] {
  return [...posts[lang]].sort((a, b) => b.published.localeCompare(a.published));
}

export function getPost(lang: BlogLocale, slug: string): Post | undefined {
  return posts[lang].find((p) => p.slug === slug);
}

/** The same article in every language it exists in. */
export function getTranslations(translationKey: string): Partial<Record<BlogLocale, Post>> {
  const result: Partial<Record<BlogLocale, Post>> = {};
  for (const lang of blogLocales) {
    const match = posts[lang].find((p) => p.translationKey === translationKey);
    if (match) result[lang] = match;
  }
  return result;
}

export function getRelated(lang: BlogLocale, post: Post, count = 3): Post[] {
  const others = getPosts(lang).filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => p.category === post.category);
  return [...sameCategory, ...others.filter((p) => p.category !== post.category)].slice(0, count);
}

export const lastModified = (post: Post) => post.updated ?? post.published;
