import type { PhaseId } from "./letters";

export interface Phase {
  id: PhaseId;
  number: 1 | 2 | 3 | 4 | 5 | 6;
  name: string;
  shortName: string;
  eyebrow: string;
  lede: string;
  description: string;
  /** Number of distinct letter rounds belonging to this phase (0 = strategy phase, no letters) */
  rounds: 0 | 1 | 2 | 3 | 4;
  steps: { title: string; description: string }[];
  /** CSS variable token for the phase color (--phase-N) */
  colorVar: string;
}

export const PHASES: Phase[] = [
  {
    id: "prepare",
    number: 1,
    name: "Prepare",
    shortName: "Prepare",
    eyebrow: "Phase 1 · Foundation",
    lede: "Pull reports. Audit personal info. Sort accounts. Pick a route.",
    description:
      "Before a single letter goes out, you build a complete picture of your file. Every dispute that follows depends on the work done here.",
    rounds: 0,
    steps: [
      { title: "Pull all three bureau reports", description: "Equifax, Experian, TransUnion — same day, same source. AnnualCreditReport.com is the official channel." },
      { title: "Audit personal information", description: "List every name variation, address, employer, phone, and SSN tied to your file." },
      { title: "Categorize each account", description: "Open · Closed in good standing · Closed with damage · Collections · Public records · Inquiries." },
      { title: "Choose your route", description: "Validation-first, accuracy-first, or hybrid. The Account Router decides this for you." },
    ],
    colorVar: "--phase-1",
  },
  {
    id: "validate",
    number: 2,
    name: "Validate",
    shortName: "Validate",
    eyebrow: "Phase 2 · Validation",
    lede: "Fresh-collection validation under FDCPA §1692g. Force proof before paying.",
    description:
      "Within 30 days of first contact from a collector, you can demand validation. They must produce documentation or stop collection — and stop reporting.",
    rounds: 1,
    steps: [
      { title: "Identify validation-eligible debts", description: "Recent collector contact within 30 days, or any time you've never received Mini-Miranda." },
      { title: "Send L01 by certified mail", description: "Return receipt requested. The signature card is your proof of service." },
      { title: "Wait the 30-day window", description: "Track the date received. No response by day 31 triggers L02." },
      { title: "Evaluate the response", description: "Inadequate paper triggers L03. Errors identified pivots to L04 and forward into Phase 4." },
    ],
    colorVar: "--phase-2",
  },
  {
    id: "clean-identity",
    number: 3,
    name: "Clean Identity",
    shortName: "Clean ID",
    eyebrow: "Phase 3 · Identity",
    lede: "Personal information cleanup. Foundation work for everything that follows.",
    description:
      "Wrong addresses, mixed files, and outdated employers create the cracks furnishers exploit. Clean the personal data first or every later dispute fights uphill.",
    rounds: 1,
    steps: [
      { title: "Source the corrections at the creditor (L05)", description: "Update the data at its origin so it can't repopulate the bureau file." },
      { title: "File the bureau PI dispute (L06)", description: "Strip the bureau's copy of every variation that isn't strictly accurate." },
      { title: "Escalate non-investigations (L07)", description: "If the bureau closes without investigating, cite §1681i and reopen." },
      { title: "Mixed-file or theft? L08 / L10", description: "Separate intermingled files and anchor SSN/DOB before continuing." },
    ],
    colorVar: "--phase-3",
  },
  {
    id: "dispute-bureaus",
    number: 4,
    name: "Dispute Bureaus",
    shortName: "Dispute",
    eyebrow: "Phase 4 · Bureau Rounds",
    lede: "The five-round letter campaign to Equifax, Experian, and TransUnion.",
    description:
      "This is where most of the work lives. Each round tightens the legal pressure: accuracy dispute, MOV demand, intent to complain, final notice, and escalation.",
    rounds: 4,
    steps: [
      { title: "Round 1 — Accuracy dispute (L11)", description: "Open the investigation on every inaccurate item, all three bureaus." },
      { title: "Round 2 — Procedure exposure (L12)", description: "Demand method of verification. The §1681i(7) request most furnishers cannot answer." },
      { title: "Round 3 — Intent to file (L13)", description: "Formal notice that CFPB and State AG complaints are the next step." },
      { title: "Round 4 — Final notice (L14)", description: "Document everything for Phase 6 escalation. The paper trail is the case." },
    ],
    colorVar: "--phase-4",
  },
  {
    id: "challenge-furnishers",
    number: 5,
    name: "Challenge Furnishers",
    shortName: "Furnishers",
    eyebrow: "Phase 5 · Direct attack",
    lede: "Letters direct to the data furnisher. Skip the bureau as middleman.",
    description:
      "When the bureaus stall behind \"verified,\" the furnisher itself is liable under §1681s-2. Direct disputes force a different investigation entirely.",
    rounds: 4,
    steps: [
      { title: "Direct furnisher dispute (L15A/B)", description: "Collection agency or original creditor, depending on who's reporting." },
      { title: "Bureau companion (L15C)", description: "Mirror to the bureau. Both ends investigate concurrently." },
      { title: "Inconsistency attack (L16)", description: "Three bureaus, three versions. Use the gaps as your wedge." },
      { title: "Advanced & specialty (L17–L19)", description: "Charge-off violations, pay-for-delete, unauthorized inquiries." },
    ],
    colorVar: "--phase-5",
  },
  {
    id: "escalate",
    number: 6,
    name: "Escalate",
    shortName: "Escalate",
    eyebrow: "Phase 6 · Authority",
    lede: "CFPB, FTC, State AG, attorney. A different lever, not a round.",
    description:
      "When the in-system process is exhausted, you escalate to the regulators. Most cases are resolved within 15 days of a CFPB complaint posting.",
    rounds: 0,
    steps: [
      { title: "File the CFPB complaint", description: "Six-step submission with documentation pulled from your round tracker." },
      { title: "Mirror to State AG", description: "State enforcement adds local pressure the bureaus respond to faster." },
      { title: "FTC report for theft / fraud", description: "IdentityTheft.gov for the federal record and recovery plan." },
      { title: "Consider FCRA counsel", description: "If statutory damages are on the table, an FCRA attorney works on contingency." },
    ],
    colorVar: "--phase-6",
  },
];

export const PHASES_BY_ID: Record<PhaseId, Phase> = PHASES.reduce(
  (acc, p) => { acc[p.id] = p; return acc; },
  {} as Record<PhaseId, Phase>,
);
