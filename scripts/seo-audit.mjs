// SEO audit of the running site (playbook section 14): prints PASS/FAIL per check and exits 1 on any failure.
// Usage: npm run build && npm run start, then: node scripts/seo-audit.mjs [baseUrl]
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");

const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
const strip = (html) => decode(html.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim();

const sitemap = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const known = new Set(urls.map((u) => u.replace(/\/$/, "") || "/"));

let failures = 0;
const check = (ok, label, detail = "") => {
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${detail ? `  (${detail})` : ""}`);
};

for (const path of urls) {
  const res = await fetch(`${base}${path}`);
  const html = await res.text();
  const lang = html.match(/<html lang="([^"]+)"/)?.[1] ?? "?";
  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "");
  const desc = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "");
  const isPost = /\/blog\/[^/]+$/.test(path);

  console.log(`\n${path} [${lang}]`);
  check(res.status === 200, "status 200", String(res.status));
  check(title.length > 0 && title.length <= 60, "title <= 60 chars", `${title.length}: ${title}`);
  check(desc.length >= 70 && desc.length <= 160, "description 70-160 chars", String(desc.length));
  check((html.match(/<h1[\s>]/g) ?? []).length === 1, "exactly one h1");
  check(/<link rel="canonical"/.test(html), "canonical present");

  if (lang === "en") {
    const head = `${title} ${desc}`;
    const body = strip(html.match(/<main[\s\S]*<\/main>/)?.[0] ?? "");
    check(!/[–—]/.test(head), "no em/en dashes in title/description (en)");
    check(!/[–—]/.test(body), "no em/en dashes in page text (en)", (body.match(/.{30}[–—].{30}/) ?? [""])[0]);
  }

  if (isPost) {
    const prose = html.match(/class="prose-ink"[^>]*>([\s\S]*?)<\/div>/)?.[1] ?? "";
    const links = [...prose.matchAll(/href="([^"]+)"/g)].map((m) => decode(m[1]));
    const internal = links.filter((l) => l.startsWith("/"));
    check(internal.length >= 6, "6+ internal links in body", String(internal.length));
    check(!internal.some((l) => l.split("#")[0] === path), "no self-links");
    const broken = internal.filter((l) => !known.has(l.split("#")[0].replace(/\/$/, "") || "/"));
    check(broken.length === 0, "all internal links point to sitemap URLs", broken.join(", "));

    const homeAnchors = [...prose.matchAll(/<a href="(\/|\/ru|\/ka)">([^<]+)<\/a>/g)].map((m) => m[2]);
    check(homeAnchors.length === 1, "exactly one keyword anchor to home in body", homeAnchors.join(" | "));

    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) =>
      JSON.parse(m[1]),
    );
    const graph = ld.flatMap((d) => d["@graph"] ?? [d]);
    const faqNode = graph.find((n) => n["@type"] === "FAQPage");
    const visibleQ = [...html.matchAll(/<summary[\s\S]*?<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => strip(m[1]));
    const schemaQ = (faqNode?.mainEntity ?? []).map((q) => q.name);
    check(
      schemaQ.length >= 4 && JSON.stringify(schemaQ) === JSON.stringify(visibleQ),
      "FAQ schema matches visible questions",
      `${schemaQ.length} vs ${visibleQ.length}`,
    );
    check(Boolean(graph.find((n) => n["@type"] === "BlogPosting")), "BlogPosting schema");
    check(Boolean(graph.find((n) => n["@type"] === "BreadcrumbList")), "BreadcrumbList schema");

    const takeaway = strip(html.match(/aria-label="[^"]*"[^>]*>\s*<p[^>]*>[^<]*<\/p>\s*<p[^>]*>([\s\S]*?)<\/p>/)?.[1] ?? "");
    const words = takeaway.split(/\s+/).filter(Boolean).length;
    check(words >= 35 && words <= 60, "key takeaway 35-60 words", String(words));
    check(!/LUX INK/i.test(takeaway), "key takeaway has no brand");
  }

  if (!isPost && !path.includes("/blog")) {
    const h2 = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map((m) => strip(m[1]).replace(/^\(\d+\)\s*/, ""));
    console.log(`      h2: ${h2.join(" | ")}`);
  }
}

console.log(`\n${failures === 0 ? "ALL CHECKS PASSED" : `${failures} check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);
