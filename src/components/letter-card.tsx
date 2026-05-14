import { Link } from "@tanstack/react-router";
import { ArrowUpRight, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { LETTERS_BY_ID, type LetterId } from "@/data/letters";
import { PHASES_BY_ID } from "@/data/phases";

interface LetterCardProps {
  id: LetterId;
  className?: string;
}

export function LetterCard({ id, className }: LetterCardProps) {
  const letter = LETTERS_BY_ID[id];
  const phase = PHASES_BY_ID[letter.phaseId];

  return (
    <article
      className={cn(
        "group relative flex flex-col gap-5 rounded-2xl border border-[color:color-mix(in_oklab,var(--brand-ink)_8%,transparent)] bg-card p-6 shadow-elegant transition-all duration-300 hover:-translate-y-0.5 hover:shadow-frame md:p-8",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: `inset 0 0 0 1px var(${phase.colorVar})` }}
      />

      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow" style={{ color: `var(${phase.colorVar}-deep)` }}>
            {phase.eyebrow} · {letter.id}
          </p>
          <h3 className="font-display text-2xl leading-tight text-balance md:text-[28px]">
            {letter.title}
          </h3>
        </div>
        <div
          aria-hidden
          className="font-display select-none text-5xl leading-none opacity-20 md:text-6xl"
          style={{ color: `var(${phase.colorVar})` }}
        >
          {letter.id.replace("L", "")}
        </div>
      </div>

      <p className="font-editorial text-lg leading-snug text-foreground/80 text-pretty">
        {letter.lede}
      </p>

      <div className="hairline pt-5 mt-auto flex flex-wrap items-center gap-3">
        <a
          href={letter.copyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:bg-[color:var(--brand-magenta-deep)] hover:shadow-glow"
        >
          Use template
          <ArrowUpRight className="size-4" />
        </a>
        <a
          href={letter.viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground/80 transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          <FileText className="size-4" />
          Preview
        </a>
        <Link
          to="/playbook/letter/$id"
          params={{ id: letter.id }}
          className="ml-auto text-xs font-medium tracking-wide text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Letter detail →
        </Link>
      </div>
    </article>
  );
}
