import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cursor } from "@/components/ui/Cursor";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import {
  getDictionary,
  hasLocale,
  languageAlternates,
  localeMeta,
  localePath,
  locales,
} from "@/content/i18n";
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
    other: {
      "geo.region": "GE-AJ",
      "geo.placename": "Batumi",
    },
  };
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

  return (
    <html lang={lang} className={fontVariables}>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
        <div className="grain" aria-hidden="true" />
        <Cursor />
      </body>
    </html>
  );
}
