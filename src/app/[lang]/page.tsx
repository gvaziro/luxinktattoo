import { notFound } from "next/navigation";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { Journal } from "@/components/Journal";
import { Marquee } from "@/components/Marquee";
import { Philosophy } from "@/components/Philosophy";
import { Process } from "@/components/Process";
import { Standards } from "@/components/Standards";
import { Studio } from "@/components/Studio";
import { Work } from "@/components/Work";
import { hasBlog } from "@/content/blog";
import { getDictionary, hasLocale } from "@/content/i18n";
import { JsonLd, buildJsonLd } from "@/content/seo";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <>
      <JsonLd data={buildJsonLd(lang, dict)} />
      <main id="main">
        <Hero dict={dict.hero} waMessage={dict.contact.waMessage} />
        <Marquee words={dict.marquee} />
        <About dict={dict.about} />
        <Work dict={dict.work} />
        <Standards dict={dict.standards} />
        <Studio dict={dict.studio} />
        <Philosophy dict={dict.philosophy} />
        <Process dict={dict.process} />
        {hasBlog(lang) ? <Journal lang={lang} dict={dict.blog} /> : null}
        <Faq dict={dict.faq} index={hasBlog(lang) ? "08" : "07"} />
        <Contact lang={lang} dict={dict.contact} index={hasBlog(lang) ? "09" : "08"} />
      </main>
    </>
  );
}
