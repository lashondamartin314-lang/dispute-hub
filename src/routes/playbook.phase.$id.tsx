import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EditorialHeader } from "@/components/editorial-header";
import { LetterCard } from "@/components/letter-card";
import { PHASES, PHASES_BY_ID } from "@/data/phases";
import { lettersForPhase } from "@/data/letters";
import type { PhaseId } from "@/data/letters";

const PHASE_IDS: PhaseId[] = ["prepare", "validate", "clean-identity", "dispute-bureaus", "challenge-furnishers", "escalate"];

export const Route = createFileRoute("/playbook/phase/$id")({
  head: ({ params }) => {
    const phase = PHASES_BY_ID[params.id as PhaseId];
    if (!phase) return { meta: [{ title: "Phase · Dispute Playbook" }] };
    return {
      meta: [
        { title: `${phase.eyebrow} · The Dispute Playbook` },
        { name: "description", content: phase.description },
      ],
    };
  },
  loader: ({ params }) => {
    if (!PHASE_IDS.includes(params.id as PhaseId)) throw notFound();
    return null;
  },
  component: PhasePage,
});

function PhasePage() {
  const { id } = Route.useParams();
  const phase = PHASES_BY_ID[id as PhaseId];
  const letters = lettersForPhase(phase.id);
  const idx = PHASES.findIndex((p) => p.id === phase.id);
  const prev = idx > 0 ? PHASES[idx - 1] : null;
  const next = idx < PHASES.length - 1 ? PHASES[idx + 1] : null;

  const hero = `radial-gradient(900px 480px at 10% -10%, color-mix(in oklab, var(${phase.colorVar}) 35%, transparent), transparent 60%), radial-gradient(800px 420px at 100% 0%, color-mix(in oklab, var(${phase.colorVar}-soft) 70%, transparent), transparent 60%), var(--brand-cream)`;

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border" style={{ background: hero }}>
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
          <EditorialHeader
            eyebrow={phase.eyebrow}
            numeral={phase.number}
            numeralColor={`var(${phase.colorVar})`}
            title={<>{phase.name}.</>}
            lede={phase.description}
          />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10 space-y-12">
        <div>
          <p className="eyebrow">The work, step by step</p>
          <h2 className="font-display mt-2 text-3xl">Inside this phase.</h2>
          <ol className="mt-6 space-y-4">
            {phase.steps.map((s, i) => (
              <li key={i} className="flex gap-5 rounded-xl border border-border bg-card p-5">
                <span className="font-display text-3xl shrink-0 w-10 text-center" style={{ color: `var(${phase.colorVar}-deep)` }}>
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg">{s.title}</h3>
                  <p className="mt-1 text-foreground/75">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {letters.length > 0 && (
          <div>
            <p className="eyebrow">The letters in this phase</p>
            <h2 className="font-display mt-2 text-3xl">Templates · click to open.</h2>
            <p className="mt-2 text-foreground/70 max-w-2xl">Each letter opens the Google Doc template in a new tab. "Use template" forces a copy into your own Drive; "Preview" opens read-only.</p>
            <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
              {letters.map((l) => (<LetterCard key={l.id} id={l.id} />))}
            </div>
          </div>
        )}
      </section>

      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 border-t border-border px-6 py-10 md:px-10">
        {prev ? (
          <Link to="/playbook/phase/$id" params={{ id: prev.id }} className="group flex items-center gap-3 text-sm">
            <ArrowLeft className="size-4" />
            <div>
              <p className="eyebrow">Previous</p>
              <p className="font-display text-lg group-hover:text-[color:var(--brand-magenta)]">P{prev.number} · {prev.name}</p>
            </div>
          </Link>
        ) : <span />}
        {next ? (
          <Link to="/playbook/phase/$id" params={{ id: next.id }} className="group flex items-center gap-3 text-right text-sm">
            <div>
              <p className="eyebrow">Next</p>
              <p className="font-display text-lg group-hover:text-[color:var(--brand-magenta)]">P{next.number} · {next.name}</p>
            </div>
            <ArrowRight className="size-4" />
          </Link>
        ) : <span />}
      </nav>
    </div>
  );
}
