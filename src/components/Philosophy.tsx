"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import type { Dictionary } from "@/content/i18n";
import { EASE_OUT, Reveal, ScrollWords, SectionLabel } from "./ui/motion";

export function Philosophy({ dict }: { dict: Dictionary["philosophy"] }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const needle = useTransform(scrollYProgress, [0.05, 0.4], [0, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0.3, 0.7, 1], [0, 1, 0.4]);

  return (
    <section id="philosophy" ref={ref} className="relative overflow-hidden px-(--gutter) py-32 text-center md:py-52">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(50%_60%_at_50%_100%,rgba(200,22,29,0.18),transparent_70%)]"
        style={{ opacity: glowOpacity }}
      />

      <SectionLabel as="h2" index="05" label={dict.label} className="relative justify-center" />

      <div className="relative mx-auto my-12 h-24 w-px overflow-hidden bg-line md:my-16 md:h-32" aria-hidden="true">
        <motion.div className="h-full w-full origin-top bg-blood" style={{ scaleY: needle }} />
      </div>

      <ScrollWords
        as="blockquote"
        text={dict.text}
        offset={["start 0.9", "end 0.55"]}
        className="relative mx-auto max-w-5xl font-display text-[clamp(2rem,4.4vw,4.3rem)] font-light leading-[1.14]"
      />

      <div className="relative mt-24 md:mt-36">
        <Reveal>
          <p className="text-[0.72rem] uppercase tracking-[0.4em] text-ash">{dict.closing1}</p>
        </Reveal>
        <motion.p
          className="mt-6 font-display text-[clamp(3.2rem,10vw,10rem)] font-light leading-[0.95]"
          initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ duration: 1.6, ease: EASE_OUT }}
        >
          {dict.closing2} <em className="text-blood">{dict.closingAccent}</em>
        </motion.p>
      </div>
    </section>
  );
}
