import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useReducedMotion } from "framer-motion";
import {
  Compass,
  ScrollText,
  Library,
  ClipboardList,
  Folder,
  ArrowUpRight,
  LayoutGrid,
  ChevronDown,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PHASES } from "@/data/phases";
import { PINNED_RESOURCES } from "@/data/resources";

const JUMPS = [
  { to: "/playbook/foundation", label: "Foundation", icon: Compass },
  { to: "/playbook/strategy", label: "Strategy overview", icon: ScrollText },
  { to: "/letters", label: "Letter library", icon: Library },
  { to: "/tracker", label: "Dispute tracker", icon: ClipboardList },
] as const;

export function DisputeHub() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex h-11 sm:h-9 items-center gap-1.5 rounded-full border border-[color:var(--header-border)] px-3 text-xs font-semibold text-[color:var(--header-fg)] transition-colors hover:bg-[color:var(--header-border)]/40"
          aria-label="Open Dispute Hub"
        >
          <LayoutGrid className="size-3.5" aria-hidden />
          <span className="hidden sm:inline">Dispute Hub</span>
          <ChevronDown
            className={`size-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(92vw,360px)] overflow-hidden p-0"
        asChild
      >
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        >
          <DisputeHubContent onNavigate={() => setOpen(false)} />
        </motion.div>
      </PopoverContent>
    </Popover>
  );
}

/** Reusable menu body — used by the header popover and the mobile FAB. */
export function DisputeHubContent({ onNavigate }: { onNavigate?: () => void }) {
  const reduce = useReducedMotion();
  const close = () => onNavigate?.();

  const stagger = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: reduce ? 0 : 0.025, delayChildren: reduce ? 0 : 0.04 },
    },
  };
  const item = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
  };

  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="p-3">
      <Section title="Jump to">
        <div className="grid grid-cols-2 gap-1.5">
          {JUMPS.map((j) => (
            <motion.div key={j.to} variants={item}>
              <Link
                to={j.to}
                onClick={close}
                className="flex h-full min-h-[52px] flex-col gap-1 rounded-lg border border-border/70 bg-card p-2.5 text-[12px] font-semibold text-foreground transition-colors hover:border-[color:var(--brand-gold-deep)]/40 hover:bg-[color:var(--brand-gold)]/10"
              >
                <j.icon className="size-4 text-[color:var(--brand-gold-deep)]" />
                <span className="leading-tight">{j.label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section title="Phases">
        <div className="grid grid-cols-3 gap-1.5">
          {PHASES.map((p) => (
            <motion.div key={p.id} variants={item}>
              <Link
                to="/playbook/phase/$id"
                params={{ id: p.id }}
                onClick={close}
                className="flex h-full min-h-[58px] flex-col items-start justify-between rounded-lg p-2 text-[11px] font-semibold text-foreground transition-transform hover:-translate-y-0.5"
                style={{
                  background: `color-mix(in oklab, var(${p.colorVar}) 14%, var(--card))`,
                  borderLeft: `3px solid var(${p.colorVar}-deep)`,
                }}
              >
                <span
                  className="font-mono text-[10px] tracking-wider"
                  style={{ color: `var(${p.colorVar}-deep)` }}
                >
                  P{p.number}
                </span>
                <span className="leading-tight">{p.name}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section title="Kit resources" subtitle="open in new tab">
        <div className="flex flex-col gap-0.5">
          {PINNED_RESOURCES.map((r) => (
            <motion.a
              key={r.id}
              variants={item}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={close}
              className="flex min-h-[40px] items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-foreground/90 transition-colors hover:bg-[color:var(--brand-gold)]/10"
            >
              <Folder className="size-4 shrink-0 text-[color:var(--brand-gold-deep)]" />
              <span className="flex-1 truncate">{r.label}</span>
              <ArrowUpRight className="size-3.5 shrink-0 text-foreground/50" aria-hidden />
              <span className="sr-only"> (opens in a new tab, leaves the Playbook)</span>
            </motion.a>
          ))}
        </div>
      </Section>
    </motion.div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-3 last:mb-0">
      <div className="mb-1.5 flex items-baseline justify-between px-1">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-gold-deep)]">
          {title}
        </p>
        {subtitle && (
          <p className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </section>
  );
}
