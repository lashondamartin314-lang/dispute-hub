import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MobileCollapsibleProps {
  id?: string;
  /** Eyebrow above the title in the collapsed header. */
  eyebrow?: string;
  /** Title shown when collapsed (and as the toggle on mobile). */
  title: React.ReactNode;
  /** Accent color for the chevron + border. */
  accentColor?: string;
  /** Children render flat on desktop; collapsible on mobile. */
  children: React.ReactNode;
  className?: string;
  /** Default state on mobile. Defaults to closed. */
  defaultOpen?: boolean;
}

/**
 * Collapsible-on-mobile, always-open-on-desktop section wrapper.
 * Used to keep long Playbook chapters tidy on phones without changing
 * the desktop reading experience.
 */
export function MobileCollapsible({
  id,
  eyebrow,
  title,
  accentColor = "var(--brand-gold-deep)",
  children,
  className,
  defaultOpen = false,
}: MobileCollapsibleProps) {
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(defaultOpen);

  // Keep mobile state in sync if the user rotates / resizes.
  useEffect(() => {
    if (!isMobile) setOpen(true);
    else setOpen(defaultOpen);
  }, [isMobile, defaultOpen]);

  if (!isMobile) {
    return (
      <section id={id} className={cn("scroll-mt-24", className)}>
        {children}
      </section>
    );
  }

  return (
    <section id={id} className={cn("scroll-mt-24", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group flex w-full items-center justify-between gap-4 rounded-2xl border-2 bg-card px-4 py-3 text-left shadow-card"
        style={{ borderColor: `color-mix(in oklab, ${accentColor} 30%, transparent)` }}
      >
        <div className="min-w-0">
          {eyebrow && (
            <p
              className="font-mono text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: accentColor }}
            >
              {eyebrow}
            </p>
          )}
          <h2 className="font-display text-lg font-bold leading-tight text-[color:var(--brand-ink)]">
            {title}
          </h2>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border"
          style={{ borderColor: `color-mix(in oklab, ${accentColor} 40%, transparent)` }}
        >
          <ChevronDown className="size-4" style={{ color: accentColor }} />
        </motion.span>
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
            <div className="pt-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
