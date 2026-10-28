import Image from "next/image";
import Link from "next/link";
import { postPath, type BlogLocale, type Post } from "@/content/blog";
import { readingTime } from "@/content/blog/markdown";
import { allImages } from "@/content/media";
import { ArrowIcon } from "../icons";
import { cx } from "../ui/cx";

export function formatDate(lang: BlogLocale, iso: string) {
  return new Intl.DateTimeFormat(lang, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(iso));
}

export function PostMeta({
  lang,
  post,
  minRead,
  className,
  showDate = true,
}: {
  lang: BlogLocale;
  post: Post;
  minRead: string;
  className?: string;
  showDate?: boolean;
}) {
  return (
    <p className={cx("flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.65rem] uppercase tracking-[0.24em] text-ash", className)}>
      <span className="text-blood">{post.category}</span>
      <span aria-hidden="true">·</span>
      <span>
        {readingTime(post.body)} {minRead}
      </span>
      {showDate ? (
        <>
          <span aria-hidden="true">·</span>
          <time dateTime={post.published}>{formatDate(lang, post.published)}</time>
        </>
      ) : null}
    </p>
  );
}

/** Article teaser used on the blog index, in "Read also" and on the home page. */
export function PostCard({
  lang,
  post,
  minRead,
  readMore,
  featured = false,
  headingLevel = "h3",
}: {
  lang: BlogLocale;
  post: Post;
  minRead: string;
  readMore: string;
  featured?: boolean;
  headingLevel?: "h2" | "h3";
}) {
  const Heading = headingLevel;
  return (
    <article className={cx("group relative", featured && "md:grid md:grid-cols-12 md:items-end md:gap-8")}>
      <div
        className={cx(
          "relative overflow-hidden bg-ink-2",
          featured ? "aspect-[4/3] md:col-span-7 md:aspect-[16/11]" : "aspect-[4/5]",
        )}
      >
        <Image
          src={allImages[post.cover]}
          alt={post.coverAlt}
          fill
          sizes={featured ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 32vw, 100vw"}
          placeholder="blur"
          className="object-cover brightness-[0.85] saturate-[0.85] transition-transform duration-[1.6s] ease-out-expo group-hover:scale-[1.05]"
        />
      </div>
      <div className={cx("mt-6", featured && "md:col-span-5 md:mt-0")}>
        <PostMeta lang={lang} post={post} minRead={minRead} />
        <Heading
          className={cx(
            "mt-4 font-display font-light leading-[1.08] transition-colors duration-500 group-hover:text-bone",
            featured ? "text-[clamp(2rem,3.6vw,3.4rem)]" : "text-[clamp(1.6rem,2.2vw,2.1rem)]",
          )}
        >
          <Link href={postPath(lang, post.slug)} className="after:absolute after:inset-0" data-cursor={readMore}>
            {post.title}
          </Link>
        </Heading>
        <p className="mt-4 line-clamp-3 text-[0.95rem] leading-[1.75] text-ash">{post.description}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.24em] text-bone-dim transition-colors group-hover:text-blood">
          {readMore}
          <ArrowIcon className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </div>
    </article>
  );
}
