import { cn } from "@/lib/utils";

interface EditorialHeaderProps {
  eyebrow?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  numeral?: React.ReactNode;
  numeralColor?: string;
  align?: "left" | "center";
  className?: string;
}

export function EditorialHeader({
  eyebrow,
  title,
  lede,
  numeral,
  numeralColor,
  align = "left",
  className,
}: EditorialHeaderProps) {
  return (
    <header
      className={cn(
        "relative",
        align === "center" ? "text-center" : "",
        className,
      )}
    >
      {numeral != null && (
        <div
          aria-hidden
          className={cn(
            "font-display pointer-events-none absolute -top-6 select-none text-[120px] leading-none opacity-15 md:text-[180px]",
            align === "center" ? "left-1/2 -translate-x-1/2" : "-right-2 md:-right-6",
          )}
          style={numeralColor ? { color: numeralColor } : undefined}
        >
          {numeral}
        </div>
      )}
      <div className="relative space-y-4">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1 className="font-display text-4xl leading-[1.05] text-balance md:text-6xl lg:text-7xl">
          {title}
        </h1>
        {lede && (
          <p className="font-editorial max-w-2xl text-lg leading-snug text-foreground/75 text-pretty md:text-xl">
            {lede}
          </p>
        )}
      </div>
    </header>
  );
}
