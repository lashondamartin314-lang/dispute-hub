import { useEffect, useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  X,
  Home,
  Compass,
  ScrollText,
  Library,
  ClipboardList,
  ScanSearch,
  Sparkles,
  Award,
  MessageCircleQuestion,
  ArrowUpRight,
  Folder,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { PHASES } from "@/data/phases";
import { PINNED_RESOURCES } from "@/data/resources";

// Note: no "Cover" entry — the Home icon in the drawer header already returns
// to / on tap, so a duplicate row would be redundant.
const NAV_PRIMARY = [
  { to: "/playbook/foundation", label: "Foundation", icon: Compass },
  { to: "/playbook/strategy", label: "Strategy overview", icon: ScrollText },
  { to: "/letters", label: "Letter library", icon: Library },
] as const;

const NAV_COMPANION = [
  { to: "/tracker", label: "Dispute tracker", icon: ClipboardList },
  { to: "/decoder", label: "Response decoder", icon: ScanSearch },
  { to: "/resources", label: "Resources", icon: Sparkles },
  { to: "/progress", label: "Your progress", icon: Award },
  { to: "/ask", label: "Ask Shonda", icon: MessageCircleQuestion },
] as const;

export function MobileNavDrawer() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Close on Escape, lock body scroll, trap Tab focus inside the drawer,
  // restore focus to the trigger on close.
  useEffect(() => {
    if (!isMobile || !openMobile) return;
    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const getFocusable = (): HTMLElement[] => {
      const root = panelRef.current;
      if (!root) return [];
      return Array.from(
        root.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("aria-hidden") && el.offsetParent !== null);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpenMobile(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = getFocusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && (active === first || !panelRef.current?.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus to the close button on open (after animation frame).
    const raf = requestAnimationFrame(() => closeBtnRef.current?.focus());

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      cancelAnimationFrame(raf);
      // Restore focus to whatever was focused before the drawer opened.
      lastFocusedRef.current?.focus?.();
    };
  }, [isMobile, openMobile, setOpenMobile]);

  if (!isMobile) return null;

  const isActive = (p: string) =>
    p === "/" ? pathname === "/" : pathname === p || pathname.startsWith(p + "/");

  const close = () => setOpenMobile(false);

  return (
    <AnimatePresence>
      {openMobile && (
        <motion.div
          className="fixed inset-0 z-[80] md:hidden"
          initial="closed"
          animate="open"
          exit="closed"
        >
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close menu"
            tabIndex={-1}
            className="absolute inset-0 bg-black/55 backdrop-blur-[2px]"
            onClick={close}
            variants={{ closed: { opacity: 0 }, open: { opacity: 1 } }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          />

          {/* Drawer panel */}
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="mobile-nav-title"
            className="absolute inset-y-0 left-0 flex h-full w-[86%] max-w-[360px] flex-col overflow-x-hidden bg-sidebar text-sidebar-foreground shadow-2xl"
            variants={{
              closed: { x: reduce ? 0 : "-100%", opacity: reduce ? 0 : 1 },
              open: { x: 0, opacity: 1 },
            }}
            transition={
              reduce
                ? { duration: 0.15 }
                : { type: "spring", stiffness: 380, damping: 38, mass: 0.9 }
            }
            drag={reduce ? false : "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0.25, right: 0 }}
            dragMomentum={false}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80 || info.velocity.x < -350) close();
            }}
          >
            {/* Drag handle hint */}
            <div aria-hidden className="absolute right-0 top-1/2 h-16 w-1 -translate-y-1/2 translate-x-1 rounded-full bg-sidebar-border/60" />

            <header className="flex items-center justify-between border-b border-sidebar-border/60 px-4 py-3">
              <Link
                to="/"
                onClick={close}
                aria-label="Home"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-sidebar-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-gold)]"
              >
                <Home className="size-5" aria-hidden />
              </Link>
              <p id="mobile-nav-title" className="font-mono text-[10px] uppercase tracking-[0.2em] text-sidebar-foreground/70">
                The Playbook
              </p>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={close}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-md hover:bg-sidebar-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-gold)]"
              >
                <X className="size-5" aria-hidden />
              </button>
            </header>

            <nav className="flex-1 overflow-y-auto overscroll-contain px-3 py-4">
              <DrawerGroup label="Playbook">
                {NAV_PRIMARY.map((it, i) => (
                  <DrawerLink
                    key={it.to}
                    to={it.to}
                    label={it.label}
                    Icon={it.icon}
                    active={isActive(it.to)}
                    onClick={close}
                    delay={i}
                    reduce={!!reduce}
                  />
                ))}
              </DrawerGroup>

              <DrawerGroup label="Phases">
                {PHASES.map((p, i) => {
                  const active = pathname.startsWith(`/playbook/phase/${p.id}`);
                  return (
                    <motion.div
                      key={p.id}
                      initial={reduce ? false : { opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduce ? 0 : 0.05 + i * 0.025, duration: 0.2 }}
                    >
                      <Link
                        to="/playbook/phase/$id"
                        params={{ id: p.id }}
                        onClick={close}
                        className={`flex min-h-[52px] items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors ${
                          active
                            ? "bg-[color:var(--brand-gold)]/20 font-semibold"
                            : "hover:bg-sidebar-accent/30 active:bg-sidebar-accent/50"
                        }`}
                      >
                        <span
                          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold"
                          style={{
                            background: `color-mix(in oklab, var(${p.colorVar}) 80%, transparent)`,
                            color: "white",
                          }}
                        >
                          P{p.number}
                        </span>
                        <span className="truncate">{p.name}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </DrawerGroup>

              <DrawerGroup label="Companion tools">
                {NAV_COMPANION.map((it, i) => (
                  <DrawerLink
                    key={it.to}
                    to={it.to}
                    label={it.label}
                    Icon={it.icon}
                    active={isActive(it.to)}
                    onClick={close}
                    delay={i}
                    reduce={!!reduce}
                  />
                ))}
              </DrawerGroup>

              <DrawerGroup label="External resources">
                {PINNED_RESOURCES.map((r) => (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={close}
                    title={`${r.label} — opens in a new tab`}
                    aria-label={`${r.label} (opens in a new tab)`}
                    className="flex min-h-[52px] items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] text-[#c9e6ff] hover:bg-sidebar-accent/30 active:bg-sidebar-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-gold)]"
                  >
                    <Folder className="size-5 shrink-0 text-[color:var(--brand-gold)]" aria-hidden />
                    <span className="flex-1 truncate underline underline-offset-2 decoration-[#c9e6ff]/40">
                      {r.label}
                    </span>
                    <ArrowUpRight className="size-4 shrink-0 opacity-70" aria-hidden />
                  </a>
                ))}
              </DrawerGroup>
            </nav>

            <footer className="border-t border-sidebar-border/60 px-4 py-3 text-center text-[11px] text-sidebar-foreground/55">
              Swipe left or tap outside to close.
            </footer>
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DrawerGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <p className="px-3 pb-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-sidebar-foreground/60">
        {label}
      </p>
      <div className="space-y-0.5">{children}</div>
    </section>
  );
}

function DrawerLink({
  to,
  label,
  Icon,
  active,
  onClick,
  delay,
  reduce,
}: {
  to: string;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
  delay: number;
  reduce: boolean;
}) {
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: reduce ? 0 : 0.05 + delay * 0.025, duration: 0.2 }}
    >
      <Link
        to={to}
        onClick={onClick}
        className={`flex min-h-[52px] items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition-colors ${
          active
            ? "bg-[color:var(--brand-gold)]/20 font-semibold"
            : "hover:bg-sidebar-accent/30 active:bg-sidebar-accent/50"
        }`}
      >
        <Icon className="size-5 shrink-0" />
        <span className="truncate">{label}</span>
      </Link>
    </motion.div>
  );
}
