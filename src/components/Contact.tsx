import type { Dictionary, Locale } from "@/content/i18n";
import { directionsLink, mapEmbedSrc, mapsPlaceLink, site, whatsappLink } from "@/content/site";
import { ArrowIcon, InstagramIcon, PinIcon, WhatsAppIcon } from "./icons";
import { Magnetic, PillLink, Reveal, SectionLabel, SplitWords } from "./ui/motion";

const mapLinkClass =
  "group inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.24em] text-bone-dim transition-colors hover:text-blood";

export function Contact({
  lang,
  dict,
  index = "08",
}: {
  lang: Locale;
  dict: Dictionary["contact"];
  index?: string;
}) {
  const wa = whatsappLink(dict.waMessage);

  return (
    <section id="contact" className="relative overflow-hidden px-(--gutter) pb-24 pt-28 md:pb-32 md:pt-44">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[60vh] w-[90vw] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(200,22,29,0.14),transparent_70%)]"
      />

      <SectionLabel as="h2" index={index} label={dict.label} className="relative" />
      <SplitWords
        as="p"
        text={dict.title}
        step={0.05}
        className="relative mt-10 block max-w-[15ch] font-display text-[clamp(3.2rem,8.6vw,9rem)] font-light leading-[0.92]"
      />

      <div className="relative mt-14 grid gap-10 md:mt-20 md:grid-cols-12 md:items-end">
        <Reveal className="md:col-span-5">
          <p className="max-w-md text-[1.02rem] leading-[1.8] text-ash">{dict.text}</p>
        </Reveal>
        <Reveal delay={0.15} className="flex flex-wrap gap-3 md:col-span-7 md:justify-end">
          <Magnetic>
            <PillLink href={wa} external size="lg" icon={<WhatsAppIcon />}>
              {dict.whatsapp}
            </PillLink>
          </Magnetic>
          <Magnetic>
            <PillLink href={site.instagram} external size="lg" variant="ghost" icon={<InstagramIcon />}>
              {dict.instagram}
            </PillLink>
          </Magnetic>
        </Reveal>
      </div>

      <div className="relative mt-20 grid border-t border-line md:mt-28 md:grid-cols-12">
        <address className="grid gap-px not-italic md:col-span-5 md:pr-10">
          <ContactRow label={dict.addressLabel}>
            <p className="font-display text-[1.7rem] leading-snug md:text-[2rem]">{dict.address}</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3">
              <a href={directionsLink} target="_blank" rel="noopener noreferrer" className={mapLinkClass}>
                <PinIcon className="size-4" />
                {dict.directions}
                <ArrowIcon className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a href={mapsPlaceLink} target="_blank" rel="noopener noreferrer" className={mapLinkClass}>
                {dict.mapsLink}
                <ArrowIcon className="size-3.5 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
            </div>
          </ContactRow>
          <ContactRow label={dict.phoneLabel}>
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[1.7rem] leading-snug transition-colors hover:text-blood md:text-[2rem]"
            >
              {site.phone}
            </a>
          </ContactRow>
          <ContactRow label={dict.instagramLabel}>
            <a
              href={site.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="font-display text-[1.7rem] leading-snug transition-colors hover:text-blood md:text-[2rem]"
            >
              @{site.instagramHandle}
            </a>
          </ContactRow>
        </address>

        <Reveal className="mt-10 md:col-span-7 md:mt-0 md:border-l md:border-line md:pl-10 md:pt-10">
          <div className="relative aspect-[4/3] overflow-hidden bg-ink-2 md:aspect-[16/11]">
            <iframe
              title={dict.mapTitle}
              src={mapEmbedSrc(lang)}
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="map-dark absolute inset-0 size-full border-0"
            />
            <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-line" aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function ContactRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-line py-8 md:py-10">
      <p className="mb-3 text-[0.65rem] uppercase tracking-[0.3em] text-ash">{label}</p>
      {children}
    </div>
  );
}
