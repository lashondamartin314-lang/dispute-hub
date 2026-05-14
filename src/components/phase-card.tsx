import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { Phase } from "@/data/phases";

interface PhaseCardProps {
  phase: Phase;
  href?: boolean;
  rightSlot?: React.ReactNode;
  className?: string;
}

/**
 * Variant B — tinted phase wash card.
 * Background tinted in the phase color, 4px left rule, bright corner numeral,
 * thicker title in --phase-N-deep.
 */
export function PhaseCard({ phase, href = true, rightSlot, className }: PhaseCardProps) {
  const color = `var(${phase.colorVar})`;
  const soft = `var(${phase.colorVar}-soft)`;
  const deep = `var(${phase.colorVar}-deep)`;

  const inner = (
    <article
      style={{
        background: `color-mix(in oklab, ${soft} 65%, var(--brand-paper))`,
        borderLeftColor: color,
      }}
      className={cn(
        "card-tinted group relative flex items-center gap-5 p-5 md:p-6 transition hover:-translate-y-0.5 hover:shadow-elegant",
        className,
      )}
    >
      <div
        aria-hidden
        className="font-display text-6xl md:text-7xl font-bold leading-none w-14 text-center select-none"
        style={{ color, opacity: 0.6 }}
      >
        {phase.number}
      </div>
      <div className="flex-1 min-w-0">
        <p className="eyebrow text-[10px]" style={{ color: deep }}>
          Phase {phase.number}
        </p>
        <h4
          className="font-display text-xl md:text-2xl font-bold tracking-tight uppercase mt-0.5"
          style={{ color: deep, fontWeight: 800 }}
        >
          {phase.name}
        </h4>
        <p className="text-sm text-foreground/85 mt-1">{phase.lede}</p>
      </div>
      {rightSlot}
    </article>
  );

  if (!href) return inner;
  return (
    <Link to="/playbook/phase/$id" params={{ id: phase.id }} className="block">
      {inner}
    </Link>
  );
}
