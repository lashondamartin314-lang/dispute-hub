import { createFileRoute } from "@tanstack/react-router";
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
              <header className="mb-6 flex items-baseline gap-4 border-b border-border pb-4">
                <span className="font-display text-4xl" style={{ color: `var(${p.colorVar}-deep)` }}>P{p.number}</span>
                <div>
                  <p className="eyebrow" style={{ color: `var(${p.colorVar}-deep)` }}>{p.eyebrow}</p>
                  <h2 className="font-display text-2xl md:text-3xl">{p.name} · {letters.length} letter{letters.length > 1 ? "s" : ""}</h2>
                </div>
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
