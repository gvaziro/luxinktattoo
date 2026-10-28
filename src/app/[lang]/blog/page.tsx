import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { PostCard } from "@/components/blog/PostCard";
import { Reveal, SectionLabel, SplitWords } from "@/components/ui/motion";
import { blogLocales, blogPath, getPosts, hasBlog } from "@/content/blog";
import { getDictionary, localeMeta, localePath } from "@/content/i18n";
import { JsonLd, buildBlogJsonLd } from "@/content/seo";
import { site } from "@/content/site";

export async function generateMetadata({ params }: PageProps<"/[lang]/blog">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasBlog(lang)) return {};
  const { blog } = getDictionary(lang);
  const title = `${blog.metaTitle} | LUX INK`;

  return {
    title: { absolute: title },
    description: blog.metaDescription,
    alternates: {
      canonical: blogPath(lang),
      languages: {
        ...Object.fromEntries(blogLocales.map((l) => [localeMeta[l].hreflang, blogPath(l)])),
        "x-default": blogPath("en"),
      },
      types: { "application/rss+xml": [{ url: `${blogPath(lang)}/rss.xml`, title: `${site.name}: ${blog.label}` }] },
    },
    openGraph: {
      type: "website",
      url: blogPath(lang),
      siteName: site.name,
      title,
      description: blog.metaDescription,
      locale: localeMeta[lang].og,
    },
    twitter: { card: "summary_large_image", title, description: blog.metaDescription },
  };
}

export default async function BlogIndex({ params }: PageProps<"/[lang]/blog">) {
  const { lang } = await params;
  if (!hasBlog(lang)) notFound();
  const dict = getDictionary(lang);
  const [featured, ...rest] = getPosts(lang);

  return (
    <main id="main" className="px-(--gutter) pb-28 pt-32 md:pb-40 md:pt-40">
      <JsonLd data={buildBlogJsonLd(lang, dict, [featured, ...rest])} />

      <Breadcrumbs items={[{ label: dict.blog.home, href: localePath(lang) }, { label: dict.blog.label }]} />

      <header className="mt-10 grid gap-10 border-b border-line pb-16 md:mt-14 md:grid-cols-12 md:items-end md:pb-24">
        <div className="md:col-span-8">
          <SectionLabel index={String(rest.length + 1).padStart(2, "0")} label={dict.blog.label} />
          <SplitWords
            as="h1"
            animateOnMount
            text={dict.blog.title}
            className="mt-8 block font-display text-[clamp(3.4rem,9vw,9rem)] font-light leading-[0.9]"
          />
        </div>
        <Reveal className="md:col-span-4" delay={0.3}>
          <p className="max-w-sm text-[1rem] leading-[1.8] text-ash">{dict.blog.intro}</p>
        </Reveal>
      </header>

      <Reveal className="mt-16 md:mt-24">
        <PostCard
          lang={lang}
          post={featured}
          minRead={dict.blog.minRead}
          readMore={dict.blog.readMore}
          featured
          headingLevel="h2"
        />
      </Reveal>

      <ul className="mt-24 grid gap-16 border-t border-line pt-16 md:mt-32 md:grid-cols-2 md:gap-x-8 md:gap-y-24 md:pt-24 lg:grid-cols-3 lg:gap-x-10">
        {rest.map((post, i) => (
          <Reveal as="li" key={post.slug} delay={0.08 * (i % 3)}>
            <PostCard lang={lang} post={post} minRead={dict.blog.minRead} readMore={dict.blog.readMore} headingLevel="h2" />
          </Reveal>
        ))}
      </ul>
    </main>
  );
}
