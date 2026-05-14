import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DisputeRound, Resource } from "@/data/resources";
import { PrintChecklistButton } from "@/components/print-checklist-button";

interface ResourceTileProps {
  resource: Resource;
  className?: string;
  /** Currently-selected dispute round (for highlight emphasis). */
  activeRound?: DisputeRound | null;
}

const CATEGORY_LABEL: Record<Resource["category"], string> = {
  report: "Credit reports",
  monitoring: "Monitoring",
  complaint: "Complaint portal",
  kit: "Templates",
  academy: "Academy",
};

/** Pronounced white card with thicker border and elevation. */
export function ResourceTile({ resource, className, activeRound }: ResourceTileProps) {
  const isInActiveRound =
    activeRound != null && resource.rounds?.includes(activeRound);
  const isDimmed = activeRound != null && !isInActiveRound;

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-4 rounded-xl border-2 bg-card p-5 shadow-card transition-all",
        isInActiveRound
          ? "border-[color:var(--brand-gold-deep)] ring-2 ring-[color:var(--brand-gold)]/30"
          : "border-border",
        isDimmed && "opacity-50",
        className,
      )}
    >
      {isInActiveRound && (
        <span className="absolute -top-2.5 left-4 rounded-full bg-[color:var(--brand-gold-deep)] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-cream)]">
          Use this round
        </span>
      )}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-gold-deep)]">
            {CATEGORY_LABEL[resource.category]}
          </p>
          {resource.rounds && resource.rounds.length > 0 && (
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              Rounds {resource.rounds.join(", ")}
            </p>
          )}
        </div>
        <h3 className="font-display text-xl leading-tight">{resource.label}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
        {resource.usage && (
          <div className="mt-3 border-t border-border/60 pt-3">
            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-gold-deep)]">
              What to pull
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{resource.usage}</p>
          </div>
        )}
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#1a0dab] underline underline-offset-4 decoration-[#1a0dab]/40 transition-colors hover:decoration-[#1a0dab]"
        >
          Open
          <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          <span className="sr-only"> (opens in a new tab, leaves the Playbook)</span>
        </a>
        <PrintChecklistButton resource={resource} />
      </div>
    </div>
  );
}
