import { ArrowUpRight, Check, Crown, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CreditAcademyUpsellProps {
  /** Compact = single CTA card. Full = the 3-tier comparison. */
  variant?: "full" | "compact";
  className?: string;
  /** Optional accent (e.g. phase color) for the eyebrow + accent details. */
  accentColor?: string;
  /** Where on the site this upsell renders — used as utm_content. */
  placement?: string;
}

/**
 * Append attribution UTM params to an outbound CTA while preserving any
 * existing query string (e.g. SmartCredit's affiliate `PID`).
 * Existing utm_* values on the URL are respected and not overwritten.
 */
function withUtm(href: string, tier: string, placement: string): string {
  try {
    const url = new URL(href);
    const set = (k: string, v: string) => {
      if (!url.searchParams.has(k)) url.searchParams.set(k, v);
    };
    set("utm_source", "dispute_playbook");
    set("utm_medium", "upsell");
    set("utm_campaign", "credit_academy");
    set("utm_content", `${tier}__${placement}`);
    return url.toString();
  } catch {
    return href;
  }
}

const TIERS = [
  {
    id: "hub",
    eyebrow: "DIY · One-time access",
    name: "Dispute Hub",
    price: "$37.99",
    cadence: "one-time",
    icon: Sparkles,
    bullets: [
      "Full Dispute Hub access — path, tracker, templates, decoder, support tools.",
      "Step-by-step instructional support built for true DIY clarity.",
      "Self-guided by design — lighter than VIP, still organized and intentional.",
    ],
    cta: "Get the Dispute Hub",
    href: "https://shondamartincom.netlify.app/p/cc-2026/",
    highlight: false,
    accent: "var(--brand-magenta-deep)",
  },
  {
    id: "smartcredit",
    eyebrow: "Credit visibility · monthly",
    name: "SmartCredit 3B",
    price: "$24.99",
    cadence: "/mo",
    icon: ShieldCheck,
    bullets: [
      "3-bureau report spread — clear visibility into your file.",
      "$1M identity protection with alerts and protection tools built in.",
      "Profile-building tools: pay-date options, lending directives, and more.",
    ],
    cta: "Start SmartCredit 3B",
    href: "https://www.smartcredit.com/?PID=74780",
    highlight: false,
    accent: "var(--phase-3-deep, var(--brand-ink))",
  },
  {
    id: "vip",
    eyebrow: "VIP · The full system",
    name: "Credit Academy VIP",
    price: "$39.99",
    cadence: "/mo",
    icon: Crown,
    bullets: [
      "Patent-pending Dispute Engine to organize your report review and next moves.",
      "Member-exclusive resource library: letters, templates, education, tools.",
      "Member-only webinars, workshops & cohorts on credit, homeownership, finances.",
      "SmartCredit 3B and full credit-building suite included.",
      "Dedicated guidance — for the Cousin who wants less guesswork.",
    ],
    cta: "Join the Academy",
    href: "https://shondamartincom.netlify.app/credit-academy-memberships",
    highlight: true,
    accent: "var(--brand-gold-deep)",
  },
] as const;

export function CreditAcademyUpsell({
  variant = "full",
  className,
  accentColor,
  placement = variant === "compact" ? "compact_banner" : "full_grid",
}: CreditAcademyUpsellProps) {
  if (variant === "compact") {
    return (
      <aside
        className={cn(
          "relative overflow-hidden rounded-3xl border-2 p-6 md:p-8",
          className,
        )}
        style={{
          borderColor: "color-mix(in oklab, var(--brand-gold) 55%, transparent)",
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--brand-ink) 92%, transparent) 0%, color-mix(in oklab, var(--brand-magenta-deep) 80%, var(--brand-ink)) 100%)",
        }}
      >
        <div className="grid gap-5 md:grid-cols-[1fr_auto] md:items-center">
          <div className="text-[color:var(--brand-cream)]">
            <p
              className="eyebrow"
              style={{ color: "var(--brand-gold)" }}
            >
              Want more than DIY?
            </p>
            <h3 className="font-display mt-1 text-2xl leading-tight md:text-3xl">
              Step into Credit Academy.
            </h3>
            <p className="font-editorial mt-2 max-w-xl text-base leading-relaxed text-[color:var(--brand-cream)]/85 md:text-lg">
              Patent-pending Dispute Engine, member-only library, monthly cohorts,
              and SmartCredit 3B included. For Cousins ready for the full system.
            </p>
          </div>
          <a
            href="https://shondamartincom.netlify.app/credit-academy-memberships"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[color:var(--brand-gold)] px-6 py-3 text-sm font-bold text-[color:var(--brand-ink)] shadow-elegant transition-all hover:-translate-y-0.5 hover:bg-[color:var(--brand-gold-deep)] hover:text-[color:var(--brand-cream)]"
          >
            Join the Academy <ArrowUpRight className="size-4" aria-hidden />
          </a>
        </div>
      </aside>
    );
  }

  return (
    <section
      className={cn("scroll-mt-24", className)}
      id="academy"
      aria-labelledby="academy-heading"
    >
      <div className="text-center">
        <p
          className="eyebrow"
          style={{ color: accentColor ?? "var(--brand-gold-deep)" }}
        >
          Need more guidance?
        </p>
        <h2
          id="academy-heading"
          className="font-display mt-2 text-3xl leading-tight md:text-5xl"
        >
          Three lanes. <em className="font-editorial italic">Pick yours.</em>
        </h2>
        <p className="font-editorial mx-auto mt-3 max-w-2xl text-base leading-relaxed text-foreground/80 md:text-lg">
          The Playbook gets you moving. When you want stronger systems, deeper
          support, or full visibility — Shonda built the lane for that too.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        {TIERS.map((t) => {
          const Icon = t.icon;
          return (
            <article
              key={t.id}
              className={cn(
                "relative flex flex-col rounded-3xl border-2 p-6 transition-all hover:-translate-y-1 md:p-7",
                t.highlight ? "shadow-elegant" : "shadow-card",
              )}
              style={{
                borderColor: t.highlight
                  ? "var(--brand-gold)"
                  : `color-mix(in oklab, ${t.accent} 28%, transparent)`,
                background: t.highlight
                  ? "linear-gradient(180deg, color-mix(in oklab, var(--brand-ink) 96%, transparent) 0%, color-mix(in oklab, var(--brand-magenta-deep) 30%, var(--brand-ink)) 100%)"
                  : "var(--card)",
                color: t.highlight ? "var(--brand-cream)" : undefined,
              }}
            >
              {t.highlight && (
                <span
                  className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-[color:var(--brand-gold)] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[color:var(--brand-ink)] shadow-card"
                >
                  ★ Most loved
                </span>
              )}

              <header className="flex items-start gap-3">
                <span
                  aria-hidden
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl"
                  style={{
                    background: t.highlight
                      ? "var(--brand-gold)"
                      : `color-mix(in oklab, ${t.accent} 14%, var(--brand-paper))`,
                    color: t.highlight ? "var(--brand-ink)" : t.accent,
                    border: t.highlight
                      ? "none"
                      : `2px solid color-mix(in oklab, ${t.accent} 45%, transparent)`,
                  }}
                >
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <p
                    className="eyebrow text-[10px]"
                    style={{
                      color: t.highlight ? "var(--brand-gold)" : t.accent,
                    }}
                  >
                    {t.eyebrow}
                  </p>
                  <h3 className="font-display mt-0.5 text-xl leading-tight md:text-2xl">
                    {t.name}
                  </h3>
                </div>
              </header>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-4xl md:text-5xl">{t.price}</span>
                <span
                  className={cn(
                    "text-sm font-medium",
                    t.highlight
                      ? "text-[color:var(--brand-cream)]/70"
                      : "text-muted-foreground",
                  )}
                >
                  {t.cadence}
                </span>
              </div>

              <ul className="mt-5 space-y-2.5">
                {t.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-sm leading-relaxed">
                    <Check
                      className="mt-0.5 size-4 shrink-0"
                      style={{
                        color: t.highlight ? "var(--brand-gold)" : t.accent,
                      }}
                      strokeWidth={3}
                      aria-hidden
                    />
                    <span
                      className={cn(
                        t.highlight
                          ? "text-[color:var(--brand-cream)]/90"
                          : "text-foreground/85",
                      )}
                    >
                      {b}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href={t.href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-elegant",
                )}
                style={{
                  background: t.highlight
                    ? "var(--brand-gold)"
                    : t.accent,
                  color: t.highlight
                    ? "var(--brand-ink)"
                    : "var(--brand-cream)",
                }}
              >
                {t.cta}
                <ArrowUpRight className="size-4" aria-hidden />
              </a>
            </article>
          );
        })}
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Still undecided?{" "}
        <a
          href="https://shondamartincom.netlify.app/credit-academy-memberships"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-foreground underline-offset-4 hover:underline"
        >
          Be Shonda's guest for 7 days →
        </a>
      </p>
    </section>
  );
}
