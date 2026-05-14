import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface PhaseRevealProps {
  id?: string;
  eyebrow: string;
  title: React.ReactNode;
  count?: number;
  accentColor?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

/**
 * Click-to-reveal section for phase pages.
 * Header shows title + count badge + chevron; content animates open with a
 * spring height + opacity, and direct children stagger in.
 * Honors prefers-reduced-motion (instant toggle, no stagger).
 */
export function PhaseReveal({
  id,
  eyebrow,
  title,
  count,
  accentColor = "var(--brand-gold-deep)",
  defaultOpen = false,
  children,
}: PhaseRevealProps) {
  const [open, setOpen] = useState(defaultOpen);
  const reduce = useReducedMotion();

  return (
    <section id={id} className="scroll-mt-24">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 rounded-2xl border-2 bg-card px-5 py-4 text-left shadow-card transition-colors hover:bg-[color:var(--brand-gold)]/5 md:px-6 md:py-5"
        style={{
          borderColor: `color-mix(in oklab, ${accentColor} 35%, transparent)`,
        }}
      >
        <div className="min-w-0">
          <p
            className="font-mono text-[11px] font-bold uppercase tracking-[0.2em]"
            style={{ color: accentColor }}
          >
            {eyebrow}
          </p>
          <h2 className="font-display mt-1 text-2xl font-bold leading-tight md:text-3xl">
            {title}
          </h2>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {typeof count === "number" && (
            <span
              className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-full px-2 font-mono text-xs font-bold text-white"
              style={{ background: accentColor }}
            >
              {count}
            </span>
          )}
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
            className="inline-flex size-9 items-center justify-center rounded-full border"
            style={{ borderColor: `color-mix(in oklab, ${accentColor} 40%, transparent)` }}
          >
            <ChevronDown className="size-4" style={{ color: accentColor }} />
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={
              reduce
                ? { duration: 0.1 }
                : { type: "spring", stiffness: 220, damping: 28, mass: 0.9 }
            }
            className="overflow-hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: reduce ? 0 : 0.04, delayChildren: 0.05 },
                },
              }}
              className="pt-6"
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** Wrap any direct child of <PhaseReveal> to opt into the stagger animation. */
export function PhaseRevealItem({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.22 } },
      }}
    >
      {children}
    </motion.div>
  );
}
