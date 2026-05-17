import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  ChevronsDown,
  ChevronsUp,
  ChevronsLeft,
  ChevronsRight,
  Keyboard,
  List,
  X,
} from "lucide-react";
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
 *
 * Keyboard:
 *   ↑/↓ or j/k         move focus between items (with roving tabindex)
 *   Home / End         jump to first / last item
 *   Enter / Space      jump to the focused section
 *   [   ]              jump to previous / next section (works anywhere on the page)
 *   g                  jump to the top section
 *   G                  jump to the last section
 *   Esc                close the mobile drawer
 */
export function SectionToc({
  items,
  className,
  label = "On this page",
  accentColor = "var(--brand-magenta-deep)",
}: SectionTocProps) {
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const fmReduce = useReducedMotion();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [progress, setProgress] = useState(0);
  // Unique per-instance prefix so the desktop rail and the drawer rail each
  // get their own Framer Motion layout group (otherwise the bar tries to
  // animate between two DOM trees).
  const layoutScope = useId();

  // Stable storage key per page so the last-focused section persists per route.
  const storageKey = useMemo(() => {
    if (typeof window === "undefined") return "toc:last:default";
    return `toc:last:${window.location.pathname}`;
  }, []);
  const collapseKey = useMemo(() => {
    if (typeof window === "undefined") return "toc:collapsed:default";
    return `toc:collapsed:${window.location.pathname}`;
  }, []);

  // Restore collapsed state per route.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = window.localStorage.getItem(collapseKey);
      if (saved === "1") setCollapsed(true);
    } catch { /* ignore */ }
  }, [collapseKey]);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((v) => {
      const next = !v;
      try { window.localStorage.setItem(collapseKey, next ? "1" : "0"); } catch { /* ignore */ }
      return next;
    });
  }, [collapseKey]);

  // Detect prefers-reduced-motion (live).
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener?.("change", apply);
    return () => mq.removeEventListener?.("change", apply);
  }, []);

  // Two refs because the same <ul> is rendered in both the desktop sidebar
  // and the mobile drawer. We track the focused item index per-instance via
  // a roving tabindex (only one anchor in each instance is tabbable at a time).
  const desktopListRef = useRef<HTMLUListElement | null>(null);
  const drawerListRef = useRef<HTMLUListElement | null>(null);

  // Track focus index for roving tabindex within whichever list is active.
  const [focusIdx, setFocusIdx] = useState<number>(0);

  // Restore the last-focused section on mount and jump to it.
  const restoredRef = useRef(false);
  useEffect(() => {
    if (restoredRef.current || items.length === 0 || typeof window === "undefined") return;
    restoredRef.current = true;
    try {
      const saved = window.sessionStorage.getItem(storageKey);
      if (!saved || !items.some((i) => i.id === saved)) return;
      // Don't override an explicit hash in the URL.
      if (window.location.hash && window.location.hash.length > 1) return;
      // Defer so layout settles before scrolling.
      requestAnimationFrame(() => {
        const target = document.getElementById(saved);
        if (!target) return;
        target.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "start",
        });
        setActiveId(saved);
      });
    } catch {
      /* ignore storage errors */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, storageKey]);

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

  // Persist the last-active section so we can restore it on return.
  useEffect(() => {
    if (typeof window === "undefined" || !activeId) return;
    try {
      window.sessionStorage.setItem(storageKey, activeId);
    } catch {
      /* ignore */
    }
  }, [activeId, storageKey]);

  // Scroll-based progress through the playbook section (0 → 1).
  useEffect(() => {
    if (typeof window === "undefined") return;
    let raf = 0;
    const compute = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      setProgress(Math.min(1, Math.max(0, ratio)));
    };
    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => {
        raf = 0;
        compute();
      });
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", compute);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const activeIdx = useMemo(
    () => Math.max(0, items.findIndex((i) => i.id === activeId)),
    [items, activeId],
  );

  // Keep the roving focus aligned with the active section by default,
  // unless the user has interactively focused a different item.
  useEffect(() => {
    setFocusIdx(activeIdx);
  }, [activeIdx]);

  const jumpTo = useCallback(
    (id: string, opts?: { focusHeading?: boolean }) => {
      const target = document.getElementById(id);
      if (!target) return;
      target.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
      history.replaceState(null, "", `#${id}`);
      try {
        window.sessionStorage.setItem(storageKey, id);
      } catch {
        /* ignore */
      }
      // Move keyboard focus to the section heading when requested
      // so screen-reader / keyboard users land in the new context.
      if (opts?.focusHeading) {
        const heading =
          target.querySelector<HTMLElement>("h1, h2, h3, [data-toc-focus]") ?? target;
        const prevTabIndex = heading.getAttribute("tabindex");
        if (prevTabIndex === null) heading.setAttribute("tabindex", "-1");
        heading.focus({ preventScroll: true });
        // Restore tabindex on next blur so we don't pollute the DOM.
        const cleanup = () => {
          if (prevTabIndex === null) heading.removeAttribute("tabindex");
          heading.removeEventListener("blur", cleanup);
        };
        heading.addEventListener("blur", cleanup);
      }
    },
    [reducedMotion, storageKey],
  );

  const jumpByDelta = useCallback(
    (delta: number) => {
      if (items.length === 0) return;
      const next = Math.min(items.length - 1, Math.max(0, activeIdx + delta));
      jumpTo(items[next].id, { focusHeading: true });
    },
    [items, activeIdx, jumpTo],
  );

  // Global keyboard shortcuts: [ prev, ] next, g top, G bottom.
  // Suppressed while the user is typing in any field/contenteditable.
  useEffect(() => {
    if (typeof window === "undefined" || items.length === 0) return;
    const isTypingTarget = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      if (el.isContentEditable) return true;
      return false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;
      if (e.key === "[") {
        e.preventDefault();
        jumpByDelta(-1);
      } else if (e.key === "]") {
        e.preventDefault();
        jumpByDelta(1);
      } else if (e.key === "g" && !e.shiftKey) {
        e.preventDefault();
        jumpTo(items[0].id, { focusHeading: true });
      } else if (e.key === "G" || (e.key === "g" && e.shiftKey)) {
        e.preventDefault();
        jumpTo(items[items.length - 1].id, { focusHeading: true });
      } else if (e.key === "?" && e.shiftKey) {
        e.preventDefault();
        setShowShortcuts((v) => !v);
      } else if (e.key === "Escape") {
        if (drawerOpen) setDrawerOpen(false);
        if (showShortcuts) setShowShortcuts(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items, jumpByDelta, jumpTo, drawerOpen, showShortcuts]);

  // Focus the anchor at focusIdx within the given list ref.
  const focusAnchor = (
    listRef: React.RefObject<HTMLUListElement | null>,
    idx: number,
  ) => {
    const root = listRef.current;
    if (!root) return;
    const anchors = root.querySelectorAll<HTMLAnchorElement>("a[data-toc-item]");
    anchors[idx]?.focus();
  };

  const handleListKeyDown = (
    e: React.KeyboardEvent<HTMLUListElement>,
    listRef: React.RefObject<HTMLUListElement | null>,
  ) => {
    if (items.length === 0) return;
    let next: number | null = null;
    switch (e.key) {
      case "ArrowDown":
      case "j":
        next = Math.min(items.length - 1, focusIdx + 1);
        break;
      case "ArrowUp":
      case "k":
        next = Math.max(0, focusIdx - 1);
        break;
      case "Home":
      case "PageUp":
        next = 0;
        break;
      case "End":
      case "PageDown":
        next = items.length - 1;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        jumpTo(items[focusIdx].id, { focusHeading: true });
        if (drawerOpen) setDrawerOpen(false);
        return;
      default:
        return;
    }
    if (next !== null) {
      e.preventDefault();
      setFocusIdx(next);
      focusAnchor(listRef, next);
    }
  };

  const SkipBar = (
    <div
      role="group"
      aria-label="Quick jump"
      className="mb-3 grid grid-cols-4 gap-1 rounded-xl border border-border/70 bg-card/60 p-1"
    >
      <SkipBtn
        onClick={() => jumpTo(items[0].id, { focusHeading: true })}
        disabled={activeIdx <= 0}
        title="Jump to top (g)"
        accentColor={accentColor}
      >
        <ChevronsUp className="size-3.5" aria-hidden />
        <span className="sr-only">Top</span>
      </SkipBtn>
      <SkipBtn
        onClick={() => jumpByDelta(-1)}
        disabled={activeIdx <= 0}
        title="Previous section ([)"
        accentColor={accentColor}
      >
        <ArrowUp className="size-3.5" aria-hidden />
        <span className="sr-only">Previous section</span>
      </SkipBtn>
      <SkipBtn
        onClick={() => jumpByDelta(1)}
        disabled={activeIdx >= items.length - 1}
        title="Next section (])"
        accentColor={accentColor}
      >
        <ArrowDown className="size-3.5" aria-hidden />
        <span className="sr-only">Next section</span>
      </SkipBtn>
      <SkipBtn
        onClick={() => jumpTo(items[items.length - 1].id, { focusHeading: true })}
        disabled={activeIdx >= items.length - 1}
        title="Jump to bottom (Shift+G)"
        accentColor={accentColor}
      >
        <ChevronsDown className="size-3.5" aria-hidden />
        <span className="sr-only">Bottom</span>
      </SkipBtn>
    </div>
  );

  const renderList = (
    listRef: React.RefObject<HTMLUListElement | null>,
    instance: "desktop" | "drawer",
  ) => (
    <ul
      ref={listRef}
      role="menu"
      aria-label={label}
      onKeyDown={(e) => handleListKeyDown(e, listRef)}
      className="relative space-y-1 border-l-2 pl-4"
      style={{ borderColor: `color-mix(in oklab, ${accentColor} 14%, transparent)` }}
    >
      {items.map((item, i) => {
        const active = activeId === item.id;
        const tabbable = i === focusIdx;
        return (
          <li key={item.id} role="none" className="relative">
            {active && (
              <motion.span
                layoutId={`toc-rail-${layoutScope}-${instance}`}
                aria-hidden
                className="absolute -left-[10px] top-1/2 h-7 w-[4px] -translate-y-1/2 rounded-full"
                style={{
                  background: accentColor,
                  boxShadow: `0 0 0 2px color-mix(in oklab, ${accentColor} 18%, transparent)`,
                }}
                transition={
                  reducedMotion || fmReduce
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 500, damping: 38, mass: 0.8 }
                }
              />
            )}
            <a
              data-toc-item
              role="menuitem"
              tabIndex={tabbable ? 0 : -1}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                jumpTo(item.id, { focusHeading: true });
                setFocusIdx(i);
                setDrawerOpen(false);
              }}
              onFocus={() => setFocusIdx(i)}
              aria-current={active ? "location" : undefined}
              className={cn(
                "group flex min-h-[44px] items-center gap-3 rounded-lg py-2.5 pr-2 text-sm outline-none",
                !reducedMotion && "transition-all duration-300",
                "focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                active
                  ? cn(
                      "pl-3 font-semibold text-[color:var(--brand-ink)]",
                      !reducedMotion && "animate-toc-pill",
                    )
                  : cn(
                      "pl-2 text-foreground/60 hover:text-foreground",
                      !reducedMotion && "hover:translate-x-0.5",
                    ),
              )}
              style={
                {
                  ...(active
                    ? { background: `color-mix(in oklab, ${accentColor} 10%, transparent)` }
                    : {}),
                  "--tw-ring-color": accentColor,
                } as React.CSSProperties
              }
            >
              <span
                className={cn(
                  "font-mono text-[10px] tabular-nums",
                  !reducedMotion && "transition-colors",
                  active ? "text-[color:var(--brand-ink)]/70" : "text-muted-foreground/60",
                )}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1">{item.label}</span>
              {active && (
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    !reducedMotion && "animate-toc-dot",
                  )}
                  style={{ background: accentColor }}
                />
              )}
            </a>
          </li>
        );
      })}
    </ul>
  );

  const ProgressBar = (
    <div
      className="mb-3"
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress * 100)}
    >
      <div className="mb-1 flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        <span>Progress</span>
        <span style={{ color: accentColor }}>{Math.round(progress * 100)}%</span>
      </div>
      <div
        className="h-1 overflow-hidden rounded-full"
        style={{ background: `color-mix(in oklab, ${accentColor} 12%, transparent)` }}
      >
        <div
          className={cn("h-full rounded-full", !reducedMotion && "transition-[width] duration-200 ease-out")}
          style={{ width: `${progress * 100}%`, background: accentColor }}
        />
      </div>
    </div>
  );

  const activeLabel = items[activeIdx]?.label ?? "";

  return (
    <>
      {/* SR-only live region: announces the current section as the user scrolls
          or jumps with the keyboard. polite so it doesn't interrupt typing. */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {activeLabel ? `Current section: ${activeLabel}, ${activeIdx + 1} of ${items.length}` : ""}
      </div>
      {/* Desktop sticky sidebar */}
      <nav
        aria-label={label}
        className={cn("sticky top-24 hidden xl:block", className)}
      >
        <div className="mb-3 flex items-center justify-between">
          <p className="eyebrow" style={{ color: accentColor }}>{label}</p>
          <button
            type="button"
            onClick={() => setShowShortcuts((v) => !v)}
            aria-expanded={showShortcuts}
            aria-controls="toc-shortcuts"
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground"
            title="Keyboard shortcuts (Shift+?)"
          >
            <Keyboard className="size-3" aria-hidden /> keys
          </button>
        </div>
        {ProgressBar}
        {SkipBar}
        {showShortcuts && <ShortcutsPanel id="toc-shortcuts" />}
        {renderList(desktopListRef, "desktop")}
        <p className="mt-3 text-[10px] leading-snug text-muted-foreground/80">
          Tip: press <Kbd>[</Kbd> / <Kbd>]</Kbd> anywhere on the page to move
          between sections.
        </p>
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
            <DrawerDescription>
              Jump to any section. Use <Kbd>↑</Kbd> <Kbd>↓</Kbd> to move,{" "}
              <Kbd>Enter</Kbd> to go, <Kbd>Esc</Kbd> to close.
            </DrawerDescription>
          </DrawerHeader>
          {ProgressBar}
          {SkipBar}
          {renderList(drawerListRef, "drawer")}
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

function SkipBtn({
  children,
  onClick,
  disabled,
  title,
  accentColor,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  accentColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={cn(
        "inline-flex items-center justify-center rounded-lg py-1.5 text-xs font-semibold transition-all",
        "hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-background",
      )}
      style={{
        color: accentColor,
        background: `color-mix(in oklab, ${accentColor} 8%, transparent)`,
        // @ts-expect-error CSS var override for ring color
        "--tw-ring-color": accentColor,
      }}
    >
      {children}
    </button>
  );
}

function ShortcutsPanel({ id }: { id: string }) {
  return (
    <div
      id={id}
      className="mb-3 rounded-xl border border-border/70 bg-card/70 p-3 text-xs"
    >
      <p className="eyebrow mb-2 text-[9px]">Keyboard shortcuts</p>
      <ul className="grid grid-cols-1 gap-1.5">
        <Row k={["↑", "↓"]} v="Move between items" />
        <Row k={["Enter"]} v="Jump to focused section" />
        <Row k={["[", "]"]} v="Previous / next section" />
        <Row k={["g"]} v="Jump to top" />
        <Row k={["⇧", "G"]} v="Jump to bottom" />
        <Row k={["Esc"]} v="Close drawer" />
      </ul>
    </div>
  );
}

function Row({ k, v }: { k: string[]; v: string }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="text-foreground/70">{v}</span>
      <span className="flex items-center gap-1">
        {k.map((key) => (
          <Kbd key={key}>{key}</Kbd>
        ))}
      </span>
    </li>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex min-w-[1.5em] items-center justify-center rounded-md border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground shadow-sm">
      {children}
    </kbd>
  );
}
