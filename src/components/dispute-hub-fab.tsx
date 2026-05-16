import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { LayoutGrid, X } from "lucide-react";
import { DisputeHubContent } from "@/components/dispute-hub";

/**
 * Persistent floating action button that opens the Dispute Hub menu.
 * Mobile/tablet only (hidden on lg+, where the header popover is enough).
 */
export function DisputeHubFab() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div>
      <AnimatePresence>
        {open && (
          <>
            <motion.button
              key="backdrop"
              type="button"
              aria-label="Close Dispute Hub"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm"
            />
            <motion.div
              key="sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Dispute Hub"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom,0px)+5.25rem)] z-50 max-h-[75vh] overflow-y-auto rounded-2xl border-2 border-border bg-card shadow-2xl"
            >
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-gold-deep)]">
                  Dispute Hub
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border text-foreground/70 hover:bg-muted"
                >
                  <X className="size-4" />
                </button>
              </div>
              <DisputeHubContent onNavigate={() => setOpen(false)} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? "Close Dispute Hub" : "Open Dispute Hub"}
        whileTap={reduce ? undefined : { scale: 0.94 }}
        className="fixed left-4 z-50 inline-flex size-14 items-center justify-center rounded-full border-2 border-[color:var(--brand-gold)] text-[color:var(--brand-cream)] shadow-2xl transition-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        style={{
          bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)",
          background: "var(--brand-navy-deep, #1a1f3a)",
        }}
      >
        {open ? (
          <X className="size-5" aria-hidden />
        ) : (
          <LayoutGrid className="size-5" aria-hidden />
        )}
        <span className="sr-only">Quick access menu</span>
      </motion.button>
    </div>
  );
}
