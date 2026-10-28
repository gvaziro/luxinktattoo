"use client";

import { motion } from "motion/react";
import type { Dictionary } from "@/content/i18n";
import { EASE_OUT, Reveal, SectionLabel, SplitWords } from "./ui/motion";

export function Standards({ dict }: { dict: Dictionary["standards"] }) {
  return (
    <section id="standards" className="relative bg-ink-2 px-(--gutter) py-28 md:py-44">
      <div className="grid gap-16 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <div className="md:sticky md:top-32">
            <SectionLabel as="h2" index="03" label={dict.label} />
            <SplitWords
              as="p"
              text={dict.title}
              className="mt-8 block max-w-[12ch] font-display text-[clamp(2.8rem,5.6vw,5.6rem)] font-light leading-[0.98]"
            />
          </div>
        </div>

        <ol className="md:col-span-7">
          {dict.items.map((item, i) => (
            <li key={item.title} className="group relative">
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left bg-line"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.1 * i }}
              />
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-blood transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
              />
              <Reveal delay={0.08 * i} className="grid grid-cols-[3.5rem_1fr] gap-x-4 py-10 md:grid-cols-[5rem_1fr] md:py-14">
                <span className="pt-2 text-[0.7rem] tracking-[0.2em] text-blood">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-display text-[clamp(1.9rem,3.4vw,3.2rem)] font-light leading-[1.05] transition-transform duration-700 ease-out-expo group-hover:translate-x-3">
                    {item.title}
                  </h3>
                  <p className="mt-5 max-w-lg text-[0.98rem] leading-[1.8] text-ash">{item.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
          <motion.li
            aria-hidden="true"
            className="h-px origin-left bg-line"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.4 }}
          />
        </ol>
      </div>
    </section>
  );
}
