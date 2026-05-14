import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Resource } from "@/data/resources";

interface ResourceTileProps {
  resource: Resource;
  className?: string;
}

const CATEGORY_LABEL: Record<Resource["category"], string> = {
  report: "Credit reports",
  monitoring: "Monitoring",
  complaint: "Complaint portal",
  kit: "Templates",
  academy: "Academy",
};

/** Pronounced white card with thicker border and elevation. */
export function ResourceTile({ resource, className }: ResourceTileProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex flex-col justify-between gap-4 rounded-xl border-2 border-border bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand-gold)] hover:shadow-elegant",
        className,
      )}
    >
      <div className="space-y-1.5">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-gold-deep)]">
          {CATEGORY_LABEL[resource.category]}
        </p>
        <h3 className="font-display text-xl leading-tight">{resource.label}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-[#1a0dab] underline underline-offset-4 decoration-[#1a0dab]/40 transition-colors group-hover:decoration-[#1a0dab]">
        Open
        <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        <span className="sr-only"> (opens in a new tab, leaves the Playbook)</span>
      </div>
    </a>
  );
}
