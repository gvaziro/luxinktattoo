"use client";

import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/i18n";
import { studioImages, studioOrder } from "@/content/media";
import { ArrowIcon } from "./icons";
import { SectionLabel, SplitWords, cx } from "./ui/motion";
import { usePrefersReducedMotion } from "./ui/usePrefersReducedMotion";

/** Pinned horizontal gallery on desktop, swipeable strip on touch screens. */
export function Studio({ dict }: { dict: Dictionary["studio"] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const [desktop, setDesktop] = useState(false);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const measure = () => {
      setDesktop(mq.matches);
      if (trackRef.current) setDistance(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    mq.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const pinned = desktop && !reduce;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);

  return (
    <section
      id="studio"
      ref={sectionRef}
      className="relative"
      style={pinned ? { height: `calc(100svh + ${distance}px)` } : undefined}
    >
      <div className={cx(pinned ? "sticky top-0 flex h-[100svh] items-center overflow-hidden" : "py-28")}>
        <motion.div
          ref={trackRef}
          style={{ x: pinned ? x : 0 }}
          className={cx(
            "flex px-(--gutter)",
            pinned
              ? "w-max items-center gap-10 lg:gap-14"
              : "no-scrollbar snap-x snap-mandatory items-end gap-4 overflow-x-auto scroll-px-(--gutter)",
          )}
        >
          <div className={cx("flex shrink-0 snap-start flex-col justify-center", pinned ? "w-[min(40vw,560px)] pr-6" : "w-[82vw] md:w-[min(44vw,560px)]")}>
            <SectionLabel index="04" label={dict.label} />
            <SplitWords
              as="h2"
              text={dict.title}
              className="mt-8 block font-display text-[clamp(2.6rem,4.8vw,5rem)] font-light leading-[0.98]"
            />
            <p className="mt-8 max-w-md text-[0.98rem] leading-[1.8] text-ash">{dict.text}</p>
            <p className="mt-10 flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.3em] text-bone-dim">
              {dict.hint}
              <ArrowIcon className="size-4 rotate-45 text-blood" />
            </p>
          </div>

          {studioOrder.map((key, i) => {
            const photo = dict.photos[key];
            return (
              <figure
                key={key}
                className={cx(
                  "group shrink-0 snap-start",
                  pinned ? (i % 2 ? "translate-y-[6vh]" : "-translate-y-[4vh]") : "",
                )}
              >
                <div
                  className={cx(
                    "relative overflow-hidden bg-ink-2",
                    pinned ? "h-[64svh] aspect-[3/4]" : "h-[62svh] max-h-[520px] aspect-[3/4]",
                  )}
                >
                  <Image
                    src={studioImages[key]}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 768px) 50vh, 70vw"
                    placeholder="blur"
                    className="object-cover transition-transform duration-[1.8s] ease-out-expo group-hover:scale-[1.05]"
                  />
                </div>
                <figcaption className="mt-4 flex items-center gap-4 text-[0.65rem] uppercase tracking-[0.26em] text-ash">
                  <span className="text-blood">{String(i + 1).padStart(2, "0")}</span>
                  <span className="h-px w-8 bg-line" aria-hidden="true" />
                  {photo.caption}
                </figcaption>
              </figure>
            );
          })}
          <div className="w-px shrink-0" aria-hidden="true" />
        </motion.div>

        {pinned ? (
          <div className="absolute inset-x-(--gutter) bottom-10 h-px bg-line" aria-hidden="true">
            <motion.div className="h-full origin-left bg-bone" style={{ scaleX: scrollYProgress }} />
          </div>
        ) : null}
      </div>
    </section>
  );
}
