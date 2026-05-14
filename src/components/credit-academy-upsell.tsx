import { useState } from "react";
import { ArrowUpRight, Check, ChevronDown, Crown, ShieldCheck, Sparkles } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
    id: "smartcredit",
    eyebrow: "Tier 1 · See your file",
    name: "SmartCredit 3B Reports",
    price: "$24.99",
    cadence: "/mo",
    icon: ShieldCheck,
    bullets: [
      "3-bureau credit reports & scores — pulled side-by-side for clean visibility.",
      "Score Tracker, Score Simulator & Money Manager to plan your next moves.",
      "ID theft insurance up to $1M plus dark-web & SSN monitoring alerts.",
      "Smart Credit Builder tools: ScoreBoost, ScoreBuilder & ScoreMaster.",
      "Personal lending directives & pay-date control to protect your profile.",
    ],
    cta: "Start SmartCredit 3B",
    href: "https://www.smartcredit.com/?PID=74780",
    highlight: false,
    accent: "var(--phase-3-deep, var(--brand-ink))",
  },
  {
    id: "hub",
    eyebrow: "Tier 2 · DIY, self-paced",
    name: "Dispute Playbook + Support Site",
    price: "$37.99",
    cadence: "one-time",
    icon: Sparkles,
    bullets: [
      "Full DIY Dispute Playbook — every phase laid out, step by step.",
      "Support site access: template dispute letters ready to personalize.",
      "Resource library: guides, glossary, decoder & tracker tools.",
      "Self-paced by design — no 1:1 guidance, you drive the work.",
      "Lifetime access — revisit any phase whenever you need it.",
    ],
    cta: "Get the Playbook",
    href: "https://shondamartincom.netlify.app/p/cc-2026/",
    highlight: false,
    accent: "var(--brand-magenta-deep)",
  },
  {
    id: "vip",
    eyebrow: "Tier 3 · The full system",
    name: "Credit Academy VIP",
    price: "$39.99",
    cadence: "/mo",
    icon: Crown,
    bullets: [
      "Personalized dispute letters written for your specific report.",
      "Systematic, guided dispute approach — no guessing what's next.",
      "SmartCredit 3B reports & full credit-building tools included.",
      "Everything in the Playbook + Support Site — letters, templates, library.",
      "Member-only webinars, workshops & cohorts on credit & homeownership.",
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
          background: "var(--gradient-brand)",
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
            href={withUtm("https://shondamartincom.netlify.app/credit-academy-memberships", "vip", placement)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join Credit Academy VIP (opens in new tab)"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[color:var(--brand-gold)] px-6 py-3 text-sm font-bold text-[color:var(--brand-ink)] shadow-elegant transition-all hover:-translate-y-0.5 hover:bg-[color:var(--brand-gold-deep)] hover:text-[color:var(--brand-cream)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-gold-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
                  ? "var(--gradient-brand)"
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
                href={withUtm(t.href, t.id, placement)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${t.cta} (opens in new tab)`}
                className={cn(
                  "mt-7 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 hover:shadow-elegant",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                )}
                style={
                  {
                    background: t.highlight ? "var(--gradient-brand)" : t.accent,
                    color: t.highlight ? "var(--brand-cream)" : "var(--brand-cream)",
                    ["--tw-ring-color" as string]: t.highlight ? "var(--brand-gold)" : t.accent,
                  } as React.CSSProperties
                }
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
          href={withUtm("https://shondamartincom.netlify.app/credit-academy-memberships", "vip_trial", placement)}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-foreground underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-gold-deep)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Be Shonda's guest for 7 days →
        </a>
      </p>
    </section>
  );
}
