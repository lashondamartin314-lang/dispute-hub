import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Library, Sparkles } from "lucide-react";
import { EditorialHeader } from "@/components/editorial-header";
import { ResourceTile } from "@/components/resource-tile";
import { PINNED_RESOURCES } from "@/data/resources";
import { PHASES } from "@/data/phases";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Dispute Playbook Hub · Credit Academy" },
      { name: "description", content: "Your interactive companion to the Credit Academy Dispute Playbook — letter library, phase guides, and quick-access resources." },
    ],
  }),
  component: HubPage,
});

function HubPage() {
  return (
    <div className="relative">
      <div aria-hidden className="bg-halo animate-halo-drift pointer-events-none absolute inset-x-0 top-0 h-[600px] opacity-90" />

      <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-20 md:px-10 md:pt-24">
        <EditorialHeader
          eyebrow="Credit Academy · 2026 Edition"
          numeral="✶"
          numeralColor="var(--brand-gold)"
          title={<>The Dispute <em className="font-editorial text-[color:var(--brand-magenta)]">Playbook</em>, made interactive.</>}
          lede={<>A six-phase, five-round dispute system — built on FCRA and FDCPA law. Every letter linked. Every reference live. Walk through the work, slow down where it matters, finish on the other side.</>}
        />

        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/playbook" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-navy)] px-6 py-3 text-sm font-semibold text-[color:var(--brand-cream)] transition-all hover:bg-[color:var(--brand-violet-deep)]">
            <BookOpen className="size-4" /> Open the Playbook <ArrowRight className="size-4" />
          </Link>
          <Link to="/letters" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-[color:var(--brand-gold)]">
            <Library className="size-4" /> All 19 letter templates
          </Link>
          <Link to="/resources" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:border-[color:var(--brand-gold)]">
            <Sparkles className="size-4" /> Quick resources
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 md:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">The six phases</p>
            <h2 className="font-display mt-2 text-3xl md:text-4xl">Where you are in the journey.</h2>
          </div>
          <Link to="/playbook/foundation" className="hidden text-sm text-muted-foreground underline-offset-4 hover:underline md:inline">Read the foundation →</Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PHASES.map((p) => (
            <Link
              key={p.id}
              to="/playbook/phase/$id"
              params={{ id: p.id }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:shadow-elegant"
            >
              <div aria-hidden className="absolute -top-10 -right-6 font-display text-[140px] leading-none opacity-15 transition-opacity group-hover:opacity-25" style={{ color: `var(${p.colorVar})` }}>
                {p.number}
              </div>
              <p className="eyebrow" style={{ color: `var(${p.colorVar}-deep)` }}>{p.eyebrow}</p>
              <h3 className="font-display mt-2 text-2xl">{p.name}</h3>
              <p className="font-editorial mt-3 text-foreground/75">{p.lede}</p>
              <p className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide uppercase text-foreground/60 group-hover:text-[color:var(--brand-magenta)]">
                Open phase <ArrowRight className="size-3" />
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
        <div className="mb-8">
          <p className="eyebrow">Quick access</p>
          <h2 className="font-display mt-2 text-3xl md:text-4xl">External tools you'll need.</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PINNED_RESOURCES.map((r) => (<ResourceTile key={r.id} resource={r} />))}
        </div>
      </section>
    </div>
  );
}
