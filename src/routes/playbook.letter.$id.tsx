import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText, Library } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { EditorialHeader } from "@/components/editorial-header";
import { LETTERS, LETTERS_BY_ID, type LetterId } from "@/data/letters";
import { PHASES_BY_ID } from "@/data/phases";

const ALL_IDS = LETTERS.map((l) => l.id) as LetterId[];

export const Route = createFileRoute("/playbook/letter/$id")({
  head: ({ params }) => {
    const l = LETTERS_BY_ID[params.id as LetterId];
    if (!l) return { meta: [{ title: "Letter · Dispute Playbook" }] };
    return {
      meta: [
        { title: `${l.id} · ${l.title} — Dispute Playbook` },
        { name: "description", content: l.lede },
      ],
    };
  },
  loader: ({ params }) => {
    if (!ALL_IDS.includes(params.id as LetterId)) throw notFound();
    return null;
  },
  component: LetterDetail,
});

function LetterDetail() {
  const { id } = Route.useParams();
  const letter = LETTERS_BY_ID[id as LetterId];
  const phase = PHASES_BY_ID[letter.phaseId];

  const phaseLetters = LETTERS.filter((l) => l.phaseId === letter.phaseId);
  const idxInPhase = phaseLetters.findIndex((l) => l.id === letter.id);
  const prevLetter = idxInPhase > 0 ? phaseLetters[idxInPhase - 1] : null;
  const nextLetter = idxInPhase < phaseLetters.length - 1 ? phaseLetters[idxInPhase + 1] : null;

  const hero = `radial-gradient(900px 480px at 12% -10%, color-mix(in oklab, var(${phase.colorVar}) 30%, transparent), transparent 60%), var(--brand-cream)`;

  return (
    <div>
      <section className="relative border-b border-border" style={{ background: hero }}>
        <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-20">
          <Link to="/playbook/phase/$id" params={{ id: letter.phaseId }} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3" /> Back to {phase.name}
          </Link>
          <div className="mt-6">
            <EditorialHeader
              eyebrow={`${phase.eyebrow} · Letter ${letter.id}`}
              numeral={letter.id.replace("L", "")}
              numeralColor={`var(${phase.colorVar})`}
              title={letter.title}
              lede={letter.lede}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-12 md:px-10 space-y-10">
        <div className="rounded-2xl border border-border bg-card p-6 md:p-8 shadow-elegant">
          <p className="eyebrow">Open the template</p>
          <h2 className="font-display mt-2 text-2xl">Two ways in.</h2>
          <p className="mt-2 text-foreground/75">"Use template" creates your own copy in Google Drive — that's the working version you edit and send. "Preview" opens read-only so you can read it before committing.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={letter.copyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-foreground hover:bg-[color:var(--brand-magenta-deep)]">
              Use template <ArrowUpRight className="size-4" />
            </a>
            <a href={letter.viewUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-medium hover:border-[color:var(--brand-gold)]">
              <FileText className="size-4" /> Preview only
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-[color:color-mix(in_oklab,var(--brand-peach)_22%,var(--card))] p-6 md:p-8">
          <p className="eyebrow text-[color:var(--brand-gold-deep)]">Send checklist</p>
          <ul className="mt-4 space-y-2 text-foreground/85">
            {[
              "Make a copy in your own Drive (don't edit the master).",
              "Replace every bracketed [field] with your actual information.",
              "Print, sign, and date.",
              "Send by USPS Certified Mail · Return Receipt Requested.",
              "Log the date sent + tracking number on your Round Tracker.",
            ].map((s) => (
              <li key={s} className="flex gap-2"><span className="text-[color:var(--brand-magenta)]">✓</span><span>{s}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-16 md:px-10 md:pb-24">
        <div
          className="rounded-2xl border-2 p-6 md:p-8"
          style={{
            borderColor: `color-mix(in oklab, var(${phase.colorVar}) 35%, transparent)`,
            background: `color-mix(in oklab, var(${phase.colorVar}-soft) 30%, var(--card))`,
          }}
        >
          <p className="eyebrow" style={{ color: `var(${phase.colorVar}-deep)` }}>{phase.eyebrow}</p>
          <h2 className="font-display mt-2 text-2xl font-bold" style={{ color: `var(${phase.colorVar}-deep)` }}>
            This letter belongs to {phase.name}.
          </h2>
          <p className="font-editorial mt-2 text-foreground/80">{phase.lede}</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/playbook/phase/$id"
              params={{ id: phase.id }}
              className="group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--brand-cream)] transition-all hover:-translate-y-0.5 hover:shadow-elegant"
              style={{ background: `var(${phase.colorVar}-deep)` }}
            >
              Open the {phase.shortName} phase <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/letters"
              hash={phase.id}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--brand-ink)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand-gold)] hover:shadow-sm"
            >
              <Library className="size-3.5" /> All letters in this phase
            </Link>
          </div>
        </div>

        {(prevLetter || nextLetter) && (
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {prevLetter ? (
              <Link
                to="/playbook/letter/$id"
                params={{ id: prevLetter.id }}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 no-underline transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand-gold)] hover:shadow-sm"
              >
                <ArrowLeft className="size-4 shrink-0 text-[color:var(--brand-ink)]/50 transition-transform group-hover:-translate-x-0.5" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--brand-ink)]/55">Previous · {prevLetter.id}</p>
                  <p className="font-display mt-1 truncate text-sm font-bold text-[color:var(--brand-ink)]">{prevLetter.title}</p>
                </div>
              </Link>
            ) : <span />}
            {nextLetter && (
              <Link
                to="/playbook/letter/$id"
                params={{ id: nextLetter.id }}
                className="group flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-right no-underline transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand-gold)] hover:shadow-sm sm:col-start-2"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[color:var(--brand-ink)]/55">Next · {nextLetter.id}</p>
                  <p className="font-display mt-1 truncate text-sm font-bold text-[color:var(--brand-ink)]">{nextLetter.title}</p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-[color:var(--brand-ink)]/50 transition-transform group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
