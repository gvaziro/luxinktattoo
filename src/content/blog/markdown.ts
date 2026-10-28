import { Marked } from "marked";

export type TocItem = { id: string; text: string };

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/&[a-z]+;/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "");

/** Renders article Markdown to HTML, giving h2s anchor ids and collecting them for the table of contents. */
export function renderMarkdown(source: string) {
  const toc: TocItem[] = [];
  const marked = new Marked({ gfm: true });

  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const html = this.parser.parseInline(tokens);
        const text = html.replace(/<[^>]+>/g, "");
        const id = slugify(text);
        if (depth === 2) toc.push({ id, text });
        return `<h${depth} id="${id}">${html}</h${depth}>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const external = /^https?:\/\//.test(href);
        const attrs = [
          `href="${href}"`,
          title ? `title="${title}"` : "",
          external ? 'target="_blank" rel="noopener noreferrer"' : "",
        ]
          .filter(Boolean)
          .join(" ");
        return `<a ${attrs}>${text}</a>`;
      },
    },
  });

  const html = marked.parse(source, { async: false });
  return { html, toc };
}

/** Rough reading time in minutes (~200 words per minute). */
export function readingTime(source: string) {
  const words = source.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}
