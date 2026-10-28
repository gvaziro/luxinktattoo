"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { locales, localeMeta, localePath, type Dictionary, type Locale } from "@/content/i18n";
import { alternatePath, isHomePath, sectionHref, type BlogSlugMap } from "@/content/routes";
import { site, whatsappLink } from "@/content/site";
import { InstagramIcon, WhatsAppIcon } from "./icons";
import { cx } from "./ui/cx";
import { EASE_OUT, PillLink } from "./ui/motion";

type Props = {
  lang: Locale;
  nav: Dictionary["nav"];
  waMessage: string;
  /** Blog index path for this language, or null when the language has no articles. */
  blogHref: string | null;
  blogSlugs: BlogSlugMap;
};

export function Header({ lang, nav, waMessage, blogHref, blogSlugs }: Props) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lenis = useLenis();
  const pathname = usePathname();
  const onHome = isHomePath(lang, pathname);
  const { scrollY, scrollYProgress } = useScroll();

  const section = (hash: string) => sectionHref(lang, hash, onHome);
  const links = [
    { href: section("#about"), label: nav.about },
    { href: section("#work"), label: nav.work },
    { href: section("#standards"), label: nav.standards },
    { href: section("#studio"), label: nav.studio },
    ...(blogHref ? [{ href: blogHref, label: nav.blog }] : []),
    { href: section("#faq"), label: nav.faq },
    { href: section("#contact"), label: nav.contact },
  ];

  // In-page anchors scroll smoothly; links to other pages navigate normally.
  const onLinkClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("#")) goTo(e, href);
    else setOpen(false);
  };

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() ?? 0;
    setScrolled(current > 40);
    setHidden(current > 240 && current > previous);
  });

  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const goTo = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setOpen(false);
    document.documentElement.style.overflow = "";
    if (lenis) {
      lenis.start();
      lenis.scrollTo(href, { offset: -72, duration: 1.6, force: true });
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
    }
    history.replaceState(null, "", href);
  };

  const wa = whatsappLink(waMessage);

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[90] -translate-y-24 rounded-full bg-bone px-4 py-2 text-xs uppercase tracking-widest text-ink focus:translate-y-0"
      >
        {nav.skip}
      </a>

      <motion.div
        aria-hidden="true"
        className="fixed inset-x-0 top-0 z-[70] h-px origin-left bg-blood"
        style={{ scaleX: scrollYProgress }}
      />

      <motion.header
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
          scrolled && !open ? "border-b border-line bg-ink/70 backdrop-blur-xl" : "border-b border-transparent",
        )}
        animate={{ y: hidden && !open ? "-100%" : "0%" }}
        transition={{ duration: 0.6, ease: EASE_OUT }}
      >
        <div className="flex h-[72px] items-center justify-between px-(--gutter)">
          <a
            href={onHome ? "#top" : localePath(lang)}
            onClick={(e) => onLinkClick(e, onHome ? "#top" : localePath(lang))}
            className="relative z-10 flex flex-col leading-none"
            aria-label={`${site.shortName} — ${localeMeta[lang].name}`}
          >
            <span className="whitespace-nowrap font-display text-[1.45rem] font-medium tracking-[0.14em]">LUX INK</span>
            <span className="mt-1 whitespace-nowrap text-[0.5rem] uppercase tracking-[0.52em] text-ash">Tattoo Studio</span>
          </a>

          <nav aria-label={nav.menu} className="hidden xl:block">
            <ul className="flex items-center gap-7 2xl:gap-10">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => onLinkClick(e, link.href)}
                    aria-current={link.href === blogHref && pathname.startsWith(blogHref) ? "page" : undefined}
                    className="group relative py-2 text-[0.7rem] uppercase tracking-[0.24em] text-bone-dim transition-colors hover:text-bone aria-[current=page]:text-bone"
                  >
                    {link.label}
                    <span className="absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-blood transition-transform duration-500 ease-out-expo group-hover:origin-left group-hover:scale-x-100" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-4 md:gap-6">
            <LanguageSwitch
              lang={lang}
              label={nav.language}
              pathname={pathname}
              slugs={blogSlugs}
              className="hidden md:flex"
            />
            <span className="hidden sm:block">
              <PillLink href={wa} external variant="primary" icon={<WhatsAppIcon />}>
                {nav.book}
              </PillLink>
            </span>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="group flex h-12 items-center gap-3 xl:hidden"
            >
              <span className="text-[0.7rem] uppercase tracking-[0.24em]">{open ? nav.close : nav.menu}</span>
              <span className="relative block h-3 w-7" aria-hidden="true">
                <span
                  className={cx(
                    "absolute left-0 top-0 h-px w-full bg-bone transition-transform duration-500 ease-out-expo",
                    open && "top-1.5 rotate-45",
                  )}
                />
                <span
                  className={cx(
                    "absolute bottom-0 left-0 h-px w-full bg-bone transition-transform duration-500 ease-out-expo",
                    open && "bottom-1.5 -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-ink px-(--gutter) pb-10 pt-28 xl:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          >
            <nav aria-label={nav.menu} className="flex-1">
              <ul className="space-y-1">
                {links.map((link, i) => (
                  <li key={link.href} className="overflow-hidden">
                    <motion.a
                      href={link.href}
                      onClick={(e) => onLinkClick(e, link.href)}
                      className="flex items-baseline gap-4 py-1 font-display text-[clamp(2.4rem,11vw,4.5rem)] leading-[1.05]"
                      initial={{ y: "110%" }}
                      animate={{ y: "0%" }}
                      exit={{ y: "110%" }}
                      transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.25 + i * 0.05 }}
                    >
                      <span className="font-sans text-[0.65rem] tracking-[0.2em] text-blood">0{i + 1}</span>
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="space-y-6 border-t border-line pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6 } }}
              exit={{ opacity: 0 }}
            >
              <LanguageSwitch lang={lang} label={nav.language} pathname={pathname} slugs={blogSlugs} />
              <div className="flex flex-wrap gap-3">
                <PillLink href={wa} external icon={<WhatsAppIcon />}>
                  WhatsApp
                </PillLink>
                <PillLink href={site.instagram} external variant="ghost" icon={<InstagramIcon />}>
                  Instagram
                </PillLink>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function LanguageSwitch({
  lang,
  label,
  pathname,
  slugs,
  className,
}: {
  lang: Locale;
  label: string;
  pathname: string;
  slugs: BlogSlugMap;
  className?: string;
}) {
  return (
    <ul aria-label={label} className={cx("flex items-center gap-3 text-[0.7rem] tracking-[0.2em]", className)}>
      {locales.map((l, i) => (
        <li key={l} className="flex items-center gap-3">
          {i > 0 ? <span className="h-3 w-px bg-line" aria-hidden="true" /> : null}
          <a
            href={alternatePath(pathname, lang, l, slugs)}
            hrefLang={localeMeta[l].hreflang}
            lang={localeMeta[l].hreflang}
            aria-current={l === lang ? "page" : undefined}
            title={localeMeta[l].name}
            className={cx("transition-colors hover:text-bone", l === lang ? "text-bone" : "text-ash")}
          >
            {localeMeta[l].label}
          </a>
        </li>
      ))}
    </ul>
  );
}
