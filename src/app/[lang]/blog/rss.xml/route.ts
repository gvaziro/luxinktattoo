import { blogLocales, blogPath, getPosts, hasBlog, postPath } from "@/content/blog";
import { getDictionary } from "@/content/i18n";
import { allImages } from "@/content/media";
import { site } from "@/content/site";

export function generateStaticParams() {
  return blogLocales.map((lang) => ({ lang }));
}

const escape = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export async function GET(_request: Request, { params }: RouteContext<"/[lang]/blog/rss.xml">) {
  const { lang } = await params;
  if (!hasBlog(lang)) return new Response("Not found", { status: 404 });

  const { blog } = getDictionary(lang);
  const posts = getPosts(lang);
  const channelUrl = `${site.url}${blogPath(lang)}`;

  const items = posts
    .map((post) => {
      const url = `${site.url}${postPath(lang, post.slug)}`;
      return `
    <item>
      <title>${escape(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(post.description)}</description>
      <category>${escape(post.category)}</category>
      <pubDate>${new Date(post.published).toUTCString()}</pubDate>
      <enclosure url="${site.url}${allImages[post.cover].src}" type="image/jpeg" length="0" />
    </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(`${site.name} — ${blog.title}`)}</title>
    <link>${channelUrl}</link>
    <description>${escape(blog.metaDescription)}</description>
    <language>${lang}</language>
    <atom:link href="${channelUrl}/rss.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
