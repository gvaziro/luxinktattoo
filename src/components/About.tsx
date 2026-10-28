import type { Dictionary } from "@/content/i18n";
import { studioImages } from "@/content/media";
import { ParallaxImage, Reveal, ScrollWords, SectionLabel } from "./ui/motion";

export function About({ dict }: { dict: Dictionary["about"] }) {
  return (
    <section id="about" className="relative px-(--gutter) py-28 md:py-44">
      <SectionLabel index="01" label={dict.label} />

      <ScrollWords
        as="h2"
        text={dict.lead}
        className="mt-10 max-w-[18ch] font-display text-[clamp(2.6rem,6.4vw,6.6rem)] font-light leading-[0.98] tracking-[-0.01em] md:mt-14"
      />

      <div className="mt-20 grid gap-14 md:mt-32 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <ParallaxImage
            src={studioImages.interior}
            alt={dict.imageAlt}
            sizes="(min-width: 768px) 40vw, 100vw"
            className="aspect-[4/5] w-full"
          />
        </div>

        <div className="flex flex-col justify-between gap-14 md:col-span-6 md:col-start-7">
          <div className="space-y-8">
            <Reveal>
              <p className="font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-[1.2] text-bone">{dict.welcome}</p>
            </Reveal>
            {dict.paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.08 * (i + 1)}>
                <p className="max-w-xl text-[0.98rem] leading-[1.8] text-ash md:text-[1.05rem]">{p}</p>
              </Reveal>
            ))}
          </div>

          <dl className="grid grid-cols-3 border-t border-line">
            {dict.stats.map((stat, i) => (
              <Reveal
                key={stat.value}
                delay={0.1 * i}
                className="flex flex-col-reverse justify-end border-line pr-3 pt-6 [&:not(:first-child)]:border-l [&:not(:first-child)]:pl-4 md:[&:not(:first-child)]:pl-6"
              >
                <dt className="mt-3 text-[0.68rem] uppercase leading-relaxed tracking-[0.16em] text-ash">{stat.label}</dt>
                <dd className="font-display text-[clamp(2.6rem,5vw,4.6rem)] font-light leading-none text-bone lining-nums">
                  {stat.value}
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
