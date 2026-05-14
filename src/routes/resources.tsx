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
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <EditorialHeader
        eyebrow="Quick access · External tools"
        numeral="✶"
        numeralColor="var(--brand-gold)"
        title="Everything you'll reach for."
        lede="Trusted external sites, official complaint portals, and the Drive folder with every letter template. All links open in a new tab — you'll leave the Playbook portal."
      />

      <div className="mt-16 space-y-12">
        {CATEGORIES.map((c) => {
          const items = RESOURCES.filter((r) => r.category === c.id);
          if (items.length === 0) return null;
          return (
            <section key={c.id}>
              <div className="mb-5 border-b border-border/60 pb-3">
                <h2 className="font-display text-2xl leading-tight md:text-3xl">{c.label}</h2>
                <p className="mt-1 text-sm text-muted-foreground md:text-base">{c.blurb}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((r) => (<ResourceTile key={r.id} resource={r} />))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
