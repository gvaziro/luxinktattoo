import { blogPath, getPosts, type BlogLocale } from "@/content/blog";
import type { Dictionary } from "@/content/i18n";
import { ArrowIcon } from "./icons";
import { PostCard } from "./blog/PostCard";
import { PillLink, Reveal, SectionLabel, SplitWords } from "./ui/motion";

/** Latest articles on the home page — internal links into the blog. */
export function Journal({ lang, dict }: { lang: BlogLocale; dict: Dictionary["blog"] }) {
  const posts = getPosts(lang).slice(0, 3);

  return (
    <section id="journal" className="relative border-t border-line px-(--gutter) py-28 md:py-40">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel as="h2" index="07" label={dict.title} />
          <SplitWords
            as="p"
            text={dict.latest}
            className="mt-8 block font-display text-[clamp(2.8rem,6vw,6rem)] font-light leading-[0.98]"
          />
        </div>
        <Reveal>
          <PillLink href={blogPath(lang)} variant="ghost" icon={<ArrowIcon />}>
            {dict.allPosts}
          </PillLink>
        </Reveal>
      </div>

      <ul className="mt-16 grid gap-14 md:mt-24 md:grid-cols-3 md:gap-8 lg:gap-10">
        {posts.map((post, i) => (
          <Reveal as="li" key={post.slug} delay={0.1 * i}>
            <PostCard lang={lang} post={post} minRead={dict.minRead} readMore={dict.readMore} />
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
