import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { EditorialHeader } from "@/components/editorial-header";
import { LetterCard } from "@/components/letter-card";
import { PHASES } from "@/data/phases";
import { lettersForPhase } from "@/data/letters";

export const Route = createFileRoute("/letters")({
  head: () => ({
    meta: [
      { title: "Letter Library · The Dispute Playbook" },
      { name: "description", content: "All 19 dispute letter templates, grouped by phase. Click to open the Google Doc and force-copy into your Drive." },
    ],
  }),
  component: LettersPage,
});

function LettersPage() {
  const phasesWithLetters = PHASES.filter((p) => lettersForPhase(p.id).length > 0);
  return (
    <div className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <EditorialHeader
        eyebrow="The library · 19 templates"
        numeral="L"
        numeralColor="var(--brand-magenta)"
        title="Every letter, one click away."
        lede="Each card opens the Google Doc template in a new tab. The force-copy URL drops it straight into your Drive — your master stays clean."
      />

      <div className="mt-16 space-y-16">
        {phasesWithLetters.map((p) => {
          const letters = lettersForPhase(p.id);
          return (
            <section key={p.id} id={p.id} className="scroll-mt-20">
              <header className="mb-6 flex flex-wrap items-baseline gap-4 border-b border-border pb-4">
                <span className="font-display text-4xl" style={{ color: `var(${p.colorVar}-deep)` }}>P{p.number}</span>
                <div className="flex-1 min-w-0">
                  <p className="eyebrow" style={{ color: `var(${p.colorVar}-deep)` }}>{p.eyebrow}</p>
                  <h2 className="font-display text-2xl md:text-3xl">{p.name} · {letters.length} letter{letters.length > 1 ? "s" : ""}</h2>
                </div>
                <Link
                  to="/playbook/phase/$id"
                  params={{ id: p.id }}
                  className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] transition-all hover:-translate-y-0.5 hover:border-[color:var(${p.colorVar})] hover:shadow-sm"
                  style={{ color: `var(${p.colorVar}-deep)` }}
                >
                  View full phase <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </header>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {letters.map((l) => (<LetterCard key={l.id} id={l.id} />))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
