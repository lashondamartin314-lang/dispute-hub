import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  XCircle,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { EditorialHeader } from "@/components/editorial-header";
import { LetterCard } from "@/components/letter-card";
import { SectionToc } from "@/components/section-toc";
import { PhaseChecklist } from "@/components/phase-checklist";
import { CreditAcademyUpsell } from "@/components/credit-academy-upsell";
import { PhaseReveal, PhaseRevealItem } from "@/components/phase-reveal";
import { PHASES, PHASES_BY_ID } from "@/data/phases";
import { lettersForPhase, LETTERS_BY_ID } from "@/data/letters";
import type { PhaseId } from "@/data/letters";

const PHASE_IDS: PhaseId[] = [
  "prepare",
  "validate",
  "clean-identity",
  "dispute-bureaus",
  "challenge-furnishers",
  "escalate",
];

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
      <section
        className="relative overflow-hidden border-b border-border"
        style={{ background: hero }}
      >
        <div className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
          <EditorialHeader
            eyebrow={phase.eyebrow}
            numeral={phase.number}
            numeralColor={`var(${phase.colorVar})`}
            accentColor={`var(${phase.colorVar}-deep)`}
            title={<>{phase.name}.</>}
            lede={phase.description}
          />
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-16 md:px-10 xl:grid-cols-[1fr_220px]">
        <div className="min-w-0 space-y-14">
          <section id="the-work" className="scroll-mt-24">
            <p className="eyebrow">The work, step by step</p>
            <h2 className="font-display mt-2 text-3xl font-bold leading-tight md:text-4xl">
              Inside this phase.
            </h2>
            <ol className="mt-6 space-y-6 md:space-y-7">
              {phase.steps.map((s, i) => (
                <li key={i} className="flex gap-4 md:gap-5">
                  <span
                    className="font-display inline-flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-full text-sm md:text-base font-semibold text-[color:var(--brand-cream)] shadow-sm mt-1"
                    style={{ background: `var(${phase.colorVar}-deep)` }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-2xl md:text-3xl font-bold leading-[1.15] tracking-tight text-[color:var(--brand-ink)]">
                      {s.title}
                    </h3>
                    <p
                      className="font-editorial italic mt-3 text-[17px] md:text-lg leading-relaxed text-foreground/80 border-l pl-4"
                      style={{
                        borderColor: `color-mix(in oklab, var(${phase.colorVar}-deep) 35%, transparent)`,
                      }}
                    >
                      {s.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <PhaseChecklist phase={phase} />

          {phase.teaching && (
            <section id="teach" className="scroll-mt-24">
              <p className="eyebrow" style={{ color: `var(${phase.colorVar}-deep)` }}>
                Teach me — full walkthrough
              </p>
              <h2 className="font-display mt-2 text-3xl font-bold leading-tight md:text-4xl">
                Learn this phase, end to end.
              </h2>
              <p className="font-editorial mt-3 max-w-2xl text-lg leading-relaxed text-foreground/85 md:text-xl">
                {phase.teaching.overview}
              </p>

              <div className="mt-8 space-y-8">
                {phase.teaching.modules.map((m, i) => (
                  <article
                    key={i}
                    id={`module-${i + 1}`}
                    className="scroll-mt-24 rounded-2xl border-2 bg-card p-6 shadow-card md:p-8"
                    style={{
                      borderColor: `color-mix(in oklab, var(${phase.colorVar}) 35%, transparent)`,
                      background: `linear-gradient(180deg, color-mix(in oklab, var(${phase.colorVar}-soft) 30%, var(--card)) 0%, var(--card) 100%)`,
                    }}
                  >
                    <header className="flex items-start gap-4">
                      <span
                        aria-hidden
                        className="font-display inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-bold text-[color:var(--brand-cream)] md:h-14 md:w-14 md:text-xl"
                        style={{ background: `var(${phase.colorVar}-deep)` }}
                      >
                        <BookOpen className="size-5 md:size-6" />
                      </span>
                      <div>
                        <p className="eyebrow" style={{ color: `var(${phase.colorVar}-deep)` }}>
                          {m.eyebrow}
                        </p>
                        <h3 className="font-display mt-1 text-2xl font-bold leading-tight text-[color:var(--brand-ink)] md:text-[28px]">
                          {m.title}
                        </h3>
                      </div>
                    </header>

                    {m.intro && (
                      <p className="font-editorial mt-5 text-lg leading-relaxed text-foreground/90">
                        {m.intro}
                      </p>
                    )}

                    {m.walkthrough && m.walkthrough.length > 0 && (
                      <ol className="mt-6 space-y-3">
                        {m.walkthrough.map((w, j) => (
                          <li
                            key={j}
                            className="flex gap-4 rounded-xl border border-border/60 bg-card p-4"
                          >
                            <span
                              className="font-mono inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[color:var(--brand-cream)]"
                              style={{ background: `var(${phase.colorVar})` }}
                            >
                              {j + 1}
                            </span>
                            <div className="min-w-0">
                              <p className="font-bold text-[color:var(--brand-ink)]">{w.step}</p>
                              <p className="mt-1 text-foreground/80 leading-relaxed">{w.detail}</p>
                            </div>
                          </li>
                        ))}
                      </ol>
                    )}

                    {(m.include || m.exclude) && (
                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {m.include && (
                          <div
                            className="rounded-xl border-2 p-5"
                            style={{
                              borderColor:
                                "color-mix(in oklab, var(--brand-emerald, #2f7a4f) 40%, transparent)",
                              background:
                                "color-mix(in oklab, var(--brand-emerald, #2f7a4f) 6%, var(--card))",
                            }}
                          >
                            <p
                              className="eyebrow flex items-center gap-2"
                              style={{ color: "var(--brand-emerald, #2f7a4f)" }}
                            >
                              <CheckCircle2 className="size-4" /> Include / Do
                            </p>
                            <ul className="mt-3 space-y-2 text-sm">
                              {m.include.map((it, k) => (
                                <li key={k} className="flex gap-2">
                                  <CheckCircle2
                                    className="mt-0.5 size-4 shrink-0"
                                    style={{ color: "var(--brand-emerald, #2f7a4f)" }}
                                  />
                                  <span className="text-foreground/85">{it}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {m.exclude && (
                          <div
                            className="rounded-xl border-2 p-5"
                            style={{
                              borderColor:
                                "color-mix(in oklab, var(--brand-magenta-deep, #9b1c5b) 40%, transparent)",
                              background:
                                "color-mix(in oklab, var(--brand-magenta-deep, #9b1c5b) 6%, var(--card))",
                            }}
                          >
                            <p
                              className="eyebrow flex items-center gap-2"
                              style={{ color: "var(--brand-magenta-deep, #9b1c5b)" }}
                            >
                              <XCircle className="size-4" /> Exclude / Avoid
                            </p>
                            <ul className="mt-3 space-y-2 text-sm">
                              {m.exclude.map((it, k) => (
                                <li key={k} className="flex gap-2">
                                  <XCircle
                                    className="mt-0.5 size-4 shrink-0"
                                    style={{ color: "var(--brand-magenta-deep, #9b1c5b)" }}
                                  />
                                  <span className="text-foreground/85">{it}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {m.example && (
                      <div
                        className="mt-5 rounded-xl border-l-4 bg-muted/40 p-4"
                        style={{ borderColor: `var(${phase.colorVar}-deep)` }}
                      >
                        <p
                          className="eyebrow flex items-center gap-2"
                          style={{ color: `var(${phase.colorVar}-deep)` }}
                        >
                          <Sparkles className="size-3.5" /> Example
                        </p>
                        <p className="font-editorial mt-1.5 text-foreground/90 leading-relaxed">
                          {m.example}
                        </p>
                      </div>
                    )}

                    {m.tip && (
                      <div
                        className="mt-5 flex gap-3 rounded-xl p-4"
                        style={{
                          background: "color-mix(in oklab, var(--brand-gold) 16%, transparent)",
                        }}
                      >
                        <Lightbulb className="mt-0.5 size-5 shrink-0 text-[color:var(--brand-gold-deep)]" />
                        <p className="text-sm leading-relaxed text-[color:var(--brand-ink)]">
                          <strong className="text-[color:var(--brand-gold-deep)]">
                            Pro tip ·{" "}
                          </strong>
                          {m.tip}
                        </p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {letters.length > 0 && (
            <PhaseReveal
              id="letters"
              eyebrow="The letters in this phase"
              title="Templates · click to reveal."
              count={letters.length}
              accentColor={`var(${phase.colorVar}-deep)`}
              defaultOpen={false}
            >
              <p className="font-editorial mb-6 max-w-2xl text-lg leading-relaxed text-foreground/85 md:text-xl">
                Each letter opens the Google Doc template in a new tab. "Use template" forces a copy
                into your own Drive; "Preview" opens read-only.
              </p>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                {letters.map((l) => (
                  <PhaseRevealItem key={l.id}>
                    <div id={l.id} className="scroll-mt-24">
                      <LetterCard id={l.id} />
                    </div>
                  </PhaseRevealItem>
                ))}
              </div>
            </PhaseReveal>
          )}

          <CreditAcademyUpsell accentColor={`var(${phase.colorVar}-deep)`} />
        </div>

        <aside className="hidden xl:block">
          <SectionToc
            label="On this page"
            accentColor={`var(${phase.colorVar}-deep)`}
            items={[
              { id: "the-work", label: "The work" },
              { id: "checklist", label: "Phase checklist" },
              ...(phase.teaching ? [{ id: "teach", label: "Teach me" }] : []),
              ...(phase.teaching?.modules.map((m, i) => ({
                id: `module-${i + 1}`,
                label: m.title,
              })) ?? []),
              ...(letters.length > 0 ? [{ id: "letters", label: "Letters" }] : []),
              ...letters.map((l) => ({
                id: l.id,
                label: `${l.id} · ${LETTERS_BY_ID[l.id].title}`,
              })),
              { id: "academy", label: "Credit Academy" },
            ]}
          />
        </aside>
      </div>

      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 border-t border-border px-6 py-10 md:px-10">
        {prev ? (
          <Link
            to="/playbook/phase/$id"
            params={{ id: prev.id }}
            className="group flex items-center gap-3 text-sm"
          >
            <ArrowLeft className="size-4" />
            <div>
              <p className="eyebrow">Previous</p>
              <p className="font-display text-lg group-hover:text-[color:var(--brand-magenta)]">
                P{prev.number} · {prev.name}
              </p>
            </div>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            to="/playbook/phase/$id"
            params={{ id: next.id }}
            className="group flex items-center gap-3 text-right text-sm"
          >
            <div>
              <p className="eyebrow">Next</p>
              <p className="font-display text-lg group-hover:text-[color:var(--brand-magenta)]">
                P{next.number} · {next.name}
              </p>
            </div>
            <ArrowRight className="size-4" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </div>
  );
}
