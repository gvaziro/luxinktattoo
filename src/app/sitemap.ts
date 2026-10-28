import type { MetadataRoute } from "next";
import {
  blogLocales,
  blogPath,
  getPosts,
  getTranslations,
  lastModified,
  postPath,
  type BlogLocale,
  type Post,
} from "@/content/blog";
import { languageAlternates, localeMeta, localePath, locales } from "@/content/i18n";
import { allImages, workImages, workOrder } from "@/content/media";
import { site } from "@/content/site";

const absolute = (path: string) => `${site.url}${path}`;
const SITE_UPDATED = new Date("2026-10-28");

export default function sitemap(): MetadataRoute.Sitemap {
  const homeLanguages = Object.fromEntries(
    Object.entries(languageAlternates()).map(([lang, path]) => [lang, absolute(path)]),
  );
  const workPhotos = workOrder.map((key) => absolute(workImages[key].src));

  const home = locales.map((lang) => ({
    url: absolute(localePath(lang)),
    lastModified: SITE_UPDATED,
    changeFrequency: "monthly" as const,
    priority: lang === "en" ? 1 : 0.9,
    alternates: { languages: homeLanguages },
    images: workPhotos,
  }));

  const blogLanguages = {
    ...Object.fromEntries(blogLocales.map((l) => [localeMeta[l].hreflang, absolute(blogPath(l))])),
    "x-default": absolute(blogPath("en")),
  };
  const blogIndexes = blogLocales.map((lang) => ({
    url: absolute(blogPath(lang)),
    lastModified: new Date(lastModified(getPosts(lang)[0])),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    alternates: { languages: blogLanguages },
  }));

  const posts = blogLocales.flatMap((lang) =>
    getPosts(lang).map((post) => {
      const translations = Object.entries(getTranslations(post.translationKey)) as [BlogLocale, Post][];
      const languages = Object.fromEntries(
        translations.map(([l, p]) => [localeMeta[l].hreflang, absolute(postPath(l, p.slug))]),
      );
      const english = translations.find(([l]) => l === "en");
      if (english) languages["x-default"] = absolute(postPath("en", english[1].slug));

      return {
        url: absolute(postPath(lang, post.slug)),
        lastModified: new Date(lastModified(post)),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        alternates: { languages },
        images: [absolute(allImages[post.cover].src)],
      };
    }),
  );

  return [...home, ...blogIndexes, ...posts];
}
