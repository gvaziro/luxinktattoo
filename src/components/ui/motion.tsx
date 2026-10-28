"use client";

import {
  motion,
  stagger,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useRef, type ElementType, type PointerEvent, type ReactNode } from "react";

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

type ScrollOffset = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

import { cx } from "./cx";

/** Fades and lifts content in once it enters the viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "p" | "span";
}) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.1, ease: EASE_OUT, delay }}
    >
      {children}
    </Tag>
  );
}

const wordParent = (delay: number, step: number): Variants => ({
  hidden: {},
  show: { transition: { delayChildren: stagger(step, { startDelay: delay }) } },
});

const wordChild: Variants = {
  hidden: { y: "110%", rotate: 4 },
  show: { y: "0%", rotate: 0, transition: { duration: 1.15, ease: EASE_OUT } },
};

/** Masked word-by-word reveal for headings. Text stays real, selectable and indexable. */
export function SplitWords({
  text,
  className,
  delay = 0,
  step = 0.06,
  as = "span",
  animateOnMount = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  step?: number;
  as?: "span" | "h1" | "h2" | "h3" | "p" | "div";
  animateOnMount?: boolean;
}) {
  const Tag = motion[as] as typeof motion.span;
  const words = text.split(" ");
  const trigger = animateOnMount
    ? { animate: "show" }
    : { whileInView: "show", viewport: { once: true, margin: "0px 0px -8% 0px" } };

  return (
    <Tag className={className} initial="hidden" {...trigger} variants={wordParent(delay, step)}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-top">
            <motion.span className="inline-block origin-bottom-left will-change-transform" variants={wordChild}>
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

function ScrollWord({
  progress,
  range,
  children,
}: {
  progress: MotionValue<number>;
  range: [number, number];
  children: ReactNode;
}) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return <motion.span style={{ opacity }}>{children}</motion.span>;
}

/** Words light up one by one as the paragraph scrolls through the viewport. */
export function ScrollWords({
  text,
  className,
  as = "p",
  offset = ["start 0.85", "end 0.5"],
}: {
  text: string;
  className?: string;
  as?: "p" | "h2" | "blockquote";
  offset?: ScrollOffset;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const words = text.split(" ");
  const Tag = as as ElementType;

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, i) => {
        const start = i / words.length;
        return (
          <span key={i}>
            <ScrollWord progress={scrollYProgress} range={[start, start + 1 / words.length]}>
              {word}
            </ScrollWord>
            {i < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </Tag>
  );
}

/** Image that drifts inside its frame while scrolling and unveils itself from the bottom. */
export function ParallaxImage({
  src,
  alt,
  className,
  sizes,
  strength = 12,
  preload,
}: {
  src: StaticImageData;
  alt: string;
  className?: string;
  sizes: string;
  strength?: number;
  preload?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <motion.div
      ref={ref}
      className={cx("relative overflow-hidden bg-ink-2", className)}
      initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.4, ease: EASE_OUT }}
    >
      <motion.div className="absolute inset-[-14%_0]" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          placeholder="blur"
          preload={preload}
          className="object-cover brightness-[0.88] saturate-[0.85]"
        />
      </motion.div>
    </motion.div>
  );
}

/** Pulls its child slightly towards the mouse pointer. */
export function Magnetic({
  children,
  className,
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });
  const y = useSpring(0, { stiffness: 220, damping: 16, mass: 0.4 });

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cx("inline-block", className)}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  );
}

export function SectionLabel({
  index,
  label,
  className,
  as: Tag = "p",
}: {
  index: string;
  label: string;
  className?: string;
  as?: "p" | "h2";
}) {
  return (
    <Tag className={cx("flex items-center gap-4 text-[0.7rem] font-medium uppercase tracking-[0.32em] text-ash", className)}>
      <span className="text-blood" aria-hidden="true">
        ({index})
      </span>
      <span className="h-px w-10 bg-ash/40" aria-hidden="true" />
      <span>{label}</span>
    </Tag>
  );
}

type PillProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "ghost" | "light";
  size?: "md" | "lg";
  icon?: ReactNode;
  className?: string;
  external?: boolean;
  hrefLang?: string;
  ariaLabel?: string;
};

/** Pill-shaped link with an ink-fill hover. */
export function PillLink({
  href,
  children,
  variant = "primary",
  size = "md",
  icon,
  className,
  external,
  ariaLabel,
}: PillProps) {
  const base =
    "group relative inline-flex items-center gap-3 overflow-hidden rounded-full font-medium uppercase tracking-[0.18em] transition-colors duration-500 ease-out-expo";
  const sizes = {
    md: "h-12 px-6 text-[0.7rem]",
    lg: "h-16 px-8 text-[0.75rem] md:h-20 md:px-10 md:text-[0.8rem]",
  };
  const variants = {
    primary: "bg-blood text-bone hover:text-ink",
    ghost: "border border-bone/25 text-bone hover:text-ink",
    light: "bg-bone text-ink hover:text-bone",
  };
  const fill = {
    primary: "bg-bone",
    ghost: "bg-bone",
    light: "bg-blood",
  };

  return (
    <a
      href={href}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cx(base, sizes[size], variants[variant], className)}
    >
      <span
        aria-hidden="true"
        className={cx(
          "absolute inset-0 translate-y-full rounded-[inherit] transition-transform duration-700 ease-out-expo group-hover:translate-y-0",
          fill[variant],
        )}
      />
      {icon ? <span className="relative z-10 shrink-0 [&_svg]:size-[1.15em]">{icon}</span> : null}
      <span className="relative z-10 whitespace-nowrap">{children}</span>
    </a>
  );
}
