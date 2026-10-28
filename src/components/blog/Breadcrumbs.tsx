import Link from "next/link";

type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.65rem] uppercase tracking-[0.24em] text-ash">
        {items.map((item, i) => (
          <li key={i} className="flex min-w-0 items-center gap-3">
            {i > 0 ? (
              <span aria-hidden="true" className="text-blood">
                /
              </span>
            ) : null}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-bone">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="max-w-[60vw] truncate text-bone-dim">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
