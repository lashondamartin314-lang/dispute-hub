import { Link, useRouterState } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { PHASES } from "@/data/phases";

type Variant = "sidebar" | "cover" | "page";

interface PhaseGridProps {
  variant?: Variant;
  /**
   * Called when a tile is hovered/focused so a parent section can tint its
   * background to the phase's soft hue. Receives the CSS variable token name
   * (e.g. "--phase-3-soft") or null on leave.
   */
  onTintChange?: (tintVar: string | null) => void;
  /** Optional click handler (e.g. close mobile drawer). */
  onSelect?: () => void;
  className?: string;
  /** When true (sidebar variant only), collapse into a 1-col vertical rail of P# tiles. */
  collapsed?: boolean;
}

/**
 * Square P1–P6 tile grid — the canonical phase navigator.
 * Used in sidebar (compact 2-col), cover (3×2 hero), and /playbook (3×2 page).
 */
export function PhaseGrid({ variant = "page", onTintChange, onSelect, className = "", collapsed = false }: PhaseGridProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [hovered, setHovered] = useState<string | null>(null);

  const handleEnter = useCallback(
    (phaseId: string, colorVar: string) => {
      setHovered(phaseId);
      onTintChange?.(`${colorVar}-soft`);
    },
    [onTintChange],
  );

  const handleLeave = useCallback(() => {
    setHovered(null);
    onTintChange?.(null);
  }, [onTintChange]);

  const isCompact = variant === "sidebar";
  const isRail = isCompact && collapsed;

  // Sidebar uses 2-col stacked-tight; cover/page use a true 3-col grid.
  // When the sidebar is icon-collapsed, drop to a single vertical column.
  const gridCls = isRail
    ? "grid grid-cols-1 gap-1.5 place-items-center"
    : variant === "sidebar"
      ? "grid grid-cols-2 gap-2"
      : "grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 md:gap-5";

  return (
    <div
      className={`${gridCls} ${className}`}
      onMouseLeave={handleLeave}
      onBlur={handleLeave}
    >
      {PHASES.map((p) => {
        const active = pathname.startsWith(`/playbook/phase/${p.id}`);
        const isHover = hovered === p.id;
        return (
          <Link
            key={p.id}
            to="/playbook/phase/$id"
            params={{ id: p.id }}
            onClick={onSelect}
            onMouseEnter={() => handleEnter(p.id, p.colorVar)}
            onFocus={() => handleEnter(p.id, p.colorVar)}
            aria-label={`Phase ${p.number}: ${p.name}`}
            data-active-scroll={active ? "phase" : undefined}
            className={[
              "group relative flex aspect-square flex-col justify-between overflow-hidden",
              "rounded-2xl border no-underline transition-all duration-300 ease-out",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
              isCompact ? "p-2.5" : "p-4 md:p-5",
              active
                ? "border-transparent shadow-[0_18px_40px_-18px_rgba(12,19,64,0.45)] ring-1 ring-white/60"
                : "border-white/70 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-18px_rgba(12,19,64,0.32)]",
            ].join(" ")}
            style={{
              // Tile background: soft phase tint at rest, deep on hover/active.
              background: active
                ? `linear-gradient(155deg, var(${p.colorVar}) 0%, var(${p.colorVar}-deep) 100%)`
                : isHover
                  ? `linear-gradient(155deg, var(${p.colorVar}-soft) 0%, var(${p.colorVar}) 100%)`
                  : `linear-gradient(155deg, color-mix(in oklab, var(${p.colorVar}-soft) 70%, white) 0%, var(${p.colorVar}-soft) 100%)`,
              // Focus ring color tracks the phase.
              ["--tw-ring-color" as string]: `var(${p.colorVar}-deep)`,
            }}
          >
            {/* P-number — display serif, dominant. */}
            <span
              className={[
                "font-display font-bold leading-none tracking-tight transition-colors",
                isCompact ? "text-2xl" : "text-4xl md:text-5xl",
                active ? "text-white/95" : "text-[color:var(--brand-ink)]/85",
              ].join(" ")}
              aria-hidden
            >
              P{p.number}
            </span>

            {/* Phase name + active marker. */}
            <div className="flex items-end justify-between gap-2">
              <span
                className={[
                  "font-body font-semibold leading-tight",
                  isCompact ? "text-[10px] uppercase tracking-[0.12em]" : "text-xs uppercase tracking-[0.16em] md:text-[13px]",
                  active ? "text-white" : "text-[color:var(--brand-ink)]/75",
                ].join(" ")}
              >
                {p.shortName ?? p.name}
              </span>
              {active && (
                <span
                  aria-hidden
                  className="h-1.5 w-1.5 shrink-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]"
                />
              )}
            </div>

            {/* Subtle inner highlight to lift the tile off the surface. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-60"
              style={{
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.06)",
              }}
            />
          </Link>
        );
      })}
    </div>
  );
}
