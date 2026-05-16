import type { PhaseId } from "./letters";

export interface TeachingModule {
  /** Short label above the module title (e.g. "Module 01 · Pull your reports") */
  eyebrow: string;
  title: string;
  /** Optional 1–2 sentence framing paragraph */
  intro?: string;
  /** Ordered walkthrough — the "show me how" sub-steps */
  walkthrough?: { step: string; detail: string }[];
  /** Bullet list — what BELONGS / what to keep / what to do */
  include?: string[];
  /** Bullet list — what to AVOID / common mistakes / what NOT to do */
  exclude?: string[];
  /** A worked example using realistic numbers / scenarios */
  example?: string;
  /** A short note / pro tip / legal anchor */
  tip?: string;
}

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
  /** Long-form, exhaustive teaching content for this phase */
  teaching?: {
    overview: string;
    modules: TeachingModule[];
  };
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
      {
        title: "Pull all three bureau reports",
        description:
          "Equifax, Experian, TransUnion — same day, same source. AnnualCreditReport.com is the official channel.",
      },
      {
        title: "Audit personal information",
        description:
          "List every name variation, address, employer, phone, and SSN tied to your file.",
      },
      {
        title: "Categorize each account",
        description:
          "Open · Closed in good standing · Closed with damage · Collections · Public records · Inquiries.",
      },
      {
        title: "Choose your route",
        description:
          "Validation-first, accuracy-first, or hybrid. The Account Router decides this for you.",
      },
    ],
    colorVar: "--phase-1",
    teaching: {
      overview:
        "Before you write a single letter, you have to see what they see. Most cousins skip this step and end up disputing the wrong things, in the wrong order, to the wrong people. This phase is the read-and-sort. By the end of it you will know every account on your file, why it is hurting you, and which lane it belongs in.",
      modules: [
        {
          eyebrow: "Module 01",
          title: "Pull all three reports — the right way",
          intro:
            "You need Equifax, Experian, and TransUnion. Pulled the same day. Pulled from the official source. Anything else is a guess.",
          walkthrough: [
            {
              step: "Go to AnnualCreditReport.com",
              detail:
                "This is the only federally-authorized free source. Not Credit Karma, not the bureau apps, not your bank's free score. Those are summaries — you need the full file.",
            },
            {
              step: "Choose all three bureaus in one session",
              detail:
                "If you stagger the pulls by weeks, the data shifts under you and your audit becomes inconsistent.",
            },
            {
              step: "Verify identity carefully",
              detail:
                "If a bureau locks you out, request a manual pull by mail with proof of identity (ID + utility bill). That mail-in request itself becomes part of your evidence trail.",
            },
            {
              step: "Save PDFs immediately",
              detail:
                "Date-stamp each file: equifax-2026-05-14.pdf. You will reference these every round, and the bureaus quietly change reports between pulls.",
            },
            {
              step: "Print or open side-by-side",
              detail:
                "You cannot work from one bureau at a time. Differences across the three are where most violations live.",
            },
          ],
          include: [
            "All three bureau reports from the same day",
            "Saved PDFs with date-stamped filenames",
            "A blank tracker sheet (account · bureau · status · action)",
          ],
          exclude: [
            "Credit Karma, Credit Sesame, or your bank's free score — those are simplified VantageScore reports, not your full file",
            "Score numbers in this phase — you are reading data, not reacting to a number",
            "Pulling only the bureau where the score looks worst — you need all three",
          ],
          tip: "Under the FCRA you are entitled to a free report from each bureau every 12 months, plus a free report any time you are denied credit, employment, insurance, or housing because of your file.",
        },
        {
          eyebrow: "Module 02",
          title: "Walk through the report — section by section",
          intro:
            "Every credit report has the same five sections. Read them in order. Take notes as you go. Do not jump to disputes.",
          walkthrough: [
            {
              step: "Personal information",
              detail:
                "Names, addresses, employers, phone numbers, date of birth, SSN. Any single item that is wrong, outdated, or unfamiliar gets logged for Phase 3 cleanup.",
            },
            {
              step: "Account summary",
              detail:
                "Total open accounts, total balances, oldest account, most recent account. This is your snapshot, but the detail is below.",
            },
            {
              step: "Open accounts",
              detail:
                "Each open trade line: creditor name, account number (usually last 4), open date, credit limit, current balance, payment history, status.",
            },
            {
              step: "Closed accounts & collections",
              detail:
                "Closed with positive history (keep — these help you), closed with damage (potential dispute), and collections (Phase 2 / Phase 5 territory).",
            },
            {
              step: "Public records",
              detail:
                "Bankruptcies, civil judgments where still reported, tax liens. These follow their own removal rules.",
            },
            {
              step: "Inquiries",
              detail:
                "Hard inquiries last 24 months on the report, 12 months in scoring. Soft inquiries are not your concern. Unauthorized hard inquiries become L19.",
            },
          ],
          tip: "Read the same account on all three reports before you decide it is wrong. An item that looks fine on Equifax may be re-aged on Experian — and that gap is your dispute angle.",
        },
        {
          eyebrow: "Module 03",
          title: "Identify the negative accounts",
          intro:
            "Not every negative item should be challenged the same way. Sort them honestly. The Account Router in Strategy uses this list to decide your lane.",
          walkthrough: [
            {
              step: "Late payments on open accounts",
              detail:
                "30/60/90/120-day lates inside the last 7 years. Goodwill / Phase 4 dispute candidates depending on accuracy.",
            },
            {
              step: "Charge-offs",
              detail:
                "Original creditor wrote the debt off but is still reporting the trade line. High-impact. Phase 5 territory.",
            },
            {
              step: "Collections",
              detail:
                "Third-party collector is now reporting. Check the date of first delinquency — collections drop 7 years from that date, NOT the date the collector picked it up.",
            },
            {
              step: "Repossessions / foreclosures",
              detail:
                "Often reported by both the original lender AND a downstream collector. Treat as two separate trade lines.",
            },
            {
              step: "Public records",
              detail:
                "Most civil judgments and tax liens were removed by the bureaus in 2017–2018. Bankruptcies still report up to 10 years (Ch. 7) or 7 years (Ch. 13 from filing).",
            },
            {
              step: "Hard inquiries you didn't authorize",
              detail: "Any inquiry you cannot tie to a real application — L19.",
            },
          ],
          example:
            "Example: A $480 medical collection, opened by ABC Recovery in March 2024, reporting on Experian only, with date of first delinquency listed as January 2022. That account drops January 2029 by law (7 years from DOFD), is in scope for both validation (Phase 2 — fresh collector) and direct furnisher dispute (Phase 5).",
          tip: "Date of first delinquency (DOFD) is the most-misreported field in your entire file. If a collector or bureau lists a DOFD that is later than the original creditor's DOFD, that is a §1681c re-aging violation — and a fast removal.",
        },
        {
          eyebrow: "Module 04",
          title: "Audit personal information",
          intro:
            "The personal information section is the door every furnisher walks through to verify your identity. If it is messy, every dispute drags. Clean here, and Phase 3 becomes mechanical.",
          walkthrough: [
            {
              step: "List every name variation",
              detail:
                "Maiden names, hyphenations, middle initial vs full name, Jr/Sr/III. Keep only the legal current version + any prior legal name documented by court order.",
            },
            {
              step: "List every address",
              detail:
                "Compare to your actual residential history. Anything you have never lived at is a candidate for removal. Anything older than 10 years is also fair game.",
            },
            {
              step: "List every employer",
              detail:
                "Employers do not move your score, but they show up during income verification and identity-mix disputes. Strip outdated and unfamiliar employers.",
            },
            {
              step: "Verify SSN and DOB",
              detail:
                'If even one digit is off on any bureau, every later dispute can be "unable to verify" rejected. Fix this first with L10.',
            },
            {
              step: "Note phone numbers",
              detail:
                "Old or unfamiliar numbers should come off — they are an identity-theft signal.",
            },
          ],
          include: [
            "Your current legal name (one variation)",
            "Your current address",
            "Up to two prior addresses you actually lived at within the last 10 years",
            "Correct SSN and DOB",
          ],
          exclude: [
            "Variations of your name you did not authorize",
            "Addresses you have never lived at",
            "Addresses older than 10 years (no benefit, only risk)",
            "Employers you cannot verify",
            "Phone numbers that are not yours",
          ],
          tip: "Wrong addresses are how mixed-file errors begin. Cleaning PI is not cosmetic — it is the foundation that lets every later dispute land cleanly.",
        },
        {
          eyebrow: "Module 05",
          title: "Build your dispute roster + pick a route",
          intro:
            "By now every account is sorted. The last move in Phase 1 is to commit each account to a lane and pick which lane you start in.",
          walkthrough: [
            {
              step: "Tag every negative account with a lane",
              detail:
                "Identity (L05–L10), Validation (L01–L04), Bureau dispute (L11–L14), or Furnisher dispute (L15–L19).",
            },
            {
              step: "Open the Account Router (Strategy page)",
              detail:
                "It walks you through the four-question decision tree and tells you which lane to start in based on what dominates your file.",
            },
            {
              step: "Open the Tracker",
              detail:
                "Log every account you intend to dispute now, before you mail anything. Sent dates, certified numbers, and outcomes all live here.",
            },
            {
              step: "Set a 35-day cadence",
              detail:
                "FCRA gives bureaus 30 days to respond. Add 5 days for mail. Whatever you mail today, follow up day 35.",
            },
          ],
          tip: "You will revisit Phase 1 every 90 days while the kit is active. Treat it as a living audit, not a one-time setup.",
        },
      ],
    },
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
      {
        title: "Identify validation-eligible debts",
        description:
          "Recent collector contact within 30 days, or any time you've never received Mini-Miranda.",
      },
      {
        title: "Send L01 by certified mail",
        description: "Return receipt requested. The signature card is your proof of service.",
      },
      {
        title: "Wait the 30-day window",
        description: "Track the date received. No response by day 31 triggers L02.",
      },
      {
        title: "Evaluate the response",
        description:
          "Inadequate paper triggers L03. Errors identified pivots to L04 and forward into Phase 4.",
      },
    ],
    colorVar: "--phase-2",
    teaching: {
      overview:
        "Validation is the cheapest, fastest leverage you have on a third-party collector. Used right, you force the collector to either prove the debt with documents — or stop collecting and stop reporting. Used wrong, it tips them off and you lose the window. This phase is about timing and precision.",
      modules: [
        {
          eyebrow: "Module 01",
          title: "Know what validation is — and what it is not",
          intro:
            "Debt validation is a federal right under FDCPA §1692g. It applies only to third-party debt collectors — not to original creditors.",
          include: [
            "Third-party collection agencies (Midland, Portfolio Recovery, LVNV, etc.)",
            "Debt buyers who have purchased the account",
            "Law firms collecting on behalf of a creditor",
          ],
          exclude: [
            "Original creditors collecting their own debt (use disputes / direct creditor letters instead)",
            "Mortgage servicers servicing your active mortgage",
            "Credit unions collecting their own member loans",
          ],
          tip: "Validation is a §1692g right under the FDCPA. The bureau accuracy dispute is a §1681i right under the FCRA. Different statutes, different leverage — do not confuse them.",
        },
        {
          eyebrow: "Module 02",
          title: "When to send L01 — and when not to",
          walkthrough: [
            {
              step: "Within 30 days of first written contact",
              detail:
                "Federal law gives you a 30-day window to dispute and request validation in writing. The collector must then cease collection until validation is provided.",
            },
            {
              step: 'Any time you have never received the §1692g "Mini-Miranda" notice',
              detail:
                "If they started reporting or calling without sending the required initial notice, the window never properly opened.",
            },
            {
              step: "When the account is fresh and unverified",
              detail:
                "If you genuinely do not recognize the debt, validation is the right first move.",
            },
          ],
          exclude: [
            "Debts you have already acknowledged in writing or made a payment on within the last 6 months — you may have reset the clock or waived defenses",
            "Debts past the FCRA 7-year reporting horizon — those should drop on their own; do not poke them",
            "Debts past your state's statute of limitations for suit — sending validation can sometimes restart that clock in some states",
          ],
          tip: "If you are outside the 30-day window and outside Mini-Miranda territory, jump to Phase 4 (bureau accuracy dispute) or Phase 5 (direct furnisher dispute) instead of validation.",
        },
        {
          eyebrow: "Module 03",
          title: "What counts as valid validation",
          intro:
            'The collector cannot just send you a printout. The case law has tightened around what "validation" actually requires.',
          include: [
            "The amount of the debt (with itemized breakdown of principal, interest, and fees)",
            "The name of the original creditor",
            "Documentation showing the chain of assignment from original creditor to current collector",
            "A copy of the original signed agreement (or proof of debt creation for utility/medical)",
          ],
          exclude: [
            "A single-line printout from the collector's CRM",
            "A letter that just restates the amount you supposedly owe",
            "An assignment letter without the full chain of custody",
          ],
          tip: "If they send paper that does not meet the bar above, your next move is L03 — Dispute of Inadequate Validation. You are not refusing the debt; you are refusing the inadequate paper.",
        },
        {
          eyebrow: "Module 04",
          title: "Mailing for legal proof",
          walkthrough: [
            {
              step: "Always certified mail, return receipt requested",
              detail:
                "USPS Form 3811 (the green card) is the legal proof of service. Without it, you have no admissible evidence the collector ever received your letter.",
            },
            {
              step: "Keep the green card AND the tracking printout",
              detail:
                "Both belong in your tracker. Take a phone photo of the card the day it arrives in the mail.",
            },
            {
              step: "Mail to the address on the collection notice — not the credit report",
              detail:
                "The notice address is the legally-served address. The bureau's address can be outdated by months.",
            },
          ],
        },
        {
          eyebrow: "Module 05",
          title: "Reading their response — the four outcomes",
          walkthrough: [
            {
              step: "No response by day 31 → L02",
              detail:
                "Cite the silence, demand removal, and put them on notice that continued reporting after a defective validation request is itself an FCRA violation.",
            },
            {
              step: "Inadequate paper → L03",
              detail:
                "They responded but the documents do not meet the bar. Reject on the record and demand actual chain-of-custody documents.",
            },
            {
              step: "Errors identified → L04 + Phase 4",
              detail:
                "Their response surfaces inaccuracies (wrong DOFD, wrong amount, wrong name). Pivot from validation to a documented inaccuracy dispute.",
            },
            {
              step: "Full proper validation → reassess",
              detail:
                "If they actually validate it cleanly, validation is exhausted. Move to Phase 4 / Phase 5 on a different angle (procedure, accuracy, inconsistencies) — or consider Pay-for-Delete (L18).",
            },
          ],
        },
      ],
    },
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
      {
        title: "Source the corrections at the creditor (L05)",
        description: "Update the data at its origin so it can't repopulate the bureau file.",
      },
      {
        title: "File the bureau PI dispute (L06)",
        description: "Strip the bureau's copy of every variation that isn't strictly accurate.",
      },
      {
        title: "Escalate non-investigations (L07)",
        description: "If the bureau closes without investigating, cite §1681i and reopen.",
      },
      {
        title: "Mixed-file or theft? L08 / L10",
        description: "Separate intermingled files and anchor SSN/DOB before continuing.",
      },
    ],
    colorVar: "--phase-3",
    teaching: {
      overview:
        'Personal information is the verification key. Bureaus and furnishers use it to confirm an account belongs to you. If your PI section is cluttered with old names, wrong addresses, and mystery employers, every dispute they cannot match becomes "verified" — even when the underlying account is wrong. Clean PI first, and the rest of the kit moves twice as fast.',
      modules: [
        {
          eyebrow: "Module 01",
          title: "Why personal information cleanup comes before disputes",
          intro:
            'Most cousins want to fight the charge-off first. That is the wrong order. The bureaus\' "verification" runs against PI. If your PI is wrong, you give them an easy out.',
          example:
            'If your file shows "123 Main St" but the furnisher\'s records show "123 Maine St", the bureau may match by partial address and call your dispute "verified" — even though the underlying tradeline is fraudulent. Clean the address, and that match no longer holds.',
        },
        {
          eyebrow: "Module 02",
          title: "What to KEEP in the personal information section",
          include: [
            "Your full legal name — exactly one current variation",
            "Your current residential address",
            "One or two prior addresses you actually lived at within the last 10 years",
            "Your correct date of birth",
            "Your correct Social Security number (or last 4)",
            "Your current phone number",
          ],
        },
        {
          eyebrow: "Module 03",
          title: "What to REMOVE in the personal information section",
          exclude: [
            "Any name variation you did not authorize (misspellings, hyphenations you no longer use, maiden names if no longer legal)",
            "Any address you have never lived at",
            "Addresses older than 10 years",
            "P.O. Boxes you do not currently use",
            "Employers you cannot verify or no longer work for and don't need on file",
            "Phone numbers that are not yours or that you no longer use",
            "Wrong SSN digits (even one off)",
            "Wrong date of birth",
          ],
          tip: "When in doubt, remove. PI fields do not help your score. They only exist to verify identity for furnishers — and you want that verification to fail unless the data is yours.",
        },
        {
          eyebrow: "Module 04",
          title: "Order of operations for PI cleanup",
          walkthrough: [
            {
              step: "Send L05 to each creditor that holds wrong data",
              detail:
                "Correct it at the source first. Otherwise the bureau cleans it up and the creditor immediately re-feeds the bad data on the next reporting cycle.",
            },
            {
              step: "Send L06 to all three bureaus",
              detail:
                "One letter per bureau, listing every PI item you want removed or corrected. Be precise — quote the exact text on the report.",
            },
            {
              step: "Wait 30 days, then audit",
              detail:
                'Pull a fresh report and confirm each item moved. If the bureau came back "verified" without explaining how, that is a §1681i violation.',
            },
            {
              step: "Escalate with L07",
              detail:
                "Cite the §1681i investigation requirement and demand a real procedure response. Most non-investigations collapse at this stage.",
            },
            {
              step: "Mixed file? Send L08",
              detail:
                "If you find someone else's name, address, or accounts intermingled with yours, separate immediately. Do not proceed to disputes while the file is mixed — you'll fix the wrong record.",
            },
            {
              step: "Wrong SSN or DOB? Send L10",
              detail:
                "Anchor identity before any other phase moves. A wrong digit here invalidates every later verification request you make.",
            },
          ],
        },
        {
          eyebrow: "Module 05",
          title: "How to write the L06 PI dispute itself",
          walkthrough: [
            {
              step: "Quote the bureau's exact text",
              detail:
                "\"On my report dated [date], in the Personal Information section, the following appears: 'JANE DOE, 4521 Mockingbird Ln, Houston TX'. This is inaccurate.\"",
            },
            {
              step: "State what should appear in its place — or that it should be removed entirely",
              detail: 'Be specific. Do not write "please update." Write "please remove."',
            },
            {
              step: "Cite the statute briefly",
              detail:
                "Reference your §1681e(b) and §1681i rights to accurate, verifiable, and currently-investigated data.",
            },
            {
              step: "Attach proof for any address change",
              detail: "ID + utility bill + lease. Bureaus reject undocumented PI updates.",
            },
          ],
          tip: 'Never list more than 6–8 items per L06 letter. If you have more, send a second letter. Long letters get triaged into a "frivolous" pile.',
        },
        {
          eyebrow: "Module 06",
          title: "Mixed file vs. identity theft — know the difference",
          intro:
            "These are two different problems with two different remedies. Confusing them costs months.",
          walkthrough: [
            {
              step: "Mixed file (L08)",
              detail:
                "Two different real people's data ended up on one bureau file because of similar name, similar SSN, or shared address history. Remedy: separation, not fraud affidavit.",
            },
            {
              step: "Identity theft",
              detail:
                "Someone fraudulently used your identity to open accounts. Remedy: IdentityTheft.gov FTC report, then bureau fraud blocks under §1681c-2 — that is automatic 4-business-day removal once the report is filed.",
            },
          ],
        },
      ],
    },
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
      {
        title: "Round 1 — Accuracy dispute (L11)",
        description: "Open the investigation on every inaccurate item, all three bureaus.",
      },
      {
        title: "Round 2 — Procedure exposure (L12)",
        description:
          "Demand method of verification. The §1681i(7) request most furnishers cannot answer.",
      },
      {
        title: "Round 3 — Intent to file (L13)",
        description: "Formal notice that CFPB and State AG complaints are the next step.",
      },
      {
        title: "Round 4 — Final notice (L14)",
        description: "Document everything for Phase 6 escalation. The paper trail is the case.",
      },
    ],
    colorVar: "--phase-4",
    teaching: {
      overview:
        "Phase 4 is the five-round campaign against the bureaus themselves. Each round tightens the legal pressure. The goal is not to send all five at once — it is to escalate one round at a time, evaluate the response, and let each round set up the next.",
      modules: [
        {
          eyebrow: "Module 01",
          title: "Round mechanics — the 30-day cycle",
          walkthrough: [
            {
              step: "Mail by certified mail with return receipt",
              detail:
                "Same standard as Phase 2. The signature card is your proof the round started.",
            },
            {
              step: "Day 1–30: bureau investigation window",
              detail:
                "FCRA §611(a)(1)(A) gives them 30 days. Plus 15 if you supply additional information after they open the investigation.",
            },
            {
              step: "Day 31–35: response arrives",
              detail:
                "Read it carefully. Look for what they did NOT respond to as much as what they did.",
            },
            {
              step: "Day 36+: escalate to next round",
              detail: "Do not wait. The bureaus count on you losing momentum.",
            },
          ],
        },
        {
          eyebrow: "Module 02",
          title: "What each round actually does",
          walkthrough: [
            {
              step: "Round 1 — L11 — Accuracy dispute",
              detail:
                'Opens the investigation. State the inaccuracy specifically. Avoid vague "this is wrong." Use "the date of first delinquency reported is [X], but my records show [Y]."',
            },
            {
              step: "Round 2 — L12 — Method of verification (MOV) demand",
              detail:
                "Now you ask HOW they verified. Under §1681i(6)(B), you have the right to know the source and procedure. Most bureaus cannot meet this bar.",
            },
            {
              step: "Round 3 — L13 — Notice of intent to file complaint",
              detail:
                "Formal notice you will file with CFPB and your State AG. Bureaus track CFPB complaints — the threat is real.",
            },
            {
              step: "Round 4 — L14 — Final violation notice",
              detail:
                "Last warning. Document every prior round and reference each one by certified-mail tracking number. This letter is also your evidence package for Phase 6.",
            },
          ],
          tip: "Stop adding rounds when the item is removed. There is no prize for finishing all five rounds — the goal is removal, not completion.",
        },
        {
          eyebrow: "Module 03",
          title: "Reading the bureau response",
          include: [
            '"Verified as accurate" — they say they checked with the furnisher. Move to MOV (L12)',
            '"Updated" — something changed. Pull a fresh report and confirm what',
            '"Deleted" — the item is off. Stop the round sequence on this account',
            '"Investigation closed — no change" — same as verified; treat the same way',
          ],
          exclude: [
            "Generic letters that don't address your specific dispute — that's a §1681i violation in itself",
            "Responses that only address some of the items — escalate the unresolved ones",
          ],
        },
      ],
    },
  },
  {
    id: "challenge-furnishers",
    number: 5,
    name: "Challenge Furnishers",
    shortName: "Furnishers",
    eyebrow: "Phase 5 · Direct attack",
    lede: "Letters direct to the data furnisher. Skip the bureau as middleman.",
    description:
      'When the bureaus stall behind "verified," the furnisher itself is liable under §1681s-2. Direct disputes force a different investigation entirely.',
    rounds: 4,
    steps: [
      {
        title: "Direct furnisher dispute (L15A/B)",
        description: "Collection agency or original creditor, depending on who's reporting.",
      },
      {
        title: "Bureau companion (L15C)",
        description: "Mirror to the bureau. Both ends investigate concurrently.",
      },
      {
        title: "Inconsistency attack (L16)",
        description: "Three bureaus, three versions. Use the gaps as your wedge.",
      },
      {
        title: "Advanced & specialty (L17–L19)",
        description: "Charge-off violations, pay-for-delete, unauthorized inquiries.",
      },
    ],
    colorVar: "--phase-5",
    teaching: {
      overview:
        'When the bureaus hide behind "verified," you go around them. Furnishers (collectors, original creditors) have their own investigation duty under FCRA §1681s-2. Direct disputes force a separate investigation that the bureau dispute did not trigger — and most furnishers are not built for it.',
      modules: [
        {
          eyebrow: "Module 01",
          title: "Why direct furnisher disputes work",
          intro:
            "The bureau dispute and the furnisher dispute are two distinct legal processes. Most cousins only run the first one. Run both, and the furnisher has to defend the data twice with two different procedures.",
          tip: "§1681s-2(b) creates a duty to investigate any dispute received from a consumer reporting agency. Send L15C to the bureau at the same time — that triggers the bureau to forward, which triggers the §1681s-2(b) duty.",
        },
        {
          eyebrow: "Module 02",
          title: "Picking your specialty letter",
          walkthrough: [
            {
              step: "L15A · Collection agency",
              detail: "When a third-party collector is the furnisher reporting the bad data.",
            },
            {
              step: "L15B · Original creditor",
              detail:
                "When the bank, lender, or service provider is reporting the bad data themselves.",
            },
            {
              step: "L16 · Inconsistency attack",
              detail:
                "When the same account reports three different versions across the three bureaus. Use the worst version as your evidence against the others.",
            },
            {
              step: "L17 · Charge-off violations",
              detail:
                "Re-aging, balance changes after charge-off, status flips. Charge-offs are supposed to be frozen — every change after the charge-off date is a separate FCRA violation.",
            },
            {
              step: "L18 · Pay-for-Delete",
              detail:
                "Last resort when validation and disputes have failed. Always in writing, never by phone, never partial.",
            },
            {
              step: "L19 · Unauthorized hard inquiry removal",
              detail:
                "Hard inquiries you cannot tie to an application you submitted are §1681b violations.",
            },
          ],
        },
      ],
    },
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
      {
        title: "File the CFPB complaint",
        description: "Six-step submission with documentation pulled from your round tracker.",
      },
      {
        title: "Mirror to State AG",
        description: "State enforcement adds local pressure the bureaus respond to faster.",
      },
      {
        title: "FTC report for theft / fraud",
        description: "IdentityTheft.gov for the federal record and recovery plan.",
      },
      {
        title: "Consider FCRA counsel",
        description:
          "If statutory damages are on the table, an FCRA attorney works on contingency.",
      },
    ],
    colorVar: "--phase-6",
    teaching: {
      overview:
        'Escalation is not a round — it is a different lever. You only reach Phase 6 after Phase 4 and Phase 5 are exhausted. By the time you get here, your tracker is your case file. The CFPB does not investigate; they forward. But forwarding to the bureaus\' compliance teams produces 15-day resolutions on items that sat "verified" for months.',
      modules: [
        {
          eyebrow: "Module 01",
          title: "The CFPB complaint — six steps",
          walkthrough: [
            {
              step: "Open consumerfinance.gov/complaint",
              detail:
                'Choose "Credit reporting, credit repair services, or other personal consumer reports."',
            },
            {
              step: "Identify the company",
              detail:
                "File against the bureau, the furnisher, or both — separate complaints if both are at fault.",
            },
            {
              step: "Describe what happened",
              detail:
                "Use dates, certified-mail tracking numbers, and the exact violation. Avoid emotion. Stick to the timeline.",
            },
            {
              step: "Attach evidence",
              detail: "Your letters, their responses, your green cards, your tracker export.",
            },
            {
              step: "Choose desired resolution",
              detail: "Removal of the item — not money. Money is for the lawyer phase.",
            },
            {
              step: "Submit and save the complaint number",
              detail: "The bureau has 15 days to respond on the public record.",
            },
          ],
        },
        {
          eyebrow: "Module 02",
          title: "When to call an FCRA attorney",
          intro:
            "If the bureaus or furnishers continued reporting after you provided documented proof of inaccuracy, you may have statutory and actual damages on the table. FCRA attorneys typically work on contingency and recover fees from the defendant.",
          include: [
            "Documented willful violations (kept reporting after you proved inaccurate)",
            "Mixed-file harm (loan or job denied because of someone else's data)",
            "Identity theft that the bureaus refused to block after a proper §1681c-2 request",
          ],
        },
      ],
    },
  },
];

export const PHASES_BY_ID: Record<PhaseId, Phase> = PHASES.reduce(
  (acc, p) => {
    acc[p.id] = p;
    return acc;
  },
  {} as Record<PhaseId, Phase>,
);
