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
  { id: "report" as const, label: "Pull your report" },
  { id: "monitoring" as const, label: "Monitoring" },
  { id: "kit" as const, label: "Kit assets" },
  { id: "complaint" as const, label: "Complaint portals" },
  { id: "academy" as const, label: "Credit Academy" },
];

function ResourcesPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <EditorialHeader
        eyebrow="Quick access · External tools"
        numeral="✶"
        numeralColor="var(--brand-gold)"
        title="Everything you'll reach for."
        lede="The official sources, complaint portals, and Drive assets that pair with the Playbook. Every link opens in a new tab."
      />

      <div className="mt-16 space-y-12">
        {CATEGORIES.map((c) => {
          const items = RESOURCES.filter((r) => r.category === c.id);
          if (items.length === 0) return null;
          return (
            <section key={c.id}>
              <h2 className="eyebrow mb-4">{c.label}</h2>
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
