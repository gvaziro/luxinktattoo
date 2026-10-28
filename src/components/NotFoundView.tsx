import type { Dictionary } from "@/content/i18n";

export function NotFoundView({ dict, home }: { dict: Dictionary["notFound"]; home: string }) {
  return (
    <main className="relative grid min-h-[100svh] place-items-center overflow-hidden px-(--gutter) text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_50%_at_50%_60%,rgba(200,22,29,0.16),transparent_70%)]"
      />
      <div className="relative">
        <p className="latin-display font-display text-[clamp(7rem,30vw,22rem)] font-light leading-[0.8] text-outline-bone">404</p>
        <h1 className="mt-8 font-display text-[clamp(2rem,4vw,3.4rem)] font-light">{dict.title}</h1>
        <p className="mt-4 text-ash">{dict.text}</p>
        <a
          href={home}
          className="mt-10 inline-flex h-12 items-center rounded-full bg-blood px-7 text-[0.7rem] uppercase tracking-[0.2em] text-bone transition-colors hover:bg-bone hover:text-ink"
        >
          {dict.back}
        </a>
      </div>
    </main>
  );
}
