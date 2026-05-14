import { useEffect, useState } from "react";
import { List, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
  /** Phase accent CSS color (e.g. `var(--phase-2-deep)`). Defaults to brand magenta. */
  accentColor?: string;
}

/**
 * Section table-of-contents.
 * - On `xl`+ screens: renders as a sticky sidebar.
 * - Below `xl`: renders a floating button that opens a bottom drawer with the same outline.
 */
export function SectionToc({
  items,
  className,
  label = "On this page",
  accentColor = "var(--brand-magenta-deep)",
}: SectionTocProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  const jumpTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    history.replaceState(null, "", `#${id}`);
  };

  const activeIdx = Math.max(0, items.findIndex((i) => i.id === activeId));

  const list = (
    <ul
      className="relative space-y-1 border-l-2 pl-4"
      style={{ borderColor: `color-mix(in oklab, ${accentColor} 14%, transparent)` }}
    >
      {items.map((item, i) => {
        const active = activeId === item.id;
        return (
          <li key={item.id} className="relative">
            {active && (
              <span
                aria-hidden
                className="absolute -left-[10px] top-1/2 h-7 w-[4px] -translate-y-1/2 rounded-full transition-all"
                style={{ background: accentColor }}
              />
            )}
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                jumpTo(item.id);
                setDrawerOpen(false);
              }}
              aria-current={active ? "location" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-lg py-2 pr-2 text-sm transition-all",
                active
                  ? "pl-3 font-semibold text-[color:var(--brand-ink)]"
                  : "pl-2 text-foreground/60 hover:translate-x-0.5 hover:text-foreground",
              )}
              style={
                active
                  ? { background: `color-mix(in oklab, ${accentColor} 10%, transparent)` }
                  : undefined
              }
            >
              <span
                className={cn(
                  "font-mono text-[10px] tabular-nums",
                  active ? "text-[color:var(--brand-ink)]/70" : "text-muted-foreground/60",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">{item.label}</span>
            </a>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Desktop sticky sidebar */}
      <nav
        aria-label={label}
        className={cn("sticky top-24 hidden xl:block", className)}
      >
        <p className="eyebrow mb-4" style={{ color: accentColor }}>{label}</p>
        {list}
      </nav>

      {/* Mobile / tablet drawer trigger */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerTrigger asChild>
          <button
            type="button"
            aria-label={`Open ${label}`}
            className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-[color:var(--brand-cream)] shadow-elegant transition-transform hover:-translate-y-0.5 active:translate-y-0 xl:hidden"
            style={{ background: accentColor }}
          >
            <List className="size-4" aria-hidden />
            <span>
              {items[activeIdx]?.label ?? label}
              <span className="ml-2 opacity-70">{activeIdx + 1}/{items.length}</span>
            </span>
          </button>
        </DrawerTrigger>
        <DrawerContent className="px-5 pb-8">
          <DrawerHeader className="px-0 text-left">
            <DrawerTitle className="font-display text-xl">{label}</DrawerTitle>
            <DrawerDescription>Jump to any section in this letter.</DrawerDescription>
          </DrawerHeader>
          {list}
          <DrawerClose asChild>
            <button
              type="button"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold"
            >
              <X className="size-4" /> Close
            </button>
          </DrawerClose>
        </DrawerContent>
      </Drawer>
    </>
  );
}
