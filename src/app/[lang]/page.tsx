import { notFound } from "next/navigation";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Faq } from "@/components/Faq";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { Philosophy } from "@/components/Philosophy";
import { Process } from "@/components/Process";
import { Standards } from "@/components/Standards";
import { Studio } from "@/components/Studio";
import { Work } from "@/components/Work";
import { getDictionary, hasLocale } from "@/content/i18n";
import { JsonLd, buildJsonLd } from "@/content/seo";

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);
  const waMessage = dict.contact.waMessage;

  return (
    <>
      <JsonLd data={buildJsonLd(lang, dict)} />
      <Header lang={lang} nav={dict.nav} waMessage={waMessage} />
      <main id="main">
        <Hero dict={dict.hero} waMessage={waMessage} />
        <Marquee words={dict.marquee} />
        <About dict={dict.about} />
        <Work dict={dict.work} />
        <Standards dict={dict.standards} />
        <Studio dict={dict.studio} />
        <Philosophy dict={dict.philosophy} />
        <Process dict={dict.process} />
        <Faq dict={dict.faq} />
        <Contact dict={dict.contact} />
      </main>
      <Footer
        lang={lang}
        dict={dict.footer}
        nav={dict.nav}
        address={dict.contact.address}
        waMessage={waMessage}
      />
      <FloatingWhatsApp label={dict.contact.whatsapp} message={waMessage} />
    </>
  );
}
