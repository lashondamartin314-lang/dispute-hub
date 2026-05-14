import { createFileRoute } from "@tanstack/react-router";
import { EditorialHeader } from "@/components/editorial-header";
import { ResourceTile } from "@/components/resource-tile";
import { RESOURCES } from "@/data/resources";

export const Route = createFileRoute("/resources")({
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

function ResourcesPage() {
  const sections = CATEGORIES
    .map((c) => ({ ...c, items: RESOURCES.filter((r) => r.category === c.id) }))
    .filter((c) => c.items.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <EditorialHeader
        eyebrow="Quick access · External tools"
        numeral="✶"
        numeralColor="var(--brand-gold)"
        title="Everything you'll reach for."
        lede="Trusted external sites, official complaint portals, and the Drive folder with every letter template. All links open in a new tab and leave the Playbook portal."
      />

      {/* TOC: solid white card with strong border so it pops against the page background */}
      <nav
        aria-label="On this page"
        className="mt-12 rounded-xl border-2 border-border bg-card px-6 py-5 shadow-card"
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
              {c.items.map((r) => (<ResourceTile key={r.id} resource={r} />))}
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
