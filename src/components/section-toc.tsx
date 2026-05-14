import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface TocItem {
  id: string;
  label: string;
}

interface SectionTocProps {
  items: TocItem[];
  className?: string;
  /** Eyebrow label above the list */
  label?: string;
}

/**
 * Sticky table-of-contents with IntersectionObserver-driven active state.
 * Hidden on screens narrower than `xl` so it never crowds the editorial column.
 */
export function SectionToc({ items, className, label = "On this page" }: SectionTocProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    if (typeof window === "undefined" || items.length === 0) return;
    const elements = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5, 1] },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav
      aria-label={label}
      className={cn(
        "sticky top-24 hidden xl:block",
        className,
      )}
    >
      <p className="eyebrow mb-4 text-[color:var(--brand-magenta-deep)]">{label}</p>
      <ul className="relative space-y-1 border-l border-[color:color-mix(in_oklab,var(--brand-ink)_12%,transparent)] pl-4">
        {items.map((item) => {
          const active = activeId === item.id;
          return (
            <li key={item.id} className="relative">
              {active && (
                <span
                  aria-hidden
                  className="absolute -left-[17px] top-1/2 h-6 w-[2px] -translate-y-1/2 rounded-full bg-[color:var(--brand-magenta)]"
                />
              )}
              <a
                href={`#${item.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  history.replaceState(null, "", `#${item.id}`);
                }}
                className={cn(
                  "block rounded-md py-1.5 text-sm transition-colors",
                  active
                    ? "font-semibold text-[color:var(--brand-navy-deep)]"
                    : "text-foreground/55 hover:text-[color:var(--brand-magenta-deep)]",
                )}
              >
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
