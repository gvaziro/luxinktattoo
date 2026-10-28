"use client";

import { useEffect, useState } from "react";

/**
 * Like motion's useReducedMotion, but always `false` during SSR and the first client render,
 * so server and client markup match; the real preference applies right after hydration.
 */
export function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduce(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduce;
}
