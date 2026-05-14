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
        <div className="flex min-w-0 items-start gap-4">
          <span
            role="img"
            aria-label={`${phase.eyebrow} dispute letter ${letter.id}`}
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-card md:h-14 md:w-14"
            style={{
              background: isFrame
                ? `color-mix(in oklab, var(--brand-ink) 78%, ${phaseColor})`
                : phaseDeep,
              color: "var(--brand-cream)",
              border: `2px solid color-mix(in oklab, ${phaseColor} 70%, var(--brand-ink))`,
            }}
          >
            <Mail className="size-6 md:size-7" strokeWidth={2.25} aria-hidden />
          </span>
          <div className="min-w-0 space-y-2">
            <p className="eyebrow" style={{ color: isFrame ? "var(--brand-gold)" : phaseDeep }}>
              {phase.eyebrow} · {letter.id}
            </p>
            <h3 className={cn("font-display text-2xl leading-tight text-balance md:text-[28px]", titleColor)}>
              {letter.title}
            </h3>
          </div>
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
          "pt-5 mt-auto grid gap-2.5 relative border-t sm:grid-cols-[1fr_1fr_auto_auto] sm:gap-3 sm:items-center",
          isFrame
            ? "border-[color:color-mix(in_oklab,var(--brand-cream)_20%,transparent)]"
            : "border-[color:color-mix(in_oklab,var(--brand-ink)_12%,transparent)]",
        )}
      >
        <a
          href={letter.copyUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Use template for ${letter.title} (opens in new tab)`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-bold text-accent-foreground shadow-card transition-all hover:-translate-y-0.5 hover:bg-[color:var(--brand-magenta-deep)] hover:shadow-glow"
        >
          Use template
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
        <a
          href={letter.viewUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Preview ${letter.title} letter (opens in new tab)`}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-full border-2 px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5",
            isFrame
              ? "border-[color:color-mix(in_oklab,var(--brand-cream)_35%,transparent)] text-[color:var(--brand-cream)] hover:border-[color:var(--brand-gold)] hover:text-[color:var(--brand-gold)]"
              : "text-foreground hover:shadow-card",
          )}
          style={
            !isFrame
              ? {
                  borderColor: `color-mix(in oklab, ${phaseColor} 55%, transparent)`,
                  background: `color-mix(in oklab, ${phaseColor} 8%, var(--card))`,
                }
              : undefined
          }
        >
          <Eye className="size-4" strokeWidth={2.25} aria-hidden />
          Preview
        </a>
        <Link
          to="/playbook/letter/$id"
          params={{ id: letter.id }}
          aria-label={`Open full details for ${letter.title}`}
          className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-[color:var(--brand-cream)] shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant sm:ml-auto"
          style={{ background: isFrame ? "var(--brand-gold-deep)" : phaseDeep }}
        >
          <BookOpen className="size-4" strokeWidth={2.25} aria-hidden />
          Letter details
          <ArrowUpRight className="size-4" aria-hidden />
        </Link>
        <Link
          to="/playbook/letter/$id"
          params={{ id: letter.id }}
          aria-label={`Open ${letter.title} details`}
          title="Open details"
          className="hidden sm:inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all hover:-translate-y-0.5 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{
            background: isFrame ? "var(--brand-gold-deep)" : phaseDeep,
            color: "var(--brand-cream)",
            borderColor: `color-mix(in oklab, ${phaseColor} 60%, var(--brand-ink))`,
          }}
        >
          <ArrowUpRight className="size-5" strokeWidth={2.5} aria-hidden />
        </Link>
      </div>
    </article>
  );
}
