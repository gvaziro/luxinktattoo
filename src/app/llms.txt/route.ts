import { blogLocales, getPosts, postPath } from "@/content/blog";
import { en } from "@/content/dictionaries/en";
import { site } from "@/content/site";

/** Plain-text summary of the studio for AI assistants and answer engines (llmstxt.org). */
export function GET() {
  const articles = blogLocales
    .flatMap((lang) => getPosts(lang).map((p) => `- [${p.title}](${site.url}${postPath(lang, p.slug)}) (${lang}): ${p.description}`))
    .join("\n");

  const body = `# ${site.name}

> ${en.meta.description}

LUX INK is a tattoo studio in Batumi, Georgia. Artists with over 5 years of experience work in a variety of styles — fine line, floral, lettering and calligraphy, blackwork, black & grey realism, black & red. Every design is created individually. Strict hygiene and sterilization: single-use materials wherever applicable, reusable equipment properly sterilized.

## Contact

- Address: Petre Melikishvili Street 13, Batumi, Georgia
- WhatsApp: ${site.phone} (https://wa.me/${site.whatsapp})
- Instagram: @${site.instagramHandle} (${site.instagram})
- Booking: message the studio on WhatsApp or Instagram to discuss the design and book a session.

## Pages

- [Home (English)](${site.url}/)
- [Главная (Русский)](${site.url}/ru)
- [მთავარი (ქართული)](${site.url}/ka)
- [Journal (English)](${site.url}/blog)
- [Журнал (Русский)](${site.url}/ru/blog)

## Articles

${articles}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
