import { blogPath, lastModified, postPath, type BlogLocale, type Post } from "./blog";
import { localePath, locales, type Dictionary, type Locale } from "./i18n";
import { allImages, workImages, workOrder } from "./media";
import { mapsPlaceLink, site, whatsappLink } from "./site";

const absolute = (path: string) => `${site.url}${path}`;

/** schema.org graph: website, the studio as a TattooParlor, the page itself and its FAQ. */
export function buildJsonLd(lang: Locale, dict: Dictionary) {
  const pageUrl = absolute(localePath(lang));
  const websiteId = `${site.url}/#website`;
  const studioId = `${site.url}/#studio`;
  const images = workOrder.map((key) => absolute(workImages[key].src));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: absolute("/"),
        name: site.name,
        alternateName: site.shortName,
        inLanguage: [...locales],
        publisher: { "@id": studioId },
      },
      {
        "@type": "TattooParlor",
        "@id": studioId,
        name: site.name,
        alternateName: [site.shortName, "LUX INK Tattoo Studio Batumi"],
        slogan: "We don’t just create tattoos. We leave an emotion.",
        description: dict.meta.description,
        url: absolute("/"),
        telephone: site.phoneE164,
        image: images,
        logo: absolute("/icon-512.png"),
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          addressLocality: site.address.city,
          addressRegion: site.address.region,
          addressCountry: site.address.country,
        },
        geo: { "@type": "GeoCoordinates", latitude: site.googleMaps.lat, longitude: site.googleMaps.lng },
        hasMap: mapsPlaceLink,
        areaServed: { "@type": "City", name: "Batumi" },
        sameAs: [site.instagram, mapsPlaceLink],
        contactPoint: {
          "@type": "ContactPoint",
          telephone: site.phoneE164,
          contactType: "reservations",
          url: whatsappLink(),
        },
        knowsAbout: ["Custom tattoo design", "Fine line tattoo", "Black and grey realism", "Lettering", "Blackwork"],
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: dict.meta.title,
        description: dict.meta.description,
        inLanguage: lang,
        isPartOf: { "@id": websiteId },
        about: { "@id": studioId },
        primaryImageOfPage: images[0],
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        inLanguage: lang,
        isPartOf: { "@id": `${pageUrl}#webpage` },
        mainEntity: dict.faq.items.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
    ],
  };
}

const studioRef = { "@id": `${site.url}/#studio` };

function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

export function buildBlogJsonLd(lang: BlogLocale, dict: Dictionary, posts: Post[]) {
  const url = absolute(blogPath(lang));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${url}#blog`,
        url,
        name: dict.blog.title,
        description: dict.blog.metaDescription,
        inLanguage: lang,
        publisher: studioRef,
        blogPost: posts.map((post) => ({
          "@type": "BlogPosting",
          headline: post.title,
          url: absolute(postPath(lang, post.slug)),
          datePublished: post.published,
          image: absolute(allImages[post.cover].src),
        })),
      },
      breadcrumbs([
        { name: dict.blog.home, path: localePath(lang) },
        { name: dict.blog.label, path: blogPath(lang) },
      ]),
    ],
  };
}

export function buildPostJsonLd(lang: BlogLocale, dict: Dictionary, post: Post) {
  const url = absolute(postPath(lang, post.slug));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        mainEntityOfPage: url,
        url,
        headline: post.title,
        description: post.description,
        image: absolute(allImages[post.cover].src),
        datePublished: post.published,
        dateModified: lastModified(post),
        inLanguage: lang,
        articleSection: post.category,
        keywords: post.keywords.join(", "),
        wordCount: post.body.trim().split(/\s+/).length,
        author: { "@type": "Organization", name: site.name, url: absolute("/") },
        publisher: studioRef,
        isPartOf: { "@id": `${absolute(blogPath(lang))}#blog` },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        inLanguage: lang,
        isPartOf: { "@id": `${url}#article` },
        mainEntity: post.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: { "@type": "Answer", text: item.a },
        })),
      },
      breadcrumbs([
        { name: dict.blog.home, path: localePath(lang) },
        { name: dict.blog.label, path: blogPath(lang) },
        { name: post.title, path: postPath(lang, post.slug) },
      ]),
    ],
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
