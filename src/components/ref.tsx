import { Link } from "@tanstack/react-router";
import { REFS, type RefId } from "@/data/routes";
import { cn } from "@/lib/utils";

interface RefProps {
  to: RefId;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Internal cross-reference link. Reads from the routes registry so renames
 * never break in-copy references.
 */
export function Ref({ to, children, className }: RefProps) {
  const target = REFS[to];
  return (
    <Link
      to={target.to}
      hash={target.hash}
      className={cn(
        "font-medium text-[color:var(--brand-navy)] underline decoration-[color:var(--brand-gold)] decoration-2 underline-offset-4 transition-colors hover:text-[color:var(--brand-magenta)]",
        className,
      )}
    >
      {children ?? target.label}
    </Link>
  );
}
