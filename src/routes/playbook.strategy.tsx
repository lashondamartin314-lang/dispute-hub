import { createFileRoute } from "@tanstack/react-router";
import { EditorialHeader } from "@/components/editorial-header";
import { Ref } from "@/components/ref";
import { LetterChip } from "@/components/letter-chip";
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

function StrategyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24 space-y-24">
      <section id="phase-map" className="space-y-8 scroll-mt-20">
        <EditorialHeader
          eyebrow="The Strategy · Document 1 of 3"
          numeral="01"
          numeralColor="var(--brand-gold)"
          title="The Phase Map."
          lede="Six phases, in order. The work changes inside each one."
        />
        <div className="space-y-3">
          {PHASES.map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-baseline gap-4">
                <span className="font-display text-3xl" style={{ color: `var(${p.colorVar}-deep)` }}>P{p.number}</span>
                <h3 className="font-display text-xl">{p.name}</h3>
              </div>
              <p className="mt-2 text-foreground/75">{p.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="round-strategy" className="space-y-8 scroll-mt-20">
        <EditorialHeader
          eyebrow="The Strategy · Document 2 of 3"
          numeral="02"
          numeralColor="var(--brand-magenta)"
          title="The 5-Round Strategy."
          lede="Five letters per account, escalating. Each round increases legal pressure."
        />
        <div className="space-y-4">
          {ROUNDS.map((r) => (
            <div key={r.id} id={r.id} className="scroll-mt-20 rounded-xl border border-border bg-card p-5">
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-xs font-bold text-[color:var(--brand-magenta)]">{r.n}</span>
                <h3 className="font-display text-xl">{r.t}</h3>
              </div>
              <p className="mt-2 text-foreground/75">{r.b}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {r.letters.map((l) => <LetterChip key={l} id={l} variant="pill" />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="account-router" className="space-y-8 scroll-mt-20">
        <EditorialHeader
          eyebrow="The Strategy · Document 3 of 3"
          numeral="03"
          numeralColor="var(--brand-navy)"
          title="The Account Router."
          lede="Which path each account takes. Routing decides which letters you send."
        />
        <div className="space-y-4">
          {[
            { t: "Recent collector contact (≤30 days)", r: "Validation route", c: "Send L01 first. Most disputes resolve here without ever needing Phase 4.", chips: ["L01", "L02", "L03"] as const },
            { t: "Wrong personal info or mixed file", r: "Identity route", c: "Phase 3 first. Clean the foundation before disputing anything else.", chips: ["L05", "L06", "L08"] as const },
            { t: "Inaccurate tradeline, no recent contact", r: "Bureau dispute route", c: "Skip to Phase 4. Five-round bureau campaign on the inaccurate item.", chips: ["L11", "L12", "L13"] as const },
            { t: "Bureau verifies but data is wrong", r: "Furnisher route", c: "Phase 5. Direct dispute with the data furnisher under §1681s-2.", chips: ["L15A", "L15B", "L16"] as const },
          ].map((r) => (
            <div key={r.t} className="rounded-xl border border-border bg-card p-5">
              <p className="eyebrow text-[color:var(--brand-gold-deep)]">{r.r}</p>
              <h4 className="font-display mt-1 text-lg">{r.t}</h4>
              <p className="mt-2 text-sm text-foreground/75">{r.c}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {r.chips.map((l) => <LetterChip key={l} id={l} variant="pill" />)}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="round-tracker" className="space-y-6 scroll-mt-20 rounded-2xl border border-border bg-[color:color-mix(in_oklab,var(--brand-navy)_92%,var(--brand-violet))] p-8 text-[color:var(--brand-cream)]">
        <p className="eyebrow text-[color:var(--brand-gold)]">Reference · Round Tracker</p>
        <h2 className="font-display text-3xl">Track every round.</h2>
        <p className="font-editorial text-lg opacity-90">
          Date sent. Date received. Outcome. Next move. Log every back-and-forth on the Round Tracker. The paper trail is the case if <Ref to="phase-escalate" className="!text-[color:var(--brand-gold)]">Phase 6</Ref> escalation becomes necessary.
        </p>
        <p className="text-sm opacity-70">An interactive Round Tracker is on the roadmap — for now, print the kit's tracker page or use a spreadsheet.</p>
      </section>
    </div>
  );
}
