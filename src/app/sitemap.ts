import type { MetadataRoute } from "next";
import { languageAlternates, localePath, locales } from "@/content/i18n";
import { workImages, workOrder } from "@/content/media";
import { site } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const absolute = (path: string) => `${site.url}${path}`;
  const languages = Object.fromEntries(
    Object.entries(languageAlternates()).map(([lang, path]) => [lang, absolute(path)]),
  );
  const images = workOrder.map((key) => absolute(workImages[key].src));

  return locales.map((lang) => ({
    url: absolute(localePath(lang)),
    lastModified: new Date("2026-10-28"),
    changeFrequency: "monthly",
    priority: lang === "en" ? 1 : 0.9,
    alternates: { languages },
    images,
  }));
}
