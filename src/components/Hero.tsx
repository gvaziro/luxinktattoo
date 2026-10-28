"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import type { Dictionary } from "@/content/i18n";
import { brandImages } from "@/content/media";
import { site, whatsappLink } from "@/content/site";
import { ArrowIcon, WhatsAppIcon } from "./icons";
import { EASE_OUT, Magnetic, PillLink, SplitWords } from "./ui/motion";
import { usePrefersReducedMotion } from "./ui/usePrefersReducedMotion";

type Props = { dict: Dictionary["hero"]; waMessage: string };

const letter = {
  hidden: { y: "105%" },
  show: (i: number) => ({ y: "0%", transition: { duration: 1.3, ease: EASE_OUT, delay: 0.45 + i * 0.07 } }),
};

export function Hero({ dict, waMessage }: Props) {
  const ref = useRef<HTMLElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const circleScale = useTransform(scrollYProgress, [0, 1], [1, 1.45]);
  const circleY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-55%"]);
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  // Pointer-driven "light" that illuminates the statue.
  const lightX = useMotionValue(50);
  const lightY = useMotionValue(32);
  const sx = useSpring(lightX, { stiffness: 60, damping: 18 });
  const sy = useSpring(lightY, { stiffness: 60, damping: 18 });
  const mask = useMotionTemplate`radial-gradient(circle at ${sx}% ${sy}%, #000 0%, rgba(0,0,0,0.55) 16%, transparent 38%)`;
  const glow = useMotionTemplate`radial-gradient(40% 40% at ${sx}% ${sy}%, rgba(200,22,29,0.22), transparent 70%)`;

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    lightX.set(((e.clientX - r.left) / r.width) * 100);
    lightY.set(((e.clientY - r.top) / r.height) * 100);
  };

  const words = ["LUX", "INK"];

  return (
    <section
      id="top"
      ref={ref}
      onPointerMove={onPointerMove}
      className="relative flex min-h-[100svh] flex-col overflow-hidden px-(--gutter) pb-8 pt-[96px] md:pb-10"
    >
      <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: glow }} />

      {/* Top meta row */}
      <motion.div className="relative z-10" style={{ opacity: fade }}>
        <motion.div
          className="flex items-start justify-between text-[0.65rem] uppercase tracking-[0.32em] text-ash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.1 }}
        >
          <p>
            <span className="text-bone">{dict.eyebrow}</span>
            <span className="mx-3 text-blood">—</span>
            {dict.location}
          </p>
          <p className="hidden sm:block">{site.coordinatesLabel}</p>
        </motion.div>
      </motion.div>

      {/* Centre: statue disc + wordmark */}
      <div className="relative grid flex-1 place-items-center py-6">
        <motion.div
          className="relative size-[min(86vw,54svh)] md:size-[min(60vw,60svh)]"
          style={{ scale: reduce ? 1 : circleScale, y: reduce ? 0 : circleY }}
        >
          <motion.div
            className="absolute inset-0 overflow-hidden rounded-full bg-ink-2"
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(50% at 50% 50%)" }}
            transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1], delay: 0.05 }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.35 }}
              animate={{ scale: 1 }}
              transition={{ duration: 2.2, ease: EASE_OUT, delay: 0.05 }}
            >
              <Image
                src={brandImages.statue}
                alt={dict.imageAlt}
                fill
                preload
                fetchPriority="high"
                sizes="(min-width: 768px) 70vh, 86vw"
                placeholder="blur"
                className="object-cover object-[50%_22%] brightness-[0.42] contrast-[1.15] grayscale"
              />
              <motion.div
                aria-hidden="true"
                className="absolute inset-0"
                style={{ maskImage: mask, WebkitMaskImage: mask }}
              >
                <Image
                  src={brandImages.statue}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 70vh, 86vw"
                  className="object-cover object-[50%_22%] contrast-[1.1] grayscale"
                />
              </motion.div>
            </motion.div>
            <div
              aria-hidden="true"
              className="absolute inset-0 rounded-full shadow-[inset_0_0_120px_40px_rgba(10,9,8,0.9)]"
            />
          </motion.div>
        </motion.div>

        <RotatingBadge />

        <motion.h1
          className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center text-center"
          style={{ y: reduce ? 0 : textY, opacity: fade }}
        >
          {words.map((word, w) => (
            <span
              key={word}
              className="glow block overflow-hidden font-display text-[clamp(5.5rem,24vw,19rem)] font-light leading-[0.8] tracking-[0.04em]"
            >
              {word.split("").map((char, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  variants={letter}
                  initial="hidden"
                  animate="show"
                  custom={w * 3 + i}
                >
                  {char}
                </motion.span>
              ))}
              {w === 0 ? <span className="sr-only"> </span> : null}
            </span>
          ))}
          <motion.span
            className="mt-5 block text-[0.7rem] font-medium uppercase tracking-[0.55em] text-bone/90 md:mt-7 md:text-[0.85rem]"
            initial={{ opacity: 0, letterSpacing: "1.2em" }}
            animate={{ opacity: 1, letterSpacing: "0.55em" }}
            transition={{ duration: 1.8, ease: EASE_OUT, delay: 1.05 }}
          >
            <span className="sr-only"> — </span>
            {dict.h1Sub}
          </motion.span>
        </motion.h1>
      </div>

      {/* Bottom row */}
      <motion.div
        className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        style={{ opacity: fade }}
      >
        <SplitWords
          as="p"
          animateOnMount
          delay={1.15}
          step={0.035}
          text={dict.tagline}
          className="max-w-md font-display text-[1.35rem] italic leading-snug text-bone-dim md:text-[1.6rem]"
        />

        <motion.div
          className="flex flex-wrap items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 1.45 }}
        >
          <Magnetic>
            <PillLink href={whatsappLink(waMessage)} external icon={<WhatsAppIcon />}>
              {dict.ctaPrimary}
            </PillLink>
          </Magnetic>
          <Magnetic>
            <PillLink href="#work" variant="ghost" icon={<ArrowIcon className="rotate-90" />}>
              {dict.ctaSecondary}
            </PillLink>
          </Magnetic>
        </motion.div>
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-(--gutter) top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 lg:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
      >
        <span className="text-[0.6rem] uppercase tracking-[0.4em] text-ash">{dict.scroll}</span>
        <span className="relative h-14 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2.2s_cubic-bezier(0.76,0,0.24,1)_infinite] bg-bone" />
        </span>
      </motion.div>
    </section>
  );
}

function RotatingBadge() {
  const text = "LUX INK · TATTOO STUDIO · BATUMI · ";
  return (
    <motion.a
      href="#contact"
      aria-label="Contact"
      className="absolute right-0 top-1/2 z-20 hidden size-32 -translate-y-1/2 place-items-center rounded-full lg:grid"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, ease: EASE_OUT, delay: 1.6 }}
    >
      <svg viewBox="0 0 120 120" className="absolute inset-0 size-full animate-spin-slow" aria-hidden="true">
        <defs>
          <path id="badge-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <text className="fill-bone text-[8.6px] uppercase">
          <textPath href="#badge-circle" textLength="286" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </svg>
      <ArrowIcon className="size-6 rotate-90 text-blood" />
    </motion.a>
  );
}
