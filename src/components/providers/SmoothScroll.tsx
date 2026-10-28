"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { usePrefersReducedMotion } from "../ui/usePrefersReducedMotion";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = usePrefersReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      {reduce ? (
        children
      ) : (
        <ReactLenis root options={{ lerp: 0.09, anchors: { offset: -72 }, allowNestedScroll: true }}>
          {children}
        </ReactLenis>
      )}
    </MotionConfig>
  );
}
