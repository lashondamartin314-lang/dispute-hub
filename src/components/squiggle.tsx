import { cn } from "@/lib/utils";

type Variant = "wave" | "underline" | "arrow" | "swoop" | "scribble";

interface SquiggleProps {
  variant?: Variant;
  className?: string;
  color?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
}

/**
 * Handwritten-style decorative lines. Use sparingly — one per section max.
 * Default color is magenta; override via `color` prop or `style={{ color }}`.
 */
export function Squiggle({
  variant = "wave",
  className,
  color = "var(--brand-magenta)",
  width,
  height,
  strokeWidth = 2.25,
}: SquiggleProps) {
  const paths: Record<Variant, { d: string; w: number; h: number }> = {
    wave: {
      d: "M2 12 C 22 2, 42 22, 62 12 S 102 2, 122 12 S 162 22, 182 12",
      w: 184,
      h: 24,
    },
    underline: {
      d: "M2 8 C 30 2, 60 14, 96 7 S 162 12, 198 5",
      w: 200,
      h: 14,
    },
    arrow: {
      d: "M2 24 C 28 6, 70 6, 110 18 M 100 10 L 116 18 L 104 26",
      w: 122,
      h: 32,
    },
    swoop: {
      d: "M4 4 C 40 4, 80 40, 140 28",
      w: 148,
      h: 36,
    },
    scribble: {
      d: "M2 10 C 14 2, 28 18, 42 10 S 70 2, 84 10 S 112 18, 126 10",
      w: 130,
      h: 20,
    },
  };
  const p = paths[variant];
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${p.w} ${p.h}`}
      width={width ?? p.w}
      height={height ?? p.h}
      fill="none"
      className={cn("pointer-events-none select-none", className)}
      style={{ color }}
    >
      <path
        d={p.d}
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
