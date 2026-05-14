import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Eye, Mail, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { LETTERS_BY_ID, type LetterId } from "@/data/letters";
import { PHASES_BY_ID } from "@/data/phases";

export type LetterCardVariant = "editorial" | "tinted" | "frame";

interface LetterCardProps {
  id: LetterId;
  className?: string;
  variant?: LetterCardVariant;
}

export function LetterCard({ id, className, variant = "editorial" }: LetterCardProps) {
  const letter = LETTERS_BY_ID[id];
  const phase = PHASES_BY_ID[letter.phaseId];
  const phaseColor = `var(${phase.colorVar})`;
  const phaseDeep = `var(${phase.colorVar}-deep)`;
  const phaseSoft = `var(${phase.colorVar}-soft)`;

  const isFrame = variant === "frame";
  const isTinted = variant === "tinted";

  const containerStyle: React.CSSProperties = isTinted
    ? {
        background: `color-mix(in oklab, ${phaseSoft} 65%, var(--brand-paper))`,
        borderLeftColor: phaseColor,
      }
    : {};

  const titleColor = isFrame
    ? "text-[color:var(--brand-cream)]"
    : isTinted
      ? ""
      : "";

  return (
    <article
      style={containerStyle}
      className={cn(
        "group relative flex flex-col gap-5 p-6 md:p-8 transition-all duration-300 hover:-translate-y-0.5",
        variant === "editorial" && "card-editorial hover:shadow-frame",
        isTinted && "card-tinted",
        isFrame && "card-frame",
        className,
      )}
    >
      {isFrame && <div aria-hidden className="card-frame-inner" />}
      {variant === "editorial" && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ boxShadow: `inset 0 0 0 1px ${phaseColor}` }}
        />
      )}

      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="eyebrow" style={{ color: isFrame ? "var(--brand-gold)" : phaseDeep }}>
            {phase.eyebrow} · {letter.id}
          </p>
          <h3 className={cn("font-display text-2xl leading-tight text-balance md:text-[28px]", titleColor)}>
            {letter.title}
          </h3>
        </div>
        <div
          aria-hidden
          className="font-display select-none text-5xl leading-none md:text-6xl"
          style={{ color: phaseColor, opacity: isFrame ? 0.5 : isTinted ? 0.6 : 0.25 }}
        >
          {letter.id.replace("L", "")}
        </div>
      </div>

      <p
        className={cn(
          "font-editorial text-lg leading-snug text-pretty relative",
          isFrame ? "text-[color:var(--brand-cream)]/85" : "text-foreground/80",
        )}
      >
        {letter.lede}
      </p>

      <div
        className={cn(
          "pt-5 mt-auto flex flex-wrap items-center gap-3 relative border-t",
          isFrame
            ? "border-[color:color-mix(in_oklab,var(--brand-cream)_20%,transparent)]"
            : "border-[color:color-mix(in_oklab,var(--brand-ink)_12%,transparent)]",
        )}
      >
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
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-medium transition-colors",
            isFrame
              ? "border-[color:color-mix(in_oklab,var(--brand-cream)_30%,transparent)] text-[color:var(--brand-cream)]/85 hover:border-[color:var(--brand-gold)] hover:text-[color:var(--brand-gold)]"
              : "border-border text-foreground/80 hover:border-foreground/30 hover:text-foreground",
          )}
        >
          <FileText className="size-4" />
          Preview
        </a>
        <Link
          to="/playbook/letter/$id"
          params={{ id: letter.id }}
          className={cn(
            "ml-auto text-xs font-medium tracking-wide underline-offset-4 hover:underline",
            isFrame ? "text-[color:var(--brand-cream)]/60 hover:text-[color:var(--brand-gold)]" : "text-muted-foreground hover:text-foreground",
          )}
        >
          Letter detail →
        </Link>
      </div>
    </article>
  );
}
