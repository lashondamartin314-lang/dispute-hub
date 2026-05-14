import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bookmark } from "lucide-react";
import { useLastLetter } from "@/hooks/use-last-letter";
import { LETTERS, LETTERS_BY_ID, type LetterId } from "@/data/letters";
import { PHASES_BY_ID } from "@/data/phases";
import { CreditAcademyUpsell } from "@/components/credit-academy-upsell";

export const Route = createFileRoute("/playbook/")({
  head: () => ({
    meta: [
      { title: "The Dispute Playbook · Cover" },
      { name: "description", content: "The cover and entry point to the six-phase, five-round Dispute Playbook." },
    ],
  }),
  component: PlaybookCover,
});

function ProgressSummary() {
  const lastId = useLastLetter();
  if (!lastId || !LETTERS_BY_ID[lastId]) return null;

  const letter = LETTERS_BY_ID[lastId];
  const phase = PHASES_BY_ID[letter.phaseId];
  const phaseLetters = LETTERS.filter((l) => l.phaseId === letter.phaseId);
  const idxInPhase = phaseLetters.findIndex((l) => l.id === letter.id);
  const pct = ((idxInPhase + 1) / phaseLetters.length) * 100;

  return (
    <aside
      aria-label="Resume your last letter"
      className="mt-12 w-full max-w-2xl rounded-2xl border-2 bg-card p-6 text-left shadow-card md:p-7"
      style={{
        borderColor: `color-mix(in oklab, var(${phase.colorVar}) 45%, transparent)`,
        background: `color-mix(in oklab, var(${phase.colorVar}-soft) 24%, var(--card))`,
      }}
    >
      <div className="flex items-start gap-4">
        <span
          aria-hidden
          className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[color:var(--brand-cream)]"
          style={{ background: `var(${phase.colorVar}-deep)` }}
        >
          <Bookmark className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="eyebrow" style={{ color: `var(${phase.colorVar}-deep)` }}>
            Pick up where you left off
          </p>
          <h2 className="font-display mt-2 text-xl font-bold leading-snug text-[color:var(--brand-ink)] md:text-2xl">
            <span className="font-mono text-base text-muted-foreground">{letter.id}</span> · {letter.title}
          </h2>
          <p className="mt-1.5 text-sm font-semibold uppercase tracking-[0.18em]" style={{ color: `var(${phase.colorVar}-deep)` }}>
            Letter {idxInPhase + 1} of {phaseLetters.length} · {phase.name}
          </p>

          <div
            className="mt-4 h-1.5 overflow-hidden rounded-full"
            style={{ background: `color-mix(in oklab, var(${phase.colorVar}) 14%, var(--muted))` }}
            role="progressbar"
            aria-valuenow={idxInPhase + 1}
            aria-valuemin={1}
            aria-valuemax={phaseLetters.length}
            aria-label={`Letter ${idxInPhase + 1} of ${phaseLetters.length} in ${phase.name}`}
          >
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${pct}%`,
                background: `linear-gradient(90deg, var(${phase.colorVar}), var(${phase.colorVar}-deep))`,
              }}
            />
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/playbook/letter/$id"
              params={{ id: letter.id as LetterId }}
              className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-[color:var(--brand-cream)] transition-all hover:-translate-y-0.5 hover:shadow-elegant"
              style={{ background: `var(${phase.colorVar}-deep)` }}
            >
              Jump back to {letter.id}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/playbook/phase/$id"
              params={{ id: phase.id }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-[color:var(--brand-ink)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand-gold)]"
            >
              Open {phase.shortName} phase
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}

function PlaybookCover() {
  return (
    <div className="relative min-h-[80vh]">
      <div aria-hidden className="bg-halo animate-halo-drift pointer-events-none absolute inset-0 opacity-90" />
      <section className="relative mx-auto flex max-w-5xl flex-col items-center px-6 py-20 text-center md:py-28">
        <p className="eyebrow text-[color:var(--brand-gold-deep)]">Field Manual · Vol. I · Members Edition</p>
        <h1 className="font-display mt-6 text-6xl leading-none text-balance md:text-8xl">
          Your <em className="font-editorial bg-gradient-to-r from-[color:var(--brand-gold)] via-[color:var(--brand-magenta)] to-[color:var(--brand-violet)] bg-clip-text text-transparent not-italic">Dispute</em>
          <br />Playbook.
        </h1>
        <p className="font-editorial mt-8 max-w-2xl text-xl text-foreground/80 text-pretty md:text-2xl">
          A complete six-phase, five-round dispute system. Built on FCRA and FDCPA law. Walk through the work, slow down where it matters, finish on the other side.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/playbook/foundation" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-navy)] px-6 py-3 text-sm font-semibold text-[color:var(--brand-cream)] hover:bg-[color:var(--brand-violet-deep)]">
            Begin · Foundation <ArrowRight className="size-4" />
          </Link>
          <Link to="/playbook/strategy" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-semibold hover:border-[color:var(--brand-gold)]">
            Strategy first
          </Link>
          <Link to="/tracker" className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-emerald,#2f7a4f)] px-6 py-3 text-sm font-semibold text-[color:var(--brand-cream)] hover:opacity-90">
            Open tracker
          </Link>
        </div>

        <ProgressSummary />

        <div className="mt-16 flex items-center gap-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span>Shonda Martin</span><span className="opacity-30">·</span>
          <span>Board-Certified Credit Educator</span><span className="opacity-30">·</span>
          <span>Edition 2026</span>
        </div>
      </section>
    </div>
  );
}
