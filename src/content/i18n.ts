import { en } from "./dictionaries/en";
import { ru } from "./dictionaries/ru";
import { ka } from "./dictionaries/ka";

export const locales = ["en", "ru", "ka"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const localeMeta: Record<Locale, { label: string; name: string; og: string; hreflang: string }> = {
  en: { label: "EN", name: "English", og: "en_US", hreflang: "en" },
  ru: { label: "RU", name: "Русский", og: "ru_RU", hreflang: "ru" },
  ka: { label: "KA", name: "ქართული", og: "ka_GE", hreflang: "ka" },
};

const dictionaries = { en, ru, ka };

export type Dictionary = typeof en;

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];

/** Public path of a locale's home page. English lives at the root. */
export const localePath = (locale: Locale) => (locale === defaultLocale ? "/" : `/${locale}`);

export const languageAlternates = (): Record<string, string> =>
  Object.fromEntries([
    ...locales.map((l) => [localeMeta[l].hreflang, localePath(l)]),
    ["x-default", localePath(defaultLocale)],
  ]);
