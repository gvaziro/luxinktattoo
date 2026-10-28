import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { PostCard, PostMeta, formatDate } from "@/components/blog/PostCard";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { ParallaxImage, PillLink, Reveal, SplitWords } from "@/components/ui/motion";
import {
  blogPath,
  getPost,
  getPosts,
  getRelated,
  getTranslations,
  hasBlog,
  lastModified,
  postPath,
  type BlogLocale,
  type Post,
} from "@/content/blog";
import { renderMarkdown } from "@/content/blog/markdown";
import { getDictionary, localeMeta, localePath } from "@/content/i18n";
import { allImages } from "@/content/media";
import { JsonLd, buildPostJsonLd } from "@/content/seo";
import { site, whatsappLink } from "@/content/site";

export function generateStaticParams({ params }: { params: { lang: string } }) {
  if (hasBlog(params.lang)) return getPosts(params.lang).map((post) => ({ slug: post.slug }));
  // Cache Components needs at least one param; languages without articles get a placeholder that renders 404.
  return [{ slug: "none" }];
}

export async function generateMetadata({ params }: PageProps<"/[lang]/blog/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasBlog(lang)) return {};
  const post = getPost(lang, slug);
  if (!post) return {};
  const { blog } = getDictionary(lang);

  const translations = getTranslations(post.translationKey);
  const languages: Record<string, string> = {};
  for (const [l, p] of Object.entries(translations) as [BlogLocale, Post][]) {
    languages[localeMeta[l].hreflang] = postPath(l, p.slug);
  }
  if (translations.en) languages["x-default"] = postPath("en", translations.en.slug);

  const title = `${post.seoTitle ?? post.title} | LUX INK`;
  const url = postPath(lang, post.slug);

  return {
    title: { absolute: title },
    description: post.description,
    keywords: post.keywords,
    alternates: {
      canonical: url,
      languages,
      types: { "application/rss+xml": [{ url: `${blogPath(lang)}/rss.xml`, title: `${site.name}: ${blog.label}` }] },
    },
    openGraph: {
      type: "article",
      url,
      siteName: site.name,
      title,
      description: post.description,
      locale: localeMeta[lang].og,
      publishedTime: post.published,
      modifiedTime: lastModified(post),
      section: post.category,
      tags: post.keywords,
    },
    twitter: { card: "summary_large_image", title, description: post.description },
  };
}

export default async function BlogPost({ params }: PageProps<"/[lang]/blog/[slug]">) {
  const { lang, slug } = await params;
  if (!hasBlog(lang)) notFound();
  const post = getPost(lang, slug);
  if (!post) notFound();

  const dict = getDictionary(lang);
  const { html, toc } = renderMarkdown(post.body);
  const contents = [
    ...toc,
    { id: "faq", text: dict.blog.faqTitle },
    { id: "getting-started", text: dict.blog.gettingStarted },
  ];
  const related = getRelated(lang, post);

  return (
    <main id="main">
      <JsonLd data={buildPostJsonLd(lang, dict, post)} />

      <article>
        <header className="px-(--gutter) pt-32 md:pt-40">
          <Breadcrumbs
            items={[
              { label: dict.blog.home, href: localePath(lang) },
              { label: dict.blog.label, href: blogPath(lang) },
              { label: post.title },
            ]}
          />
          <PostMeta lang={lang} post={post} minRead={dict.blog.minRead} showDate={false} className="mt-12 md:mt-16" />
          <SplitWords
            as="h1"
            animateOnMount
            step={0.03}
            text={post.title}
            className="mt-6 block max-w-[22ch] font-display text-[clamp(2.6rem,6.2vw,6.4rem)] font-light leading-[0.98]"
          />

          <Reveal delay={0.3}>
            <p className="mt-8 flex flex-wrap gap-x-5 gap-y-1 text-[0.72rem] uppercase tracking-[0.2em] text-ash">
              <span>
                {dict.blog.byline}{" "}
                <Link
                  href={localePath(lang)}
                  className="text-bone-dim underline decoration-blood underline-offset-4 transition-colors hover:text-bone"
                >
                  {site.name}
                </Link>
              </span>
              <span>
                {dict.blog.published} <time dateTime={post.published}>{formatDate(lang, post.published)}</time>
              </span>
              {post.updated ? (
                <span>
                  {dict.blog.updated} <time dateTime={post.updated}>{formatDate(lang, post.updated)}</time>
                </span>
              ) : null}
            </p>
          </Reveal>

          <Reveal delay={0.4}>
            <aside aria-label={dict.blog.keyTakeaway} className="mt-10 max-w-3xl border-l border-blood pl-6 md:pl-8">
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.3em] text-blood">{dict.blog.keyTakeaway}</p>
              <p className="mt-3 font-display text-[clamp(1.35rem,2.2vw,1.8rem)] leading-[1.35] text-bone">
                {post.keyTakeaway}
              </p>
            </aside>
          </Reveal>
        </header>

        <div className="mt-14 px-(--gutter) md:mt-20">
          <ParallaxImage
            src={allImages[post.cover]}
            alt={post.coverAlt}
            sizes="100vw"
            preload
            strength={8}
            className="aspect-[4/3] w-full md:aspect-[21/9]"
          />
        </div>

        <div className="grid gap-12 px-(--gutter) py-16 md:grid-cols-12 md:gap-8 md:py-24">
          <aside className="md:col-span-3">
            <nav aria-label={dict.blog.toc} className="md:sticky md:top-28">
              <p className="text-[0.65rem] uppercase tracking-[0.3em] text-ash">{dict.blog.toc}</p>
              <ol className="mt-5 space-y-3 border-l border-line pl-5 text-sm">
                {contents.map((item) => (
                  <li key={item.id}>
                    <a href={`#${item.id}`} className="text-bone-dim transition-colors hover:text-blood">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>

          <div className="min-w-0 md:col-span-8 md:col-start-5 lg:col-span-7 lg:col-start-5">
            <div className="prose-ink" dangerouslySetInnerHTML={{ __html: html }} />

            <section aria-labelledby="faq" className="mt-20">
              <h2 id="faq" className="scroll-mt-24 font-display text-[clamp(1.9rem,3vw,2.6rem)] leading-[1.1]">
                {dict.blog.faqTitle}
              </h2>
              <div className="mt-8 border-t border-line">
                {post.faq.map((item, i) => (
                  <details key={item.q} open={i === 0} className="faq-details group border-b border-line">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 [&::-webkit-details-marker]:hidden">
                      <h3 className="font-display text-[1.35rem] leading-snug text-bone-dim transition-colors group-open:text-bone">
                        {item.q}
                      </h3>
                      <span
                        aria-hidden="true"
                        className="mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-bone/20 text-lg leading-none transition-transform duration-500 group-open:rotate-45 group-open:border-blood group-open:bg-blood"
                      >
                        +
                      </span>
                    </summary>
                    <p className="pb-7 pr-12 text-[1rem] leading-[1.8] text-ash">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>

            <section
              aria-labelledby="getting-started"
              className="relative mt-20 overflow-hidden border border-line bg-ink-2 p-8 md:p-12"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_80%_at_100%_100%,rgba(200,22,29,0.18),transparent_70%)]"
              />
              <h2
                id="getting-started"
                className="relative scroll-mt-24 font-display text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.05]"
              >
                {dict.blog.gettingStarted}
              </h2>
              <p className="relative mt-4 max-w-md text-ash">{dict.blog.ctaText}</p>
              <ol className="relative mt-8 space-y-4">
                {dict.blog.gettingStartedSteps.map((step, i) => (
                  <li key={i} className="flex gap-4 text-bone-dim">
                    <span className="font-display text-xl text-blood">{String(i + 1).padStart(2, "0")}</span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="relative mt-10 flex flex-wrap gap-3">
                <PillLink href={whatsappLink(dict.contact.waMessage)} external icon={<WhatsAppIcon />}>
                  {dict.blog.ctaButton}
                </PillLink>
                <PillLink href={site.instagram} external variant="ghost" icon={<InstagramIcon />}>
                  Instagram
                </PillLink>
              </div>
            </section>
          </div>
        </div>
      </article>

      {related.length ? (
        <section aria-labelledby="related-title" className="border-t border-line px-(--gutter) py-24 md:py-32">
          <h2 id="related-title" className="font-display text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-none">
            {dict.blog.related}
          </h2>
          <ul className="mt-14 grid gap-14 md:mt-20 md:grid-cols-3 md:gap-8 lg:gap-10">
            {related.map((p, i) => (
              <Reveal as="li" key={p.slug} delay={0.08 * i}>
                <PostCard lang={lang} post={p} minRead={dict.blog.minRead} readMore={dict.blog.readMore} />
              </Reveal>
            ))}
          </ul>
        </section>
      ) : null}
    </main>
  );
}
