import { createFileRoute } from "@tanstack/react-router";
import { EditorialHeader } from "@/components/editorial-header";
import { Ref } from "@/components/ref";
import { LetterChip } from "@/components/letter-chip";
import { SectionToc } from "@/components/section-toc";
import { Squiggle } from "@/components/squiggle";
import { PHASES } from "@/data/phases";

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

        <section id="account-router" className="space-y-8 scroll-mt-24">
          <EditorialHeader
            eyebrow="The Strategy · Document 3 of 3"
            numeral="03"
            numeralColor="var(--brand-navy)"
            title={<>The Account <em className="font-editorial text-accent-grad">Router</em>.</>}
            lede="Which path each account takes. Routing decides which letters you send."
          />
          <Squiggle variant="swoop" color="var(--brand-magenta)" />
          <div className="space-y-4">
            {[
              { t: "Recent collector contact (≤30 days)", r: "Validation route", c: "Send L01 first. Most disputes resolve here without ever needing Phase 4.", chips: ["L01", "L02", "L03"] as const },
              { t: "Wrong personal info or mixed file", r: "Identity route", c: "Phase 3 first. Clean the foundation before disputing anything else.", chips: ["L05", "L06", "L08"] as const },
              { t: "Inaccurate tradeline, no recent contact", r: "Bureau dispute route", c: "Skip to Phase 4. Five-round bureau campaign on the inaccurate item.", chips: ["L11", "L12", "L13"] as const },
              { t: "Bureau verifies but data is wrong", r: "Furnisher route", c: "Phase 5. Direct dispute with the data furnisher under §1681s-2.", chips: ["L15A", "L15B", "L16"] as const },
            ].map((r) => (
              <div key={r.t} className="rounded-xl border-2 border-border bg-card p-5 transition hover:border-[color:var(--brand-gold)]">
                <p className="eyebrow text-[color:var(--brand-gold-deep)]">{r.r}</p>
                <h4 className="font-display mt-1 text-lg font-bold text-[color:var(--brand-navy-deep)]">{r.t}</h4>
                <p className="mt-2 text-sm text-foreground/85">{r.c}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.chips.map((l) => <LetterChip key={l} id={l} variant="pill" />)}
                </div>
              </div>
            ))}
          </div>
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
