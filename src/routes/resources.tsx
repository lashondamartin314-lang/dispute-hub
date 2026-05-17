import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { EditorialHeader } from "@/components/editorial-header";
import { ResourceTile } from "@/components/resource-tile";
import { DISPUTE_ROUNDS, RESOURCES, type DisputeRound } from "@/data/resources";

const CATEGORY_IDS = ["report", "kit", "complaint", "academy"] as const;

const resourcesSearchSchema = z.object({
  category: fallback(z.enum(CATEGORY_IDS).optional(), undefined),
});

export const Route = createFileRoute("/resources")({
  validateSearch: zodValidator(resourcesSearchSchema),
  head: () => ({
    meta: [
      { title: "Resources · The Dispute Playbook" },
      { name: "description", content: "External tools, complaint portals, and the parent Google Drive folder containing every letter template." },
    ],
  }),
  component: ResourcesPage,
});

interface CategorySpec {
  id: "report" | "kit" | "complaint" | "academy";
  label: string;
  blurb: string;
  /** Personal recommendation, rendered as a pull quote callout. */
  quote: string;
}

const CATEGORIES: CategorySpec[] = [
  {
    id: "report",
    label: "Get your credit reports",
    blurb: "Two sources, two jobs. Pull from both so you have the official record AND a working day-to-day view of your file.",
    quote:
      "I tell every client to use both. AnnualCreditReport.com is the only place to get your free, federally authorized reports with the official report numbers you'll need to dispute. SmartCredit is what I open every single day because the report layout is readable, it monitors all three bureaus, and the credit-building tools actually move scores. One is your record of truth, the other is your dashboard.",
  },
  {
    id: "kit",
    label: "Letter templates and kit assets",
    blurb: "Editable Google Docs for every dispute letter referenced in the Playbook.",
    quote:
      "Don't retype letters from scratch. Make a copy of the template, swap in your details, and keep a clean copy in your own Drive folder so your paper trail stays organized round after round.",
  },
  {
    id: "complaint",
    label: "Government complaint portals",
    blurb: "Federal and state agencies that escalate disputes when bureaus or creditors stall.",
    quote:
      "When a furnisher or bureau ignores you, these portals are how you get their attention. The CFPB and your state Attorney General force a written response on a clock, and that pressure alone resolves a surprising number of accounts.",
  },
  {
    id: "academy",
    label: "Coaching and deeper curriculum",
    blurb: "When you want hands-on guidance beyond the Playbook.",
    quote:
      "The Playbook gives you the system. The Academy is where I work through your file with you, answer questions live, and help you avoid the mistakes that set people back six months.",
  },
];

const FILTER_LABEL: Record<CategorySpec["id"], string> = {
  report: "Credit",
  complaint: "Regulatory",
  kit: "Letter Kit",
  academy: "Education",
};

function ResourcesPage() {
  const [activeRound, setActiveRound] = useState<DisputeRound | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategorySpec["id"] | null>(null);

  const allSections = CATEGORIES
    .map((c) => ({ ...c, items: RESOURCES.filter((r) => r.category === c.id) }))
    .filter((c) => c.items.length > 0);

  const sections = activeCategory
    ? allSections.filter((c) => c.id === activeCategory)
    : allSections;

  const activeMeta = activeRound
    ? DISPUTE_ROUNDS.find((r) => r.round === activeRound)
    : null;

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <EditorialHeader
        eyebrow="Quick access · External tools"
        numeral="✶"
        numeralColor="var(--brand-gold)"
        title={<>Everything you'll <em className="font-display italic text-[color:var(--brand-gold-deep)]">reach for.</em></>}
        lede="Trusted external sites, official complaint portals, and the Drive folder with every letter template. Tap any tile to see what it is, when you'd use it, and the exact steps — including a full screen-by-screen CFPB walkthrough — before you leave the Playbook."
      />

      {/* Round timeline: tap a round to highlight which resources to use at that stage */}
      <section
        aria-label="Dispute round timeline"
        className="mt-12 rounded-xl border-2 border-border bg-card p-5 shadow-card md:p-6"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="eyebrow text-[10px]">Which resources, which round</p>
            <h2 className="font-display text-xl md:text-2xl">Tap a round to spotlight what you need.</h2>
          </div>
          {activeRound && (
            <button
              type="button"
              onClick={() => setActiveRound(null)}
              className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Show all
            </button>
          )}
        </div>

        <ol className="mt-4 grid grid-cols-1 gap-2 md:grid-cols-3">
          {DISPUTE_ROUNDS.map((r) => {
            const active = activeRound === r.round;
            return (
              <li key={r.round}>
                <button
                  type="button"
                  onClick={() => setActiveRound(active ? null : r.round)}
                  aria-pressed={active}
                  className={
                    "group flex w-full flex-col items-start gap-1 rounded-lg border-2 p-4 text-left transition-all " +
                    (active
                      ? "border-[color:var(--brand-gold-deep)] bg-[color:color-mix(in_oklab,var(--brand-gold)_20%,var(--card))] shadow-elegant"
                      : "border-border bg-card hover:border-[color:var(--brand-gold-deep)] hover:-translate-y-0.5")
                  }
                >
                  <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-gold-deep)]">
                    Round {r.round}
                  </span>
                  <span className="font-display text-base leading-tight">{r.name.split(" · ")[1]}</span>
                  <span className="text-xs leading-relaxed text-muted-foreground">{r.focus}</span>
                </button>
              </li>
            );
          })}
        </ol>

        {activeMeta && (
          <p className="mt-4 rounded-md border border-[color:var(--brand-gold-deep)]/40 bg-[color:color-mix(in_oklab,var(--brand-gold)_10%,var(--card))] px-4 py-2.5 text-sm">
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-gold-deep)]">
              Now showing
            </span>{" "}
            <span className="font-semibold">{activeMeta.name}.</span>{" "}
            <span className="text-muted-foreground">
              Tiles below are highlighted if you use them in this round, dimmed if you don't.
            </span>
          </p>
        )}
      </section>

      {/* TOC: solid white card with strong border so it pops against the page background */}
      {/* Category filter chips */}
      <section aria-label="Filter resources by category" className="mt-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-gold-deep)]">
            Filter
          </span>
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            aria-pressed={activeCategory === null}
            className={
              "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] transition-colors " +
              (activeCategory === null
                ? "border-[color:var(--brand-gold-deep)] bg-[color:var(--brand-gold-deep)] text-[color:var(--brand-cream)]"
                : "border-border bg-card text-foreground/70 hover:border-[color:var(--brand-gold-deep)] hover:text-foreground")
            }
          >
            All
          </button>
          {allSections.map((c) => {
            const active = activeCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveCategory(active ? null : c.id)}
                aria-pressed={active}
                className={
                  "rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] transition-colors " +
                  (active
                    ? "border-[color:var(--brand-gold-deep)] bg-[color:var(--brand-gold-deep)] text-[color:var(--brand-cream)]"
                    : "border-border bg-card text-foreground/70 hover:border-[color:var(--brand-gold-deep)] hover:text-foreground")
                }
              >
                {FILTER_LABEL[c.id]}
                <span className="ml-1.5 font-mono text-[10px] opacity-70">{c.items.length}</span>
              </button>
            );
          })}
        </div>
      </section>

      <nav
        aria-label="On this page"
        className="mt-6 rounded-xl border-2 border-border bg-card px-6 py-5 shadow-card"
      >
        <p className="eyebrow text-[10px] mb-3">On this page</p>
        <ol className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {sections.map((c, i) => (
            <li key={c.id} className="flex items-baseline gap-2">
              <span className="font-mono text-[11px] text-[color:var(--brand-gold-deep)] font-bold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <a
                href={`#${c.id}`}
                className="text-foreground font-medium underline-offset-4 hover:underline decoration-[color:var(--brand-gold-deep)]/70"
              >
                {c.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 space-y-14">
        {sections.map((c) => (
          <section key={c.id} id={c.id} className="scroll-mt-24">
            <div className="mb-5 border-b border-border/60 pb-3">
              <h2 className="font-display text-2xl leading-tight md:text-3xl">{c.label}</h2>
              <p className="mt-1 text-sm text-muted-foreground md:text-base">{c.blurb}</p>
            </div>

            <ShondaQuote text={c.quote} />

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.items.map((r) => (
                <ResourceTile key={r.id} resource={r} activeRound={activeRound} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}

/**
 * Pull-quote callout from Shonda. Avatar in a small circle pairs with the
 * quote box. Replace the initials with an <img src="..." /> once a portrait
 * photo is uploaded to /src/assets/.
 */
function ShondaQuote({ text }: { text: string }) {
  return (
    <figure className="relative rounded-2xl border-2 border-[color:color-mix(in_oklab,var(--brand-gold)_45%,var(--border))] bg-[color:color-mix(in_oklab,var(--brand-peach)_30%,var(--card))] p-6 pl-8 shadow-card md:p-7 md:pl-10">
      <span
        aria-hidden="true"
        className="absolute left-4 top-3 font-display text-5xl leading-none text-[color:var(--brand-gold-deep)]/60 md:text-6xl"
      >
        &ldquo;
      </span>
      <div className="flex items-start gap-4">
        <div
          aria-hidden="true"
          className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-[color:var(--brand-gold-deep)] bg-[color:var(--brand-navy)] font-display text-base font-semibold text-[color:var(--brand-cream)] shadow-card"
        >
          SM
        </div>
        <div className="flex-1">
          <blockquote className="font-editorial text-base leading-relaxed text-foreground md:text-lg">
            {text}
          </blockquote>
          <figcaption className="mt-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-gold-deep)]">
            Shonda Martin · Why I recommend this
          </figcaption>
        </div>
      </div>
    </figure>
  );
}
