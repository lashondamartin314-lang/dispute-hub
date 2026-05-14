import { createFileRoute, Link } from "@tanstack/react-router";
import {
  PhoneCall, UserSquare, FileWarning, Building2, ArrowRight,
  Compass, ListChecks, AlertTriangle, Clock, Sparkles,
} from "lucide-react";
import { EditorialHeader } from "@/components/editorial-header";
import { Ref } from "@/components/ref";
import { LetterChip } from "@/components/letter-chip";
import { SectionToc } from "@/components/section-toc";
import { Squiggle } from "@/components/squiggle";
import { PHASES } from "@/data/phases";
import { LETTERS_BY_ID } from "@/data/letters";

export const Route = createFileRoute("/playbook/strategy")({
  head: () => ({
    meta: [
      { title: "Strategy · The Dispute Playbook" },
      { name: "description", content: "The Phase Map, the 5-Round Strategy, and the Account Router — the strategic backbone of the Dispute Playbook." },
    ],
  }),
  component: StrategyPage,
});

const ROUNDS = [
  { id: "round-1", n: "R1", t: "Open the dispute", b: "First contact. Identify the inaccurate item, request investigation. The clock starts.", letters: ["L11", "L15A"] as const },
  { id: "round-2", n: "R2", t: "Cite the law", b: "MOV demand. Force the bureau or furnisher to describe how they actually verified.", letters: ["L12"] as const },
  { id: "round-3", n: "R3", t: "Direct demand", b: "Stronger language, escalating tone, explicit consequences referenced.", letters: ["L13"] as const },
  { id: "round-4", n: "R4", t: "Violation notice", b: "Document the violations on the record. This becomes Phase 6 evidence.", letters: ["L14"] as const },
  { id: "round-5", n: "R5", t: "Final notice", b: "Last in-system step before regulator escalation.", letters: ["L19"] as const },
];

const TOC = [
  { id: "phase-map", label: "01 · The Phase Map" },
  { id: "round-strategy", label: "02 · The 5-Round Strategy" },
  { id: "account-router", label: "03 · The Account Router" },
  { id: "round-tracker", label: "Round Tracker" },
];

function StrategyPage() {
  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-16 md:px-10 md:py-24 xl:grid-cols-[220px_minmax(0,1fr)]">
      <SectionToc items={TOC} />
      <div className="max-w-3xl space-y-24">
        <section id="phase-map" className="space-y-8 scroll-mt-24">
          <EditorialHeader
            eyebrow="The Strategy · Document 1 of 3"
            numeral="01"
            numeralColor="var(--brand-gold)"
            title={<>The Phase <em className="font-editorial text-accent-grad">Map</em>.</>}
            lede="Six phases, in order. The work changes inside each one."
          />
          <Squiggle variant="wave" color="var(--brand-magenta)" />
          <div className="space-y-3">
            {PHASES.map((p) => (
              <div key={p.id} className="rounded-xl border-2 border-border bg-card p-5 transition hover:border-[color:var(--brand-gold)]">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-3xl font-bold" style={{ color: `var(${p.colorVar}-deep)` }}>P{p.number}</span>
                  <h3 className="font-display text-xl font-bold" style={{ color: `var(${p.colorVar}-deep)` }}>{p.name}</h3>
                </div>
                <p className="mt-2 text-foreground/85">{p.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="round-strategy" className="space-y-8 scroll-mt-24">
          <EditorialHeader
            eyebrow="The Strategy · Document 2 of 3"
            numeral="02"
            numeralColor="var(--brand-magenta)"
            title={<>The 5-Round <em className="font-editorial text-accent-grad">Strategy</em>.</>}
            lede="Five letters per account, escalating. Each round increases legal pressure."
          />
          <Squiggle variant="arrow" color="var(--brand-gold)" />
          <div className="space-y-4">
            {ROUNDS.map((r) => (
              <div key={r.id} id={r.id} className="scroll-mt-24 rounded-xl border-2 border-border bg-card p-5 transition hover:border-[color:var(--brand-magenta)]">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs font-bold text-[color:var(--brand-magenta-deep)]">{r.n}</span>
                  <h3 className="font-display text-xl font-bold text-[color:var(--brand-navy-deep)]">{r.t}</h3>
                </div>
                <p className="mt-2 text-foreground/85">{r.b}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.letters.map((l) => <LetterChip key={l} id={l} variant="pill" />)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="account-router" className="space-y-10 scroll-mt-24">
          <EditorialHeader
            eyebrow="The Strategy · Document 3 of 3 — START HERE for every account"
            numeral="03"
            numeralColor="var(--brand-navy)"
            title={<>The Account <em className="font-editorial text-accent-grad">Router</em>.</>}
            lede="Before you write a single letter, route every account into ONE of four paths below. The route decides which letters you send, in which order, and why. Get the route wrong and the rest of the work fights uphill."
          />
          <Squiggle variant="swoop" color="var(--brand-magenta)" />

          {/* How to use the router — explicit instructions */}
          <div
            className="rounded-2xl border-2 border-[color:var(--brand-navy-deep)] bg-card p-6 shadow-elegant md:p-8"
            style={{
              background:
                "linear-gradient(180deg, color-mix(in oklab, var(--brand-navy-soft) 55%, var(--card)), var(--card))",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[color:var(--brand-cream)]"
                style={{ background: "var(--brand-navy-deep)" }}
              >
                <Compass className="size-5" />
              </span>
              <p className="eyebrow !mb-0 text-[color:var(--brand-navy-deep)]">How to use the router</p>
            </div>
            <ol className="mt-5 space-y-3 text-base leading-relaxed text-foreground/90 md:text-lg">
              <li className="flex items-start gap-3">
                <span className="font-display mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[color:var(--brand-cream)]" style={{ background: "var(--brand-navy-deep)" }}>1</span>
                <span>Take ONE account from your credit report at a time. Do not batch — each account gets its own route decision.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-display mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[color:var(--brand-cream)]" style={{ background: "var(--brand-navy-deep)" }}>2</span>
                <span>Read the four routes below in order. Stop at the FIRST route whose &ldquo;Use this route when&rdquo; statement matches your account. Routes are listed in priority order on purpose.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-display mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[color:var(--brand-cream)]" style={{ background: "var(--brand-navy-deep)" }}>3</span>
                <span>Send the letters in that route in the exact numerical order shown. Do not skip ahead — the legal weight of each later letter depends on the paper trail of the earlier ones.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-display mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold text-[color:var(--brand-cream)]" style={{ background: "var(--brand-navy-deep)" }}>4</span>
                <span>If an account fits more than one route, run them in the order shown (Identity always first if any personal-info issue exists, otherwise the lowest-numbered matching route).</span>
              </li>
            </ol>
            <p className="mt-5 flex items-start gap-2 rounded-lg border border-dashed border-[color:var(--brand-gold)] bg-[color:color-mix(in_oklab,var(--brand-gold)_8%,var(--card))] p-3 text-sm text-foreground/85">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[color:var(--brand-gold-deep)]" />
              <span><strong className="font-bold">Identity route runs first, always.</strong> If your file has any wrong personal information, clean it before any other route — otherwise furnishers will reject every later dispute on identity mismatch.</span>
            </p>
          </div>

          {/* The four routes */}
          {(() => {
            const ROUTES = [
              {
                key: "identity",
                priority: "Route 1 of 4 — Highest priority",
                priorityNote: "Run this BEFORE any other route if it applies.",
                Icon: UserSquare,
                colorVar: "--phase-3",
                routeName: "The Identity Route",
                useWhen:
                  "Your credit report shows wrong personal info: a misspelled name, an address you never lived at, an old employer, the wrong DOB, the wrong SSN, OR you suspect mixed-file (someone else's data on your report) or identity theft.",
                why:
                  "Furnishers and bureaus use personal data to match you to accounts. If their copy of YOU is wrong, they will reject every dispute that follows on the grounds that they 'cannot verify the consumer.' Cleaning identity is non-negotiable foundation work.",
                phaseLabel: "Phase 3 · Clean Identity",
                phaseId: "clean-identity" as const,
                sequence: ["L05", "L06", "L07", "L08", "L09", "L10"] as const,
                expect: "30–60 days for full cleanup. Most personal-info corrections are quick because the data is easy to verify.",
              },
              {
                key: "validation",
                priority: "Route 2 of 4 — Use only inside the 30-day window",
                priorityNote: "Strict deadline. Miss day 30 and this route closes; switch to Route 3.",
                Icon: PhoneCall,
                colorVar: "--phase-2",
                routeName: "The Validation Route",
                useWhen:
                  "A debt collector (NOT the original lender) contacted you in writing within the last 30 days about a debt — even if the debt is genuinely yours. The dunning letter you received is your timer; the postmark is Day 1.",
                why:
                  "FDCPA §1692g gives you a one-time right to demand the collector prove the debt before they can keep collecting OR keep reporting. Roughly 30–40% of collectors never respond and the tradeline must come off. This is the cheapest, fastest route — but only if you are inside the window.",
                phaseLabel: "Phase 2 · Validate",
                phaseId: "validate" as const,
                sequence: ["L01", "L02", "L03", "L04"] as const,
                expect: "60–90 days end-to-end. Often resolves without ever entering Phase 4.",
              },
              {
                key: "bureau",
                priority: "Route 3 of 4 — The default workhorse",
                priorityNote: "Use this for any inaccurate item you can name a specific factual error on.",
                Icon: FileWarning,
                colorVar: "--phase-4",
                routeName: "The Bureau Dispute Route",
                useWhen:
                  "An account on your credit report has a specific factual error you can point to (wrong balance, wrong dates, wrong status, wrong owner) AND you are outside the 30-day validation window OR the account never came from a collector. Identity is already clean.",
                why:
                  "FCRA §1681i forces the bureaus to investigate within 30 days. The five-round letter sequence escalates the legal weight of each follow-up: accuracy → procedure exposure → intent to file → final notice → CFPB. Most disputes are resolved by Round 2 or 3.",
                phaseLabel: "Phase 4 · Dispute Bureaus",
                phaseId: "dispute-bureaus" as const,
                sequence: ["L11", "L12", "L13", "L14"] as const,
                expect: "90–150 days for the full 4-round cycle, with 30-day pauses between rounds.",
              },
              {
                key: "furnisher",
                priority: "Route 4 of 4 — When the bureaus stall",
                priorityNote: "Use after Route 3 returns 'verified' on data you know is wrong, OR run in parallel.",
                Icon: Building2,
                colorVar: "--phase-5",
                routeName: "The Furnisher Route",
                useWhen:
                  "The bureau has 'verified' an item you know is wrong, OR you want to attack the data at its source in parallel with Route 3. The data furnisher (the collector or original creditor reporting the account) is directly liable under FCRA §1681s-2.",
                why:
                  "Bureaus often rubber-stamp 'verified' by sending a 2-digit eOSCAR code to the furnisher who answers 'yes.' Going direct under §1681s-2(b) forces a real investigation by the furnisher AND opens an independent statutory-damages path the bureau-only route does not.",
                phaseLabel: "Phase 5 · Challenge Furnishers",
                phaseId: "challenge-furnishers" as const,
                sequence: ["L15A", "L15B", "L15C", "L16", "L17", "L18", "L19"] as const,
                expect: "60–120 days. Many furnishers quietly delete rather than respond.",
              },
            ];

            return (
              <div className="space-y-6">
                {ROUTES.map((r) => {
                  const Icon = r.Icon;
                  return (
                    <article
                      key={r.key}
                      className="relative overflow-hidden rounded-2xl border-2 p-6 shadow-card transition hover:shadow-elegant md:p-8"
                      style={{
                        borderColor: `color-mix(in oklab, var(${r.colorVar}) 60%, transparent)`,
                        background: `linear-gradient(180deg, color-mix(in oklab, var(${r.colorVar}-soft) 55%, var(--card)), var(--card))`,
                      }}
                    >
                      {/* Priority ribbon */}
                      <span
                        aria-hidden
                        className="absolute -right-2 top-5 select-none rounded-l-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-cream)] shadow-md"
                        style={{ background: `var(${r.colorVar}-deep)` }}
                      >
                        {r.priority}
                      </span>

                      <div className="flex items-start gap-4">
                        <span
                          className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-[color:var(--brand-cream)] shadow-md"
                          style={{ background: `var(${r.colorVar}-deep)` }}
                        >
                          <Icon className="size-7" />
                        </span>
                        <div className="min-w-0">
                          <p className="eyebrow !mb-1.5" style={{ color: `var(${r.colorVar}-deep)` }}>
                            {r.phaseLabel}
                          </p>
                          <h3
                            className="font-display text-2xl font-bold leading-tight md:text-3xl"
                            style={{ color: `var(${r.colorVar}-deep)` }}
                          >
                            {r.routeName}
                          </h3>
                          <p className="mt-2 text-sm font-semibold text-[color:var(--brand-ink)]/70">
                            {r.priorityNote}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div className="rounded-xl border border-border bg-card p-5">
                          <div className="flex items-center gap-2" style={{ color: `var(${r.colorVar}-deep)` }}>
                            <ListChecks className="size-4" />
                            <p className="eyebrow !mb-0">Use this route when</p>
                          </div>
                          <p className="mt-2.5 text-base leading-relaxed text-foreground/90">{r.useWhen}</p>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-5">
                          <div className="flex items-center gap-2" style={{ color: `var(${r.colorVar}-deep)` }}>
                            <Sparkles className="size-4" />
                            <p className="eyebrow !mb-0">Why this route works</p>
                          </div>
                          <p className="mt-2.5 text-base leading-relaxed text-foreground/90">{r.why}</p>
                        </div>
                      </div>

                      {/* Letter sequence — explicit ordered chain */}
                      <div className="mt-6">
                        <div className="flex items-center gap-2" style={{ color: `var(${r.colorVar}-deep)` }}>
                          <p className="eyebrow !mb-0">Send these letters, in this exact order</p>
                        </div>
                        <ol className="mt-3 space-y-2.5">
                          {r.sequence.map((id, i) => {
                            const l = LETTERS_BY_ID[id];
                            return (
                              <li key={id}>
                                <Link
                                  to="/playbook/letter/$id"
                                  params={{ id: l.id }}
                                  className="group flex items-start gap-3 rounded-xl border border-border bg-card p-3.5 no-underline transition-all hover:-translate-y-0.5 hover:shadow-sm"
                                  style={{
                                    borderColor: `color-mix(in oklab, var(${r.colorVar}) 35%, var(--border))`,
                                  }}
                                >
                                  <span
                                    className="font-display inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold text-[color:var(--brand-cream)]"
                                    style={{ background: `var(${r.colorVar}-deep)` }}
                                  >
                                    {i + 1}
                                  </span>
                                  <div className="min-w-0 flex-1">
                                    <p className="flex flex-wrap items-baseline gap-2">
                                      <span className="font-mono text-xs font-bold" style={{ color: `var(${r.colorVar}-deep)` }}>
                                        {l.id}
                                      </span>
                                      <span className="font-display text-base font-bold leading-snug text-[color:var(--brand-ink)]">
                                        {l.title}
                                      </span>
                                    </p>
                                    <p className="mt-1 text-sm text-foreground/75">{l.lede}</p>
                                  </div>
                                  <ArrowRight className="mt-1 size-4 shrink-0 text-[color:var(--brand-ink)]/45 transition-transform group-hover:translate-x-0.5" />
                                </Link>
                              </li>
                            );
                          })}
                        </ol>
                      </div>

                      {/* Expect + open phase */}
                      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-dashed border-border/70 bg-card/60 p-4">
                        <p className="flex items-start gap-2 text-sm text-foreground/85">
                          <Clock className="mt-0.5 size-4 shrink-0" style={{ color: `var(${r.colorVar}-deep)` }} />
                          <span><strong className="font-bold text-[color:var(--brand-ink)]">Expect: </strong>{r.expect}</span>
                        </p>
                        <Link
                          to="/playbook/phase/$id"
                          params={{ id: r.phaseId }}
                          className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-[color:var(--brand-cream)] transition-all hover:-translate-y-0.5 hover:shadow-elegant"
                          style={{ background: `var(${r.colorVar}-deep)` }}
                        >
                          Open the phase <ArrowRight className="size-3.5" />
                        </Link>
                      </div>

                      {/* Tiny chip strip for visual reference */}
                      <div className="mt-4 flex flex-wrap gap-2">
                        {r.sequence.map((id) => <LetterChip key={id} id={id} variant="pill" />)}
                      </div>
                    </article>
                  );
                })}
              </div>
            );
          })()}
        </section>


        <section id="round-tracker" className="space-y-6 scroll-mt-24 rounded-2xl border border-border bg-[color:color-mix(in_oklab,var(--brand-navy)_92%,var(--brand-violet))] p-8 text-[color:var(--brand-cream)]">
          <p className="eyebrow text-[color:var(--brand-gold)]">Reference · Round Tracker</p>
          <h2 className="font-display text-3xl font-bold">Track every <em className="font-editorial text-[color:var(--brand-gold)]">round</em>.</h2>
          <p className="font-editorial text-lg opacity-95">
            Date sent. Date received. Outcome. Next move. Log every back-and-forth on the Round Tracker. The paper trail is the case if <Ref to="phase-escalate" className="!text-[color:var(--brand-gold)]">Phase 6</Ref> escalation becomes necessary.
          </p>
          <p className="text-sm opacity-80">An interactive Round Tracker is on the roadmap — for now, print the kit's tracker page or use a spreadsheet.</p>
        </section>
      </div>
    </div>
  );
}
