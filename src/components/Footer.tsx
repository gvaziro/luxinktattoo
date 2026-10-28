"use client";

import { useLenis } from "lenis/react";
import { motion } from "motion/react";
import { useSyncExternalStore } from "react";
import { locales, localeMeta, localePath, type Dictionary, type Locale } from "@/content/i18n";
import { site, whatsappLink } from "@/content/site";
import { ArrowIcon } from "./icons";
import { EASE_OUT, cx } from "./ui/motion";

const noopSubscribe = () => () => {};

type Props = {
  lang: Locale;
  dict: Dictionary["footer"];
  nav: Dictionary["nav"];
  address: string;
  waMessage: string;
};

export function Footer({ lang, dict, nav, address, waMessage }: Props) {
  const lenis = useLenis();
  // Rendered statically at build time, refreshed on the client so the year never goes stale.
  const year = useSyncExternalStore(noopSubscribe, () => new Date().getFullYear(), () => 2026);
  const links = [
    { href: "#about", label: nav.about },
    { href: "#work", label: nav.work },
    { href: "#standards", label: nav.standards },
    { href: "#studio", label: nav.studio },
    { href: "#faq", label: nav.faq },
    { href: "#contact", label: nav.contact },
  ];

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative overflow-hidden border-t border-line px-(--gutter) pt-20 md:pt-28">
      <div className="grid gap-12 md:grid-cols-12">
        <p className="font-display text-[clamp(1.8rem,3vw,2.8rem)] font-light italic leading-tight text-bone-dim md:col-span-4">
          {dict.tagline}
        </p>

        <nav aria-label={dict.navigation} className="md:col-span-2 md:col-start-6">
          <p className="mb-5 text-[0.62rem] uppercase tracking-[0.3em] text-ash">{dict.navigation}</p>
          <ul className="space-y-2.5 text-sm">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-bone-dim transition-colors hover:text-bone">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-3">
          <p className="mb-5 text-[0.62rem] uppercase tracking-[0.3em] text-ash">{dict.contact}</p>
          <ul className="space-y-2.5 text-sm text-bone-dim">
            <li>{address}</li>
            <li>
              <a href={whatsappLink(waMessage)} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
                WhatsApp {site.phone}
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-bone">
                Instagram @{site.instagramHandle}
              </a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <p className="mb-5 text-[0.62rem] uppercase tracking-[0.3em] text-ash">{nav.language}</p>
          <ul className="space-y-2.5 text-sm">
            {locales.map((l) => (
              <li key={l}>
                <a
                  href={localePath(l)}
                  hrefLang={localeMeta[l].hreflang}
                  lang={localeMeta[l].hreflang}
                  aria-current={l === lang ? "page" : undefined}
                  className={cx("transition-colors hover:text-bone", l === lang ? "text-bone" : "text-ash")}
                >
                  {localeMeta[l].name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mt-20 select-none md:mt-28" aria-hidden="true">
        <p className="flex justify-between overflow-hidden font-display text-[23.5vw] font-light leading-[0.8] tracking-[-0.02em] text-outline-bone">
          {"LUX INK".split("").map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ y: "100%" }}
              whileInView={{ y: "0%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: EASE_OUT, delay: i * 0.05 }}
            >
              {ch === " " ? " " : ch}
            </motion.span>
          ))}
        </p>
      </div>

      <div className="flex flex-col gap-4 border-t border-line py-6 text-[0.65rem] uppercase tracking-[0.2em] text-ash md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {site.name}. {dict.rights}
        </p>
        <button type="button" onClick={toTop} className="group inline-flex items-center gap-2 uppercase hover:text-bone">
          {dict.backToTop}
          <ArrowIcon className="size-3.5 -rotate-45 transition-transform duration-500 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </footer>
  );
}
