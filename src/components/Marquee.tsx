"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";
import { SparkIcon } from "./icons";
import { usePrefersReducedMotion } from "./ui/usePrefersReducedMotion";
import { cx } from "./ui/motion";

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/** A row of words that drifts sideways and speeds up / flips with scroll velocity. */
function VelocityRow({
  words,
  baseVelocity,
  className,
  outline,
}: {
  words: string[];
  baseVelocity: number;
  className?: string;
  outline?: boolean;
}) {
  const reduce = usePrefersReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const direction = useRef(1);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let moveBy = direction.current * baseVelocity * (delta / 1000);
    const f = factor.get();
    if (f < 0) direction.current = -1;
    else if (f > 0) direction.current = 1;
    moveBy += direction.current * moveBy * f;
    baseX.set(baseX.get() + moveBy);
  });

  const sequence = [...words, ...words];

  return (
    <div className="flex overflow-hidden whitespace-nowrap" aria-hidden="true">
      <motion.div className="flex shrink-0 items-center" style={{ x }}>
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {sequence.map((word, i) => (
              <span key={`${copy}-${i}`} className="flex items-center">
                <span className={cx(className, outline && i % 2 === 1 ? "text-outline-bone" : "")}>{word}</span>
                <SparkIcon className="mx-[0.35em] size-[0.28em] shrink-0 text-blood" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function Marquee({ words }: { words: string[] }) {
  return (
    <div className="relative overflow-hidden border-y border-line py-8 md:py-12">
      <VelocityRow
        words={words}
        baseVelocity={-2.2}
        outline
        className="font-display text-[clamp(3.2rem,9vw,8.5rem)] font-light italic leading-none"
      />
      <div className="mt-4 md:mt-6">
        <VelocityRow
          words={words}
          baseVelocity={1.6}
          className="text-[clamp(0.75rem,1.2vw,1rem)] uppercase tracking-[0.5em] text-ash"
        />
      </div>
    </div>
  );
}
