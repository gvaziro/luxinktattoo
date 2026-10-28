import type { Dictionary } from "@/content/i18n";
import { Reveal, SectionLabel, SplitWords } from "./ui/motion";

export function Process({ dict }: { dict: Dictionary["process"] }) {
  return (
    <section id="process" className="relative border-t border-line px-(--gutter) py-28 md:py-40">
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <SectionLabel index="06" label={dict.label} />
          <SplitWords
            as="h2"
            text={dict.title}
            className="mt-8 block font-display text-[clamp(2.8rem,6vw,6rem)] font-light leading-[0.98]"
          />
        </div>
      </div>

      <ol className="mt-16 grid gap-px overflow-hidden border border-line bg-line md:mt-24 md:grid-cols-3">
        {dict.steps.map((step, i) => (
          <li key={step.title} className="group relative bg-ink">
            <Reveal delay={0.12 * i} className="flex h-full flex-col p-8 md:p-10 lg:p-12">
              <span
                aria-hidden="true"
                className="font-display text-[clamp(5rem,9vw,8.5rem)] font-light leading-none text-outline-bone transition-colors duration-700 group-hover:text-blood/90"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-10 font-display text-[clamp(1.7rem,2.4vw,2.3rem)] leading-tight md:mt-16">{step.title}</h3>
              <p className="mt-4 text-[0.95rem] leading-[1.8] text-ash">{step.text}</p>
            </Reveal>
          </li>
        ))}
      </ol>
    </section>
  );
}
