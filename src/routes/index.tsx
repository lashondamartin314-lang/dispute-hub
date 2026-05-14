import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, ChevronsDownUp, ChevronsUpDown, FileText, Library, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { EditorialHeader } from "@/components/editorial-header";
import { ResourceTile } from "@/components/resource-tile";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { PINNED_RESOURCES } from "@/data/resources";
import { PHASES } from "@/data/phases";
import { lettersForPhase } from "@/data/letters";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Dispute Playbook Hub · Credit Academy" },
      { name: "description", content: "Your interactive companion to the Credit Academy Dispute Playbook — letter library, phase guides, and quick-access resources." },
    ],
  }),
  component: HubPage,
});

const ALL_PHASE_IDS = PHASES.map((p) => p.id);

function HubPage() {
  const [openPhases, setOpenPhases] = useState<string[]>([]);
  const phaseRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Hash deep-linking: /#validate auto-expands matching phase and scrolls to it
  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncFromHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id || !ALL_PHASE_IDS.includes(id as (typeof ALL_PHASE_IDS)[number])) return;
      setOpenPhases((prev) => (prev.includes(id) ? prev : [...prev, id]));
      // Wait for the accordion to start expanding before scrolling
      requestAnimationFrame(() => {
        phaseRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, []);

  const allOpen = openPhases.length === ALL_PHASE_IDS.length;
  const toggleAll = () => setOpenPhases(allOpen ? [] : [...ALL_PHASE_IDS]);

  return (
    <div className="relative">
      <div aria-hidden className="bg-halo animate-halo-drift pointer-events-none absolute inset-x-0 top-0 h-[600px] opacity-90" />

      <section className="relative mx-auto max-w-6xl px-6 pt-16 pb-16 md:px-10 md:pt-24 md:pb-24">
        <EditorialHeader
          eyebrow="Credit Academy · 2026 Edition"
          numeral="✶"
          numeralColor="var(--brand-gold)"
          title={<>Your <em className="font-editorial bg-gradient-to-r from-[color:var(--brand-gold)] via-[color:var(--brand-magenta)] to-[color:var(--brand-violet)] bg-clip-text text-transparent not-italic">Dispute</em> Playbook, made <em className="font-script text-[color:var(--brand-magenta)] not-italic">interactive</em>.</>}
          lede={<>A six-phase, letter-by-letter dispute system built on FCRA and FDCPA law. Every phase has a purpose. Every letter has a reason. Walk through the full process with the law behind every move.</>}
        />

        <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
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

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <style>{`
          @keyframes journey-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.9)} }
          @keyframes journey-ripple { 0%{transform:scale(1);opacity:.4} 100%{transform:scale(2.6);opacity:0} }
          .journey-dot { animation: journey-pulse 1.6s ease-in-out infinite; }
          .journey-ripple { animation: journey-ripple 2.2s cubic-bezier(0,0,.2,1) infinite; }
          .journey-arrow-path { stroke-dasharray: 320; stroke-dashoffset: 0; transition: stroke-dashoffset .8s cubic-bezier(.65,0,.35,1); }
          .group:hover .journey-arrow-path { stroke-dashoffset: 12; }
          .phase-accordion-content[data-state="open"] { animation: phase-accordion-down 380ms cubic-bezier(0.32,0.72,0,1); }
          .phase-accordion-content[data-state="closed"] { animation: phase-accordion-up 280ms cubic-bezier(0.32,0.72,0,1); }
          @keyframes phase-accordion-down { from { height: 0; opacity: 0; } to { height: var(--radix-accordion-content-height); opacity: 1; } }
          @keyframes phase-accordion-up { from { height: var(--radix-accordion-content-height); opacity: 1; } to { height: 0; opacity: 0; } }
        `}</style>
        <div className="mb-10 flex flex-col gap-10 border-b border-[color:var(--brand-ink)]/10 pb-10 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <span className="relative flex items-center justify-center">
                <span className="journey-ripple absolute h-3.5 w-3.5 rounded-full bg-[color:var(--brand-ink)]/30" />
                <span className="journey-dot relative h-2 w-2 rounded-full bg-[color:var(--brand-ink)]" />
              </span>
              <p className="text-[11px] font-bold uppercase tracking-[0.4em] text-[color:var(--brand-ink)]/60">The six phases</p>
            </div>
            <h2
              className="font-display text-[color:var(--brand-ink)] text-3xl font-bold leading-[1.05] tracking-tight md:text-4xl lg:text-5xl"
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

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[color:var(--brand-ink)]/55">
            {openPhases.length} of {ALL_PHASE_IDS.length} expanded
          </p>
          <button
            type="button"
            onClick={toggleAll}
            aria-pressed={allOpen}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-[color:var(--brand-ink)]/15 bg-card px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--brand-ink)] transition-all hover:border-[color:var(--brand-gold)] hover:shadow-sm active:scale-[0.98] sm:w-auto sm:py-2 md:hover:-translate-y-0.5"
          >
            {allOpen ? <ChevronsDownUp className="size-4" /> : <ChevronsUpDown className="size-4" />}
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>

        <Accordion
          type="multiple"
          value={openPhases}
          onValueChange={setOpenPhases}
          className="relative z-10 flex flex-col gap-4"
        >
          {PHASES.map((p) => {
            const letters = lettersForPhase(p.id);
            return (
              <AccordionItem
                key={p.id}
                value={p.id}
                ref={(el) => { phaseRefs.current[p.id] = el; }}
                id={p.id}
                style={{
                  ["--phase-color" as string]: `var(${p.colorVar})`,
                  ["--phase-deep" as string]: `var(${p.colorVar}-deep)`,
                  ["--phase-soft" as string]: `var(${p.colorVar}-soft)`,
                } as React.CSSProperties}
                className="group relative scroll-mt-24 overflow-hidden rounded-2xl border-2 border-border bg-card transition-[border-color,box-shadow,background-color] duration-300 hover:border-[var(--phase-color)] data-[state=open]:border-[var(--phase-color)] data-[state=open]:bg-[color-mix(in_oklab,var(--phase-soft)_28%,var(--card))] data-[state=open]:shadow-elegant"
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-8 -right-4 font-display font-bold text-[150px] leading-none opacity-55 transition-opacity duration-300 group-hover:opacity-80 group-data-[state=open]:opacity-90"
                  style={{ color: `var(${p.colorVar}-deep)` }}
                >
                  {p.number}
                </div>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-0 w-1 origin-top scale-y-0 transition-transform duration-300 group-data-[state=open]:scale-y-100"
                  style={{ background: `var(${p.colorVar})` }}
                />
                <AccordionTrigger className="relative px-6 py-6 text-left no-underline hover:no-underline [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-[color:var(--brand-ink)]/60 [&>svg]:transition-transform [&>svg]:duration-300">
                  <div className="flex-1 pr-6">
                    <p className="eyebrow" style={{ color: `var(${p.colorVar}-deep)` }}>{p.eyebrow}</p>
                    <h3
                      className="font-display mt-2 text-xl font-bold leading-[1.15] tracking-tight md:text-2xl"
                      style={{ color: `var(${p.colorVar}-deep)` }}
                    >
                      {p.name}
                    </h3>
                    <p className="font-editorial mt-2 text-foreground/85">{p.lede}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="phase-accordion-content relative px-6 pt-0 pb-6">
                  <div className="grid gap-8 border-t border-[color:var(--brand-ink)]/10 pt-6 md:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[color:var(--brand-ink)]/60">
                        The work
                      </p>
                      <ol className="mt-4 space-y-4">
                        {p.steps.map((s, i) => (
                          <li key={s.title} className="flex gap-3">
                            <span
                              className="font-display mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[color:var(--brand-cream)]"
                              style={{ background: `var(${p.colorVar}-deep)` }}
                            >
                              {i + 1}
                            </span>
                            <div>
                              <p className="font-display text-sm font-bold text-[color:var(--brand-ink)]">{s.title}</p>
                              <p className="font-editorial mt-1 text-sm text-foreground/80">{s.description}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[color:var(--brand-ink)]/60">
                        {letters.length > 0 ? `Letter${letters.length === 1 ? "" : "s"} for this phase` : "No letters · strategy phase"}
                      </p>
                      {letters.length > 0 ? (
                        <ul className="mt-4 space-y-2">
                          {letters.map((l) => (
                            <li key={l.id}>
                              <Link
                                to="/playbook/letter/$id"
                                params={{ id: l.id }}
                                className="group/letter flex items-start gap-3 rounded-lg border border-border bg-background/60 p-3 no-underline transition-all hover:-translate-y-px hover:border-[color:var(--brand-gold)] hover:shadow-sm"
                              >
                                <span
                                  className="font-display inline-flex h-7 min-w-[2.75rem] shrink-0 items-center justify-center rounded-md px-2 text-xs font-bold text-[color:var(--brand-cream)]"
                                  style={{ background: `var(${p.colorVar}-deep)` }}
                                >
                                  {l.id}
                                </span>
                                <div className="flex-1">
                                  <p className="font-display text-sm font-bold text-[color:var(--brand-ink)]">{l.title}</p>
                                  <p className="font-editorial mt-0.5 text-xs text-foreground/75">{l.lede}</p>
                                </div>
                                <FileText className="mt-0.5 size-4 shrink-0 text-[color:var(--brand-ink)]/40 transition-colors group-hover/letter:text-[color:var(--brand-magenta)]" />
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="font-editorial mt-4 text-sm text-foreground/75">
                          {p.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--brand-ink)]/10 pt-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[color:var(--brand-ink)]/60">
                      {p.rounds > 0 ? `${p.rounds} round${p.rounds === 1 ? "" : "s"}` : "Strategy · no rounds"}
                    </p>
                    <Link
                      to="/playbook/phase/$id"
                      params={{ id: p.id }}
                      className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wide uppercase text-[color:var(--brand-magenta)] transition-transform hover:translate-x-1"
                    >
                      Open full phase <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 md:px-10 md:pb-32">
        <div className="mb-10 md:mb-14">
          <p className="eyebrow">Quick access</p>
          <h2 className="font-display mt-2 text-3xl font-bold leading-[1.05] tracking-tight md:text-4xl lg:text-5xl">External tools you'll need.</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PINNED_RESOURCES.map((r) => (<ResourceTile key={r.id} resource={r} />))}
        </div>
      </section>
    </div>
  );
}
