"use client";

import { useState } from "react";
import type { Dictionary } from "@/content/i18n";
import { Reveal, SectionLabel, SplitWords, cx } from "./ui/motion";

/** Accordion whose answers stay in the DOM (collapsed with CSS) so they remain crawlable. */
export function Faq({ dict }: { dict: Dictionary["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-ink-2 px-(--gutter) py-28 md:py-40">
      <div className="grid gap-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <SectionLabel index="07" label={dict.label} />
            <SplitWords
              as="h2"
              text={dict.title}
              className="mt-8 block max-w-[10ch] font-display text-[clamp(2.8rem,5vw,5rem)] font-light leading-[0.98]"
            />
          </div>
        </div>

        <ul className="md:col-span-8 md:col-start-5">
          {dict.items.map((item, i) => {
            const isOpen = open === i;
            const id = `faq-${i}`;
            return (
              <Reveal as="li" key={item.q} delay={0.05 * i} className="border-b border-line first:border-t">
                <h3>
                  <button
                    type="button"
                    id={`${id}-q`}
                    aria-expanded={isOpen}
                    aria-controls={`${id}-a`}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="group flex w-full items-center justify-between gap-6 py-7 text-left md:py-9"
                  >
                    <span
                      className={cx(
                        "font-display text-[clamp(1.4rem,2.3vw,2.1rem)] leading-tight transition-colors duration-500",
                        isOpen ? "text-bone" : "text-bone-dim group-hover:text-bone",
                      )}
                    >
                      {item.q}
                    </span>
                    <span
                      aria-hidden="true"
                      className={cx(
                        "relative grid size-11 shrink-0 place-items-center rounded-full border transition-colors duration-500",
                        isOpen ? "border-blood bg-blood" : "border-bone/20 group-hover:border-bone/50",
                      )}
                    >
                      <span className="absolute h-px w-3.5 bg-bone" />
                      <span
                        className={cx(
                          "absolute h-3.5 w-px bg-bone transition-transform duration-500 ease-out-expo",
                          isOpen && "rotate-90 scale-y-0",
                        )}
                      />
                    </span>
                  </button>
                </h3>
                <div
                  id={`${id}-a`}
                  role="region"
                  aria-labelledby={`${id}-q`}
                  className={cx(
                    "grid transition-[grid-template-rows,opacity] duration-700 ease-out-expo",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-2xl pb-9 pr-14 text-[0.98rem] leading-[1.85] text-ash">{item.a}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
