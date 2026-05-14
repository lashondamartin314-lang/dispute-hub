import { createFileRoute, notFound, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight, FileText, Library } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditorialHeader } from "@/components/editorial-header";
import { SectionToc } from "@/components/section-toc";
import { LETTERS, LETTERS_BY_ID, type LetterId } from "@/data/letters";
import { PHASES_BY_ID } from "@/data/phases";
import { rememberLetter } from "@/hooks/use-last-letter";

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
  const navigate = useNavigate();

  const phaseLetters = LETTERS.filter((l) => l.phaseId === letter.phaseId);
  const idxInPhase = phaseLetters.findIndex((l) => l.id === letter.id);
  const prevLetter = idxInPhase > 0 ? phaseLetters[idxInPhase - 1] : null;
  const nextLetter = idxInPhase < phaseLetters.length - 1 ? phaseLetters[idxInPhase + 1] : null;

  useEffect(() => {
    rememberLetter(letter.id);
  }, [letter.id]);

  const hero = `radial-gradient(900px 480px at 12% -10%, color-mix(in oklab, var(${phase.colorVar}) 30%, transparent), transparent 60%), var(--brand-cream)`;

  return (
    <div>
      <section className="relative border-b border-border" style={{ background: hero }}>
        <div className="mx-auto max-w-3xl px-6 py-14 md:px-10 md:py-20">
          <Breadcrumb>
            <BreadcrumbList className="text-sm md:text-base">
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="text-foreground/70 hover:text-foreground">
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild className="text-foreground/70 hover:text-foreground">
                  <Link to="/playbook">Playbook</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink
                  asChild
                  className="font-semibold hover:text-foreground"
                  style={{ color: `var(${phase.colorVar}-deep)` }}
                >
                  <Link to="/playbook/phase/$id" params={{ id: letter.phaseId }}>
                    {phase.name}
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="font-semibold text-[color:var(--brand-ink)]">
                  Letter {letter.id}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.22em]" style={{ color: `var(${phase.colorVar}-deep)` }}>
              Letter <span className="text-[color:var(--brand-ink)]">{idxInPhase + 1}</span> of {phaseLetters.length} · {phase.name}
            </p>
            <div className="flex items-center gap-1.5" aria-hidden>
              {phaseLetters.map((l, i) => {
                const isCurrent = l.id === letter.id;
                const isPast = i < idxInPhase;
                return (
                  <Link
                    key={l.id}
                    to="/playbook/letter/$id"
                    params={{ id: l.id }}
                    aria-label={`${l.id}: ${l.title}`}
                    title={`${l.id} · ${l.title}`}
                    className="group/dot relative h-2.5 flex-1 sm:w-10 sm:flex-none rounded-full transition-all hover:scale-y-150"
                    style={{
                      background: isCurrent || isPast
                        ? `var(${phase.colorVar}${isCurrent ? "-deep" : ""})`
                        : `color-mix(in oklab, var(${phase.colorVar}) 18%, var(--muted))`,
                    }}
                  />
                );
              })}
            </div>
          </div>

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
                width: `${((idxInPhase + 1) / phaseLetters.length) * 100}%`,
                background: `linear-gradient(90deg, var(${phase.colorVar}), var(${phase.colorVar}-deep))`,
              }}
            />
          </div>

          <div className="mt-10">
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

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-14 md:px-10 md:py-20 xl:grid-cols-[1fr_220px]">
        <div className="min-w-0 max-w-3xl space-y-12">
          <section id="open-template" className="scroll-mt-24 rounded-2xl border border-border bg-card p-7 shadow-card md:p-10">
            <p className="eyebrow">Open the template</p>
            <h2 className="font-display mt-3 text-3xl font-bold leading-tight text-[color:var(--brand-ink)] md:text-4xl">
              Two ways in.
            </h2>
            <p className="font-editorial mt-4 text-lg leading-relaxed text-foreground/85 md:text-xl">
              <strong className="font-semibold">"Use template"</strong> creates your own copy in Google Drive — that's the working version you edit and send.{" "}
              <strong className="font-semibold">"Preview"</strong> opens read-only so you can read it before committing.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={letter.copyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-semibold text-accent-foreground transition-all hover:-translate-y-0.5 hover:bg-[color:var(--brand-magenta-deep)] hover:shadow-elegant"
              >
                Use template <ArrowUpRight className="size-5 text-[color:var(--brand-sky)]" />
              </a>
              <a
                href={letter.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-7 py-3.5 text-base font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand-gold)]"
              >
                <FileText className="size-5" /> Preview only
              </a>
            </div>
          </section>

          <section id="send-checklist" className="scroll-mt-24 rounded-2xl border-2 border-[color:color-mix(in_oklab,var(--brand-gold)_40%,transparent)] bg-[color:color-mix(in_oklab,var(--brand-peach)_28%,var(--card))] p-7 shadow-card md:p-10">
            <p className="eyebrow text-[color:var(--brand-gold-deep)]">Send checklist</p>
            <h3 className="font-display mt-3 text-2xl font-bold leading-tight text-[color:var(--brand-ink)] md:text-3xl">
              Five steps before it ships.
            </h3>
            <ul className="mt-6 space-y-3.5 text-foreground/90">
              {[
                "Make a copy in your own Drive (don't edit the master).",
                "Replace every bracketed [field] with your actual information.",
                "Print, sign, and date.",
                "Send by USPS Certified Mail · Return Receipt Requested.",
                "Log the date sent + tracking number on your Round Tracker.",
              ].map((s, i) => (
                <li key={s} className="flex items-baseline gap-3 text-base leading-relaxed md:text-lg">
                  <span
                    className="font-display inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[color:var(--brand-cream)]"
                    style={{ background: "var(--brand-gold-deep)" }}
                  >
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </section>

          <section
            id="related-phase"
            className="scroll-mt-24 rounded-2xl border-2 p-7 shadow-card md:p-10"
            style={{
              borderColor: `color-mix(in oklab, var(${phase.colorVar}) 45%, transparent)`,
              background: `color-mix(in oklab, var(${phase.colorVar}-soft) 38%, var(--card))`,
            }}
          >
            <p className="eyebrow" style={{ color: `var(${phase.colorVar}-deep)` }}>{phase.eyebrow}</p>
            <h2 className="font-display mt-3 text-3xl font-bold leading-tight md:text-4xl" style={{ color: `var(${phase.colorVar}-deep)` }}>
              This letter belongs to {phase.name}.
            </h2>
            <p className="font-editorial mt-4 text-lg leading-relaxed text-foreground/85 md:text-xl">{phase.lede}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/playbook/phase/$id"
                params={{ id: phase.id }}
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--brand-cream)] transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                style={{ background: `var(${phase.colorVar}-deep)` }}
              >
                Open the {phase.shortName} phase <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/letters"
                hash={phase.id}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--brand-ink)] transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand-gold)] hover:shadow-sm"
              >
                <Library className="size-4" /> All letters in this phase
              </Link>
            </div>
          </section>

          {(prevLetter || nextLetter) && (
            <section id="continue" className="scroll-mt-24">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {prevLetter ? (
                  <Link
                    to="/playbook/letter/$id"
                    params={{ id: prevLetter.id }}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 no-underline shadow-card transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand-gold)] hover:shadow-elegant"
                  >
                    <ArrowLeft className="size-5 shrink-0 text-[color:var(--brand-ink)]/60 transition-transform group-hover:-translate-x-0.5" />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--brand-ink)]/65">
                        Previous · {prevLetter.id}
                      </p>
                      <p className="font-display mt-1.5 truncate text-lg font-bold leading-snug text-[color:var(--brand-ink)] md:text-xl">
                        {prevLetter.title}
                      </p>
                    </div>
                  </Link>
                ) : <span />}
                {nextLetter && (
                  <Link
                    to="/playbook/letter/$id"
                    params={{ id: nextLetter.id }}
                    className="group flex items-center gap-4 rounded-xl border border-border bg-card p-5 text-right no-underline shadow-card transition-all hover:-translate-y-0.5 hover:border-[color:var(--brand-gold)] hover:shadow-elegant sm:col-start-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold uppercase tracking-[0.22em] text-[color:var(--brand-ink)]/65">
                        Next · {nextLetter.id}
                      </p>
                      <p className="font-display mt-1.5 truncate text-lg font-bold leading-snug text-[color:var(--brand-ink)] md:text-xl">
                        {nextLetter.title}
                      </p>
                    </div>
                    <ArrowRight className="size-5 shrink-0 text-[color:var(--brand-ink)]/60 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
              </div>
            </section>
          )}
        </div>

        <aside className="hidden xl:block">
          <SectionToc
            label="On this page"
            items={[
              { id: "open-template", label: "Open the template" },
              { id: "send-checklist", label: "Send checklist" },
              { id: "related-phase", label: `${phase.name} phase` },
              ...(prevLetter || nextLetter ? [{ id: "continue", label: "Continue reading" }] : []),
            ]}
          />
        </aside>
      </div>
    </div>
  );
}
