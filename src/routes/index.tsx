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
          title={<>Your <em className="font-editorial bg-gradient-to-r from-[color:var(--brand-gold)] via-[color:var(--brand-magenta)] to-[color:var(--brand-violet)] bg-clip-text text-transparent not-italic">Dispute</em> Playbook, made <em className="font-script text-[color:var(--brand-magenta)] not-italic">interactive</em>.</>}
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
        <style>{`
          @keyframes journey-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.9)} }
          @keyframes journey-ripple { 0%{transform:scale(1);opacity:.4} 100%{transform:scale(2.6);opacity:0} }
          .journey-dot { animation: journey-pulse 1.6s ease-in-out infinite; }
          .journey-ripple { animation: journey-ripple 2.2s cubic-bezier(0,0,.2,1) infinite; }
          .journey-arrow-path { stroke-dasharray: 320; stroke-dashoffset: 0; transition: stroke-dashoffset .8s cubic-bezier(.65,0,.35,1); }
          .group:hover .journey-arrow-path { stroke-dashoffset: 12; }
        `}</style>
        <div className="mb-12 flex flex-col gap-10 border-b border-[color:var(--brand-ink)]/10 pb-10 md:flex-row md:items-end md:justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="relative flex items-center justify-center">
                <span className="journey-ripple absolute h-3.5 w-3.5 rounded-full bg-[color:var(--brand-ink)]/30" />
                <span className="journey-dot relative h-2 w-2 rounded-full bg-[color:var(--brand-ink)]" />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[color:var(--brand-ink)]/60">The six phases</p>
            </div>
            <h2
              className="font-display leading-[0.9] tracking-tight md:text-7xl text-6xl"
            >
              <span className="italic font-medium">Where</span> you are in the journey.
            </h2>
          </div>

          <Link to="/playbook/foundation" className="group hidden shrink-0 flex-col items-start gap-3 no-underline md:flex">
            <div className="relative h-16 w-48 transition-transform duration-700 group-hover:translate-x-2 md:h-20 md:w-60">
              <svg viewBox="0 0 200 80" fill="none" className="h-full w-full text-[color:var(--brand-ink)]/40 transition-colors duration-500 group-hover:text-[color:var(--brand-ink)]">
                <path
                  d="M10 40C30 38 60 35 110 38C140 40 175 45 188 42M188 42C175 35 160 25 155 15M188 42C172 48 158 58 150 70"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="journey-arrow-path"
                />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="mb-1 text-[10px] font-bold uppercase tracking-[0.35em] text-[color:var(--brand-ink)]/60">The foundation</span>
              <span className="font-display border-b border-[color:var(--brand-ink)]/30 pb-1 text-2xl italic text-[color:var(--brand-ink)] transition-all duration-500 group-hover:border-[color:var(--brand-ink)] md:text-3xl">
                Read the foundation
              </span>
            </div>
          </Link>
        </div>

        <div className="relative">
          {/* Dashed map-style route connecting the 6 cards (desktop only) */}
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
            viewBox="0 0 300 200"
            preserveAspectRatio="none"
          >
            <g
              fill="none"
              stroke="var(--brand-ink)"
              strokeWidth="0.6"
              strokeDasharray="2 2"
              strokeLinecap="round"
              opacity="0.35"
            >
              {/* Row 1: card 1 → 2 → 3, then curve down to row 2 */}
              <path d="M 50 50 L 150 50" />
              <path d="M 150 50 L 250 50" />
              <path d="M 250 50 Q 280 50 280 100 Q 280 150 250 150" />
              {/* Row 2 (right→left): card 4 → 5 → 6 */}
              <path d="M 250 150 L 150 150" />
              <path d="M 150 150 L 50 150" />
            </g>
            <g fill="var(--brand-ink)" opacity="0.55">
              <circle cx="50" cy="50" r="2.2" />
              <circle cx="150" cy="50" r="2.2" />
              <circle cx="250" cy="50" r="2.2" />
              <circle cx="250" cy="150" r="2.2" />
              <circle cx="150" cy="150" r="2.2" />
              <circle cx="50" cy="150" r="2.2" />
            </g>
          </svg>

          <div className="relative z-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PHASES.map((p) => (
              <Link
                key={p.id}
                to="/playbook/phase/$id"
                params={{ id: p.id }}
                className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-6 transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand-gold)] hover:shadow-elegant"
              >
                <div
                  aria-hidden
                  className="absolute -top-8 -right-4 font-display font-bold text-[150px] leading-none opacity-55 transition-opacity group-hover:opacity-80"
                  style={{ color: `var(${p.colorVar}-deep)` }}
                >
                  {p.number}
                </div>
                <p className="eyebrow relative" style={{ color: `var(${p.colorVar}-deep)` }}>{p.eyebrow}</p>
                <h3
                  className="font-display relative mt-2 text-2xl font-bold tracking-tight"
                  style={{ color: `var(${p.colorVar}-deep)` }}
                >
                  {p.name}
                </h3>
                <p className="font-editorial relative mt-3 text-foreground/85">{p.lede}</p>
                <p className="relative mt-5 inline-flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase text-[color:var(--brand-magenta)] transition-transform group-hover:translate-x-1">
                  Open phase <ArrowRight className="size-3" />
                </p>
              </Link>
            ))}
          </div>
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
