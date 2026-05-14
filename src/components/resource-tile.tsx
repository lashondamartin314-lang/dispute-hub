import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Resource } from "@/data/resources";

interface ResourceTileProps {
  resource: Resource;
  className?: string;
}

export function ResourceTile({ resource, className }: ResourceTileProps) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex flex-col justify-between gap-4 rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand-gold)] hover:shadow-elegant",
        className,
      )}
    >
      <div className="space-y-1.5">
        <p className="eyebrow text-[color:var(--brand-gold-deep)]">{resource.category}</p>
        <h3 className="font-display text-xl leading-tight">{resource.label}</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-foreground/60 transition-colors group-hover:text-[color:var(--brand-magenta)]">
        Open
        <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </a>
  );
}
