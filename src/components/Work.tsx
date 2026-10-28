"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content/i18n";
import { workImages, workOrder, type WorkKey } from "@/content/media";
import { site } from "@/content/site";
import { ChevronIcon, CloseIcon, InstagramIcon } from "./icons";
import { EASE_OUT, Magnetic, PillLink, Reveal, SectionLabel, SplitWords } from "./ui/motion";
import { usePrefersReducedMotion } from "./ui/usePrefersReducedMotion";

type Props = { dict: Dictionary["work"] };

const columns: WorkKey[][] = [
  ["lily", "lettering", "floral"],
  ["realism", "moth", "cross"],
  ["lantern", "portrait"],
];

const pad = (n: number) => String(n).padStart(2, "0");

export function Work({ dict }: Props) {
  const gridRef = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);

  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start end", "end start"] });
  const shifts: MotionValue<number>[] = [
    useTransform(scrollYProgress, [0, 1], [40, -60]),
    useTransform(scrollYProgress, [0, 1], [200, -160]),
    useTransform(scrollYProgress, [0, 1], [90, -30]),
  ];

  const open = (key: WorkKey, trigger: HTMLElement) => {
    lastTrigger.current = trigger;
    setActive(workOrder.indexOf(key));
  };
  const close = useCallback(() => {
    setActive(null);
    lastTrigger.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section id="work" className="relative px-(--gutter) py-28 md:py-44">
      <div className="grid gap-10 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <SectionLabel as="h2" index="02" label={dict.label} />
          <SplitWords
            as="p"
            text={dict.title}
            className="mt-8 block max-w-[14ch] font-display text-[clamp(3rem,7.5vw,7.5rem)] font-light leading-[0.95]"
          />
        </div>
        <Reveal className="md:col-span-4" delay={0.2}>
          <p className="max-w-sm text-[0.98rem] leading-[1.8] text-ash">{dict.intro}</p>
          <p className="mt-6 font-display text-6xl font-light text-outline-bone md:text-7xl" aria-hidden="true">
            ({pad(workOrder.length)})
          </p>
        </Reveal>
      </div>

      <div ref={gridRef} className="mt-16 grid grid-cols-2 gap-x-3 gap-y-8 md:mt-28 md:grid-cols-3 md:gap-x-6 lg:gap-x-10">
        {columns.map((col, c) => (
          <motion.ul
            key={c}
            className="contents md:flex md:flex-col md:gap-16 lg:gap-24"
            style={{ y: reduce ? 0 : shifts[c] }}
          >
            {col.map((key) => (
              <WorkItem
                key={key}
                index={workOrder.indexOf(key)}
                workKey={key}
                item={dict.items[key]}
                viewLabel={dict.view}
                onOpen={open}
              />
            ))}
          </motion.ul>
        ))}
      </div>

      <Reveal className="mt-24 flex justify-center md:mt-40">
        <Magnetic>
          <PillLink href={site.instagram} external variant="ghost" size="lg" icon={<InstagramIcon />}>
            {dict.more} · @{site.instagramHandle}
          </PillLink>
        </Magnetic>
      </Reveal>

      <AnimatePresence>
        {active !== null ? (
          <Lightbox index={active} dict={dict} onClose={close} onChange={setActive} />
        ) : null}
      </AnimatePresence>
    </section>
  );
}

function WorkItem({
  index,
  workKey,
  item,
  viewLabel,
  onOpen,
}: {
  index: number;
  workKey: WorkKey;
  item: { style: string; alt: string };
  viewLabel: string;
  onOpen: (key: WorkKey, trigger: HTMLElement) => void;
}) {
  return (
    <motion.li
      // On phones the column lists collapse into one grid, so `order` keeps the numbering sequential.
      style={{ order: index }}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1.4, ease: EASE_OUT }}
    >
      <button
        type="button"
        data-cursor={viewLabel}
        onClick={(e) => onOpen(workKey, e.currentTarget)}
        className="group block w-full text-left"
        aria-label={`${viewLabel}: ${item.style}`}
      >
        <span className="relative block aspect-[3/4] overflow-hidden bg-ink-2 md:aspect-auto">
          <Image
            src={workImages[workKey]}
            alt={item.alt}
            sizes="(min-width: 768px) 32vw, 48vw"
            placeholder="blur"
            className="h-full w-full object-cover saturate-[0.8] transition-[transform,filter] duration-[1.6s] ease-out-expo group-hover:scale-[1.06] group-hover:saturate-100 md:h-auto"
          />
          <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-40" />
          <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-bone/0 transition-[box-shadow] duration-700 group-hover:ring-bone/15" />
        </span>
        <span className="mt-3 flex items-baseline justify-between gap-3 text-[0.62rem] uppercase tracking-[0.2em] text-ash md:mt-4 md:text-[0.68rem]">
          <span className="text-blood">{pad(index + 1)}</span>
          <span className="text-right leading-snug transition-colors duration-500 group-hover:text-bone md:truncate">
            {item.style}
          </span>
        </span>
      </button>
    </motion.li>
  );
}

function Lightbox({
  index,
  dict,
  onClose,
  onChange,
}: {
  index: number;
  dict: Dictionary["work"];
  onClose: () => void;
  onChange: (i: number) => void;
}) {
  const lenis = useLenis();
  const closeRef = useRef<HTMLButtonElement>(null);
  const [direction, setDirection] = useState(1);
  const key = workOrder[index];
  const item = dict.items[key];

  const go = useCallback(
    (delta: number) => {
      setDirection(delta);
      onChange((index + delta + workOrder.length) % workOrder.length);
    },
    [index, onChange],
  );

  useEffect(() => {
    lenis?.stop();
    const root = document.documentElement;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      lenis?.start();
      root.style.overflow = "";
    };
  }, [lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.style}
      className="fixed inset-0 z-[80] flex flex-col bg-ink/95 backdrop-blur-md"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex h-[72px] shrink-0 items-center justify-between px-(--gutter) text-[0.7rem] uppercase tracking-[0.24em]">
        <span className="text-ash">
          <span className="text-bone">{pad(index + 1)}</span> / {pad(workOrder.length)}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="flex items-center gap-3 text-bone transition-colors hover:text-blood"
        >
          {dict.close}
          <CloseIcon className="size-5" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-(--gutter)">
        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={key}
            custom={direction}
            className="relative flex h-full max-h-[78svh] items-center justify-center"
            initial={{ opacity: 0, x: direction * 60, filter: "blur(8px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: direction * -60, filter: "blur(8px)" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80) go(1);
              else if (info.offset.x > 80) go(-1);
            }}
          >
            <Image
              src={workImages[key]}
              alt={item.alt}
              sizes="(min-width: 1024px) 60vw, 92vw"
              placeholder="blur"
              draggable={false}
              className="h-auto max-h-[78svh] w-auto max-w-[92vw] select-none object-contain"
            />
          </motion.div>
        </AnimatePresence>

        <button
          type="button"
          onClick={() => go(-1)}
          aria-label={dict.prev}
          className="absolute left-(--gutter) top-1/2 hidden size-14 -translate-y-1/2 place-items-center rounded-full border border-bone/20 transition-colors hover:border-blood hover:bg-blood md:grid"
        >
          <ChevronIcon className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label={dict.next}
          className="absolute right-(--gutter) top-1/2 hidden size-14 -translate-y-1/2 place-items-center rounded-full border border-bone/20 transition-colors hover:border-blood hover:bg-blood md:grid"
        >
          <ChevronIcon className="size-5 rotate-180" />
        </button>
      </div>

      <div className="flex h-20 shrink-0 items-center justify-between gap-4 px-(--gutter)">
        <p className="font-display text-xl italic text-bone-dim md:text-2xl">{item.style}</p>
        <div className="flex gap-2 md:hidden">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label={dict.prev}
            className="grid size-11 place-items-center rounded-full border border-bone/20"
          >
            <ChevronIcon className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label={dict.next}
            className="grid size-11 place-items-center rounded-full border border-bone/20"
          >
            <ChevronIcon className="size-4 rotate-180" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
