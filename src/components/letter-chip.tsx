import { ArrowUpRight } from "lucide-react";
import { LETTERS_BY_ID, type LetterId } from "@/data/letters";
import { PHASES_BY_ID } from "@/data/phases";
import { cn } from "@/lib/utils";

interface LetterChipProps {
  id: LetterId;
  variant?: "inline" | "pill";
  label?: string;
  className?: string;
}

/**
 * Inline reference to a letter template. Renders as an anchor that opens the
 * Google Doc force-copy URL in a new tab. Use anywhere body copy mentions L01–L19.
 */
export function LetterChip({ id, variant = "inline", label, className }: LetterChipProps) {
  const letter = LETTERS_BY_ID[id];
  const phase = PHASES_BY_ID[letter.phaseId];
  const text = label ?? `${letter.id} · ${letter.title}`;

  if (variant === "pill") {
    return (
      <a
        href={letter.copyUrl}
        target="_blank"
        rel="noopener noreferrer"
        title={`${letter.title} — opens Google Doc template`}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase transition-colors",
          className,
        )}
        style={{
          background: `color-mix(in oklab, var(${phase.colorVar}) 14%, transparent)`,
          color: `var(${phase.colorVar}-deep)`,
        }}
      >
        Use {letter.id} template
        <ArrowUpRight className="size-3" />
      </a>
    );
  }

  return (
    <a
      href={letter.copyUrl}
      target="_blank"
      rel="noopener noreferrer"
      title={`${letter.title} — opens Google Doc template`}
      className={cn(
        "inline-flex items-baseline gap-0.5 font-medium underline decoration-dotted decoration-1 underline-offset-4 transition-colors hover:text-[color:var(--brand-magenta)]",
        className,
      )}
      style={{ color: `var(${phase.colorVar}-deep)` }}
    >
      {text}
      <ArrowUpRight className="size-3 self-center" />
    </a>
  );
}
