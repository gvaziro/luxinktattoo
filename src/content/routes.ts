import { localePath, type Locale } from "./i18n";

/** translationKey → slug per language. Built on the server and passed to client navigation. */
export type BlogSlugMap = Record<string, Partial<Record<Locale, string>>>;

const blogBase = (lang: Locale) => (lang === "en" ? "/blog" : `/${lang}/blog`);

/** Link to a section of the home page, e.g. `/ru#work`; just the hash when already on the home page. */
export function sectionHref(lang: Locale, hash: string, onHome: boolean) {
  if (onHome) return hash;
  const home = localePath(lang);
  return home === "/" ? `/${hash}` : `${home}${hash}`;
}

export function isHomePath(lang: Locale, pathname: string) {
  return pathname.replace(/\/$/, "") === localePath(lang).replace(/\/$/, "");
}

/** Where the language switch should lead: the same article or blog page if it exists in `target`. */
export function alternatePath(pathname: string, current: Locale, target: Locale, slugs: BlogSlugMap) {
  const base = blogBase(current);
  const hasBlog = (l: Locale) => Object.values(slugs).some((entry) => entry[l]);

  if (pathname === base) return hasBlog(target) ? blogBase(target) : localePath(target);

  if (pathname.startsWith(`${base}/`)) {
    const slug = pathname.slice(base.length + 1);
    const entry = Object.values(slugs).find((e) => e[current] === slug);
    const translated = entry?.[target];
    if (translated) return `${blogBase(target)}/${translated}`;
    return hasBlog(target) ? blogBase(target) : localePath(target);
  }

  return localePath(target);
}
