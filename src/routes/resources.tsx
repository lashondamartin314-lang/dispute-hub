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

const CATEGORIES = [
  {
    id: "report" as const,
    label: "Pull your credit report",
    blurb: "The only federally authorized site for your free Equifax, Experian, and TransUnion reports.",
  },
  {
    id: "monitoring" as const,
    label: "Credit monitoring",
    blurb: "Track score changes, new accounts, and inquiries across all three bureaus daily.",
  },
  {
    id: "kit" as const,
    label: "Letter templates & kit assets",
    blurb: "Editable Google Docs for every dispute letter referenced in the Playbook.",
  },
  {
    id: "complaint" as const,
    label: "Government complaint portals",
    blurb: "Federal and state agencies that escalate disputes when bureaus or creditors stall.",
  },
  {
    id: "academy" as const,
    label: "Coaching & deeper curriculum",
    blurb: "When you want hands-on guidance beyond the Playbook.",
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
        lede="Trusted external sites, official complaint portals, and the Drive folder with every letter template. All links open in a new tab — you'll leave the Playbook portal."
      />

      <nav
        aria-label="On this page"
        className="mt-12 rounded-lg border border-border/60 bg-muted/30 px-5 py-4"
      >
        <p className="eyebrow text-[10px] mb-2">On this page</p>
        <ol className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm">
          {sections.map((c, i) => (
            <li key={c.id} className="flex items-baseline gap-2">
              <span className="font-mono text-[11px] text-muted-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <a
                href={`#${c.id}`}
                className="text-foreground underline-offset-4 hover:underline decoration-[color:var(--brand-gold-deep)]/60"
              >
                {c.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 space-y-12">
        {sections.map((c) => (
          <section key={c.id} id={c.id} className="scroll-mt-24">
            <div className="mb-5 border-b border-border/60 pb-3">
              <h2 className="font-display text-2xl leading-tight md:text-3xl">{c.label}</h2>
              <p className="mt-1 text-sm text-muted-foreground md:text-base">{c.blurb}</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.items.map((r) => (<ResourceTile key={r.id} resource={r} />))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
