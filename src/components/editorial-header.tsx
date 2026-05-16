import { cn } from "@/lib/utils";

interface EditorialHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  numeral?: React.ReactNode;
  numeralColor?: string;
  /** Optional accent color for the eyebrow pill (e.g. `var(--phase-2-deep)`). */
  accentColor?: string;
  align?: "left" | "center";
  className?: string;
}

export function EditorialHeader({
  eyebrow,
  title,
  lede,
  numeral,
  numeralColor,
  accentColor,
  align = "left",
  className,
}: EditorialHeaderProps) {
  const pillStyle = accentColor
    ? {
        color: accentColor,
        background: `color-mix(in oklab, ${accentColor} 14%, transparent)`,
        borderColor: `color-mix(in oklab, ${accentColor} 38%, transparent)`,
      }
    : undefined;

  return (
    <header className={cn("relative", align === "center" ? "text-center" : "", className)}>
      {numeral != null && (
        <div
          aria-hidden
          className={cn(
            "font-display pointer-events-none absolute -top-6 select-none text-[120px] leading-none opacity-25 md:text-[180px]",
            align === "center" ? "left-1/2 -translate-x-1/2" : "-right-2 md:-right-6",
          )}
          style={numeralColor ? { color: numeralColor } : undefined}
        >
          {numeral}
        </div>
      )}
      <div className="relative space-y-4">
        {eyebrow && (
          <p className="eyebrow-pill" style={pillStyle}>
            {accentColor && (
              <span
                aria-hidden
                className="inline-block h-1.5 w-1.5 rounded-full"
                style={{ background: accentColor }}
              />
            )}
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-4xl font-bold leading-[1.02] text-balance text-[color:var(--brand-ink)] md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {lede && (
          <p className="font-editorial max-w-2xl text-lg leading-snug text-foreground/90 text-pretty md:text-xl">
            {lede}
          </p>
        )}
      </div>
    </header>
  );
}
