import type { Dictionary } from "@/content/i18n";
import { Reveal, SectionLabel, SplitWords } from "./ui/motion";

/** Native <details> accordion: answers are server-rendered and readable without JavaScript. */
export function Faq({ dict, index = "07" }: { dict: Dictionary["faq"]; index?: string }) {
  return (
    <section id="faq" className="relative bg-ink-2 px-(--gutter) py-28 md:py-40">
      <div className="grid gap-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-32">
            <SectionLabel as="h2" index={index} label={dict.label} />
            <SplitWords
              as="p"
              text={dict.title}
              className="mt-8 block max-w-[10ch] font-display text-[clamp(2.8rem,5vw,5rem)] font-light leading-[0.98]"
            />
          </div>
        </div>

        <ul className="md:col-span-8 md:col-start-5">
          {dict.items.map((item, i) => (
            <Reveal as="li" key={item.q} delay={0.05 * i} className="border-b border-line first:border-t">
              <details open={i < 2} className="faq-details group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 md:py-9 [&::-webkit-details-marker]:hidden">
                  <h3 className="font-display text-[clamp(1.4rem,2.3vw,2.1rem)] leading-tight text-bone-dim transition-colors duration-500 group-open:text-bone group-hover:text-bone">
                    {item.q}
                  </h3>
                  <span
                    aria-hidden="true"
                    className="relative grid size-11 shrink-0 place-items-center rounded-full border border-bone/20 transition-colors duration-500 group-open:border-blood group-open:bg-blood group-hover:border-bone/50"
                  >
                    <span className="absolute h-px w-3.5 bg-bone" />
                    <span className="absolute h-3.5 w-px bg-bone transition-transform duration-500 ease-out-expo group-open:rotate-90 group-open:scale-y-0" />
                  </span>
                </summary>
                <p className="max-w-2xl pb-9 pr-14 text-[0.98rem] leading-[1.85] text-ash">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
