import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Cursor } from "@/components/ui/Cursor";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { blogLocales, blogPath, getPosts, hasBlog } from "@/content/blog";
import {
  getDictionary,
  hasLocale,
  languageAlternates,
  localeMeta,
  localePath,
  locales,
} from "@/content/i18n";
import type { BlogSlugMap } from "@/content/routes";
import { site } from "@/content/site";
import { fontVariables } from "../fonts";
import "../globals.css";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getDictionary(lang);

  return {
    metadataBase: new URL(site.url),
    title: { default: meta.title, template: meta.titleTemplate },
    description: meta.description,
    keywords: meta.keywords,
    applicationName: site.name,
    authors: [{ name: site.name, url: site.url }],
    creator: site.name,
    publisher: site.name,
    category: "Tattoo studio",
    alternates: {
      canonical: localePath(lang),
      languages: languageAlternates(),
      types: hasBlog(lang)
        ? { "application/rss+xml": [{ url: `${blogPath(lang)}/rss.xml`, title: `${site.name} — ${getDictionary(lang).blog.label}` }] }
        : undefined,
    },
    openGraph: {
      type: "website",
      url: localePath(lang),
      siteName: site.name,
      title: meta.title,
      description: meta.description,
      locale: localeMeta[lang].og,
      alternateLocale: locales.filter((l) => l !== lang).map((l) => localeMeta[l].og),
    },
    twitter: {
      card: "summary_large_image",
      title: meta.title,
      description: meta.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    formatDetection: { telephone: false, address: false, email: false },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
        ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION }
        : undefined,
    },
    other: {
      "geo.region": "GE-AJ",
      "geo.placename": "Batumi",
    },
  };
}

function blogSlugMap(): BlogSlugMap {
  const map: BlogSlugMap = {};
  for (const lang of blogLocales) {
    for (const post of getPosts(lang)) (map[post.translationKey] ??= {})[lang] = post.slug;
  }
  return map;
}

export const viewport: Viewport = {
  themeColor: "#0a0908",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const waMessage = dict.contact.waMessage;
  const blogHref = hasBlog(lang) ? blogPath(lang) : null;
  const blogSlugs = blogSlugMap();

  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <SmoothScroll>
          <Header lang={lang} nav={dict.nav} waMessage={waMessage} blogHref={blogHref} blogSlugs={blogSlugs} />
          {children}
          <Footer
            lang={lang}
            dict={dict.footer}
            nav={dict.nav}
            address={dict.contact.address}
            waMessage={waMessage}
            blogHref={blogHref}
            blogSlugs={blogSlugs}
          />
          <FloatingWhatsApp label={dict.contact.whatsapp} message={waMessage} />
        </SmoothScroll>
        <div className="grain" aria-hidden="true" />
        <Cursor />
      </body>
    </html>
  );
}
