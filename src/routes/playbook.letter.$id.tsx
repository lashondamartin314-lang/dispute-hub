import { createFileRoute, notFound, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  FileText,
  Library,
  Mail,
  MapPin,
  Clock,
  ListChecks,
  ShieldAlert,
  Inbox,
  GitBranch,
  Scale,
  Check,
  X,
} from "lucide-react";
import { LETTER_GUIDES } from "@/data/letter-guides";
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
  const guide = LETTER_GUIDES[letter.id];
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
            <p
              className="text-xs font-bold uppercase tracking-[0.22em]"
              style={{ color: `var(${phase.colorVar}-deep)` }}
            >
              Letter <span className="text-[color:var(--brand-ink)]">{idxInPhase + 1}</span> of{" "}
              {phaseLetters.length} · {phase.name}
            </p>
            <nav aria-label={`Letters in ${phase.name}`} className="flex items-center gap-1.5">
              <ol className="flex flex-1 items-center gap-1.5 sm:flex-none">
                {phaseLetters.map((l, i) => {
                  const isCurrent = l.id === letter.id;
                  const isPast = i < idxInPhase;
                  const status = isCurrent ? "current" : isPast ? "completed" : "upcoming";
                  return (
                    <li key={l.id} className="flex flex-1 sm:flex-none">
                      <Link
                        to="/playbook/letter/$id"
                        params={{ id: l.id }}
                        aria-label={`Letter ${i + 1} of ${phaseLetters.length}: ${l.id} ${l.title} (${status})`}
                        aria-current={isCurrent ? "page" : undefined}
                        title={`${l.id} · ${l.title}`}
                        className="group/dot relative block h-3 w-full sm:w-10 rounded-full transition-all hover:scale-y-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                        style={{
                          background:
                            isCurrent || isPast
                              ? `var(${phase.colorVar}${isCurrent ? "-deep" : ""})`
                              : `color-mix(in oklab, var(${phase.colorVar}) 18%, var(--muted))`,
                          ["--tw-ring-color" as string]: `var(${phase.colorVar}-deep)`,
                        }}
                      >
                        {isCurrent && (
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-offset-2 ring-offset-background"
                            style={{ ["--tw-ring-color" as string]: `var(${phase.colorVar}-deep)` }}
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </nav>
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

          <div className="mt-5">
            <label htmlFor="jump-to-letter" className="sr-only">
              Jump to a letter in {phase.name}
            </label>
            <Select
              value={letter.id}
              onValueChange={(value) =>
                navigate({ to: "/playbook/letter/$id", params: { id: value as LetterId } })
              }
            >
              <SelectTrigger
                id="jump-to-letter"
                aria-label={`Jump to a letter in ${phase.name}`}
                className="h-11 w-full rounded-full border-border bg-card px-5 text-sm font-semibold text-[color:var(--brand-ink)] shadow-card focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{ ["--tw-ring-color" as string]: `var(${phase.colorVar}-deep)` }}
              >
                <SelectValue placeholder="Jump to letter…" />
              </SelectTrigger>
              <SelectContent className="max-h-[60vh]">
                {phaseLetters.map((l, i) => (
                  <SelectItem key={l.id} value={l.id} className="cursor-pointer">
                    <span className="mr-2 font-mono text-xs text-muted-foreground">{l.id}</span>
                    <span className="font-medium">{l.title}</span>
                    <span className="ml-2 text-xs text-muted-foreground">
                      ({i + 1}/{phaseLetters.length})
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          {/* SECTION 1 — Open the template (sky-tinted card with dotted texture) */}
          <section
            id="open-template"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border-2 border-[color:color-mix(in_oklab,var(--brand-sky)_55%,transparent)] p-7 shadow-card md:p-10"
            style={{
              background:
                "radial-gradient(circle at 1px 1px, color-mix(in oklab, var(--brand-sky) 22%, transparent) 1px, transparent 0) 0 0 / 14px 14px, linear-gradient(135deg, color-mix(in oklab, var(--brand-sky-soft) 60%, var(--card)), var(--card))",
            }}
          >
            <span
              aria-hidden
              className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-50 blur-2xl"
              style={{ background: "var(--brand-sky)" }}
            />
            <p
              className="eyebrow relative"
              style={{ color: "color-mix(in oklab, var(--brand-sky) 30%, var(--brand-ink))" }}
            >
              01 · Open the template
            </p>
            <h2 className="font-display relative mt-3 text-3xl font-bold leading-tight text-[color:var(--brand-ink)] md:text-4xl">
              Two ways in.
            </h2>
            <p className="font-editorial relative mt-4 text-lg leading-relaxed text-foreground/85 md:text-xl">
              <strong className="font-semibold">"Use template"</strong> creates your own copy in
              Google Drive — that's the working version you edit and send.{" "}
              <strong className="font-semibold">"Preview"</strong> opens read-only so you can read
              it before committing.
            </p>
            <div className="relative mt-7 flex flex-wrap gap-3">
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

          {/* SECTION 2 — Send checklist (peach card with diagonal stripes texture + corner ribbon) */}
          <section
            id="send-checklist"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border-2 border-[color:color-mix(in_oklab,var(--brand-gold)_55%,transparent)] p-7 shadow-card md:p-10"
            style={{
              background:
                "repeating-linear-gradient(135deg, transparent 0 14px, color-mix(in oklab, var(--brand-gold) 8%, transparent) 14px 15px), linear-gradient(180deg, color-mix(in oklab, var(--brand-peach) 38%, var(--card)), color-mix(in oklab, var(--brand-peach) 18%, var(--card)))",
            }}
          >
            <span
              aria-hidden
              className="absolute -right-2 top-6 select-none rounded-l-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--brand-cream)] shadow-md"
              style={{ background: "var(--brand-gold-deep)" }}
            >
              Critical
            </span>
            <p className="eyebrow text-[color:var(--brand-gold-deep)]">02 · Send checklist</p>
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
                <li
                  key={s}
                  className="flex items-baseline gap-3 text-base leading-relaxed md:text-lg"
                >
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

          {/* SECTION 2.5 — WHO + WHERE (recipient + address, plain language) */}
          <section
            id="who-where"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border-2 border-[color:color-mix(in_oklab,var(--brand-navy)_45%,transparent)] p-7 shadow-card md:p-10"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--brand-navy-soft) 55%, var(--card)), var(--card))",
            }}
          >
            <p className="eyebrow text-[color:var(--brand-navy-deep)]">
              03 · Who this letter is for
            </p>
            <h3 className="font-display mt-3 text-2xl font-bold leading-tight text-[color:var(--brand-ink)] md:text-3xl">
              Address it correctly or it doesn't count.
            </h3>
            <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-[color:var(--brand-navy-deep)]">
                  <Mail className="size-5" />
                  <p className="eyebrow !mb-0">Recipient</p>
                </div>
                <p className="mt-2.5 text-base leading-relaxed text-foreground/90">
                  {guide.recipient}
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-[color:var(--brand-navy-deep)]">
                  <MapPin className="size-5" />
                  <p className="eyebrow !mb-0">Where to find their address</p>
                </div>
                <p className="mt-2.5 text-base leading-relaxed text-foreground/90">
                  {guide.findAddress}
                </p>
              </div>
            </div>
          </section>

          {/* SECTION 2.6 — WHEN + PREREQS (timing + prerequisites) */}
          <section
            id="when-to-send"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border-2 border-[color:color-mix(in_oklab,var(--brand-magenta)_45%,transparent)] p-7 shadow-card md:p-10"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--brand-pink) 35%, var(--card)), var(--card))",
            }}
          >
            <p className="eyebrow text-[color:var(--brand-magenta-deep)]">04 · When to send it</p>
            <h3 className="font-display mt-3 text-2xl font-bold leading-tight text-[color:var(--brand-ink)] md:text-3xl">
              Timing is a legal element, not a preference.
            </h3>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-[color:color-mix(in_oklab,var(--brand-magenta)_35%,transparent)] bg-card p-5">
              <Clock className="mt-0.5 size-5 shrink-0 text-[color:var(--brand-magenta-deep)]" />
              <p className="text-base leading-relaxed text-foreground/90">{guide.whenToSend}</p>
            </div>
            <div className="mt-6">
              <p className="eyebrow text-[color:var(--brand-ink)]/70">
                Before you mail this, ALL of the following must be true
              </p>
              <ul className="mt-3 space-y-2.5">
                {guide.prerequisites.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 text-base leading-relaxed text-foreground/90"
                  >
                    <Check className="mt-1 size-4 shrink-0 text-[color:var(--brand-magenta-deep)]" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* SECTION 2.7 — RULES (must include / must do / do NOT) */}
          <section
            id="rules"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border-2 border-[color:color-mix(in_oklab,var(--brand-gold)_55%,transparent)] p-7 shadow-card md:p-10"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--brand-cream) 80%, var(--card)), var(--card))",
            }}
          >
            <span
              aria-hidden
              className="absolute -right-2 top-6 select-none rounded-l-full px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-[color:var(--brand-cream)] shadow-md"
              style={{ background: "var(--brand-magenta-deep)" }}
            >
              Hard rules
            </span>
            <p className="eyebrow text-[color:var(--brand-gold-deep)]">
              05 · Rules &amp; watch-outs
            </p>
            <h3 className="font-display mt-3 text-2xl font-bold leading-tight text-[color:var(--brand-ink)] md:text-3xl">
              Skip any of these and the letter loses its teeth.
            </h3>

            <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
              {/* Must include */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center gap-2 text-[color:var(--brand-navy-deep)]">
                  <Inbox className="size-5" />
                  <p className="eyebrow !mb-0">Must include in the envelope</p>
                </div>
                <ul className="mt-3 space-y-2.5">
                  {guide.mustInclude.map((m) => (
                    <li
                      key={m}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--brand-navy-deep)]" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Must do */}
              <div
                className="rounded-xl border-2 p-5"
                style={{
                  borderColor: "color-mix(in oklab, var(--brand-magenta) 40%, transparent)",
                  background: "color-mix(in oklab, var(--brand-pink) 30%, var(--card))",
                }}
              >
                <div className="flex items-center gap-2 text-[color:var(--brand-magenta-deep)]">
                  <ListChecks className="size-5" />
                  <p className="eyebrow !mb-0">Must do</p>
                </div>
                <ul className="mt-3 space-y-2.5">
                  {guide.mustDo.map((m) => (
                    <li
                      key={m}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90"
                    >
                      <Check className="mt-0.5 size-4 shrink-0 text-[color:var(--brand-magenta-deep)]" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Do NOT */}
              <div
                className="rounded-xl border-2 p-5"
                style={{
                  borderColor: "color-mix(in oklab, #b91c1c 35%, transparent)",
                  background: "color-mix(in oklab, #fee2e2 60%, var(--card))",
                }}
              >
                <div className="flex items-center gap-2 text-[color:#991b1b]">
                  <ShieldAlert className="size-5" />
                  <p className="eyebrow !mb-0 !text-[color:#991b1b]">Do NOT — common mistakes</p>
                </div>
                <ul className="mt-3 space-y-2.5">
                  {guide.doNot.map((m) => (
                    <li
                      key={m}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-foreground/90"
                    >
                      <X className="mt-0.5 size-4 shrink-0 text-[color:#991b1b]" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* SECTION 2.8 — WHAT TO EXPECT BACK + DECISION TREE */}
          <section
            id="what-happens-next"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border-2 p-7 shadow-card md:p-10"
            style={{
              borderColor: `color-mix(in oklab, var(${phase.colorVar}) 50%, transparent)`,
              background: `linear-gradient(180deg, color-mix(in oklab, var(${phase.colorVar}-soft) 55%, var(--card)), var(--card))`,
            }}
          >
            <p className="eyebrow" style={{ color: `var(${phase.colorVar}-deep)` }}>
              06 · What happens next
            </p>
            <h3 className="font-display mt-3 text-2xl font-bold leading-tight text-[color:var(--brand-ink)] md:text-3xl">
              Decision tree — exactly which letter follows.
            </h3>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-border bg-card p-5">
              <Inbox
                className="mt-0.5 size-5 shrink-0"
                style={{ color: `var(${phase.colorVar}-deep)` }}
              />
              <div>
                <p className="eyebrow !mb-1.5 text-[color:var(--brand-ink)]/70">
                  What to expect back
                </p>
                <p className="text-base leading-relaxed text-foreground/90">{guide.expect}</p>
              </div>
            </div>

            <ol className="mt-6 space-y-3">
              {guide.nextStep.map((n, i) => {
                const linked = n.letterId ? LETTERS_BY_ID[n.letterId] : null;
                return (
                  <li key={i} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex items-start gap-3">
                      <span
                        className="font-display mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[color:var(--brand-cream)]"
                        style={{ background: `var(${phase.colorVar}-deep)` }}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--brand-ink)]/65">
                          IF {n.condition}
                        </p>
                        <p className="font-display mt-1.5 text-lg font-bold leading-snug text-[color:var(--brand-ink)]">
                          <GitBranch className="-mt-1 mr-1.5 inline size-4 text-[color:var(--brand-ink)]/55" />
                          THEN {n.action}
                        </p>
                        {linked && (
                          <Link
                            to="/playbook/letter/$id"
                            params={{ id: linked.id }}
                            className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--brand-cream)] transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                            style={{ background: `var(${phase.colorVar}-deep)` }}
                          >
                            Open {linked.id} · {linked.title} <ArrowRight className="size-3.5" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-6 flex items-start gap-3 rounded-xl border border-dashed border-border/70 bg-card/60 p-4">
              <Scale className="mt-0.5 size-5 shrink-0 text-[color:var(--brand-ink)]/55" />
              <p className="text-sm leading-relaxed text-foreground/80">
                <span className="font-bold text-[color:var(--brand-ink)]">Legal basis: </span>
                {guide.legalBasis}
              </p>
            </div>
          </section>

          {/* SECTION 3 — Related phase (phase-tinted with grid texture + tape badge) */}
          <section
            id="related-phase"
            className="scroll-mt-24 relative overflow-hidden rounded-2xl border-2 p-7 shadow-card md:p-10"
            style={{
              borderColor: `color-mix(in oklab, var(${phase.colorVar}) 55%, transparent)`,
              background: `
                linear-gradient(color-mix(in oklab, var(${phase.colorVar}) 6%, transparent) 1px, transparent 1px) 0 0 / 22px 22px,
                linear-gradient(90deg, color-mix(in oklab, var(${phase.colorVar}) 6%, transparent) 1px, transparent 1px) 0 0 / 22px 22px,
                color-mix(in oklab, var(${phase.colorVar}-soft) 42%, var(--card))
              `,
            }}
          >
            <span
              aria-hidden
              className="absolute -left-6 top-5 -rotate-6 select-none rounded-sm px-4 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[color:var(--brand-cream)] shadow-md"
              style={{ background: `var(${phase.colorVar}-deep)` }}
            >
              Phase
            </span>
            <p className="eyebrow ml-12" style={{ color: `var(${phase.colorVar}-deep)` }}>
              07 · {phase.eyebrow}
            </p>
            <h2
              className="font-display mt-3 text-3xl font-bold leading-tight md:text-4xl"
              style={{ color: `var(${phase.colorVar}-deep)` }}
            >
              This letter belongs to {phase.name}.
            </h2>
            <p className="font-editorial mt-4 text-lg leading-relaxed text-foreground/85 md:text-xl">
              {phase.lede}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/playbook/phase/$id"
                params={{ id: phase.id }}
                className="group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-[color:var(--brand-cream)] transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                style={{ background: `var(${phase.colorVar}-deep)` }}
              >
                Open the {phase.shortName} phase{" "}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
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
            <section
              id="continue"
              className="scroll-mt-24 rounded-2xl border border-dashed border-border/70 p-5 md:p-6"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in oklab, var(--brand-stone) 30%, var(--card)), var(--card))",
              }}
            >
              <p className="eyebrow mb-4 text-[color:var(--brand-ink)]/55">08 · Continue reading</p>
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
                ) : (
                  <span />
                )}
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

        <aside>
          <SectionToc
            label="On this page"
            accentColor={`var(${phase.colorVar}-deep)`}
            items={[
              { id: "open-template", label: "Open the template" },
              { id: "send-checklist", label: "Send checklist" },
              { id: "who-where", label: "Who it's for" },
              { id: "when-to-send", label: "When to send" },
              { id: "rules", label: "Rules & watch-outs" },
              { id: "what-happens-next", label: "What happens next" },
              { id: "related-phase", label: `${phase.name} phase` },
              ...(prevLetter || nextLetter ? [{ id: "continue", label: "Continue reading" }] : []),
            ]}
          />
        </aside>
      </div>
    </div>
  );
}
