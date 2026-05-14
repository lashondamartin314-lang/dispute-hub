/**
 * Per-letter exhaustive guidance.
 *
 * Built for the least-experienced reader. Every field assumes zero prior
 * credit-repair knowledge. Plain language first; statute citations second.
 *
 * Field rules:
 *  - `recipient` — Plain English: who literally receives the envelope.
 *  - `findAddress` — Where on a credit report or letterhead to find it.
 *  - `whenToSend` — The trigger event + the deadline you are working against.
 *  - `prerequisites` — What MUST be true / completed before this letter goes out.
 *  - `mustInclude` — Enclosures + identifiers that have to be in the envelope.
 *  - `mustDo` — Hard rules. Skipping any of these can void the letter.
 *  - `doNot` — Common mistakes that destroy the letter's effect.
 *  - `expect` — What you should receive back (or not), and on what timeline.
 *  - `nextStep` — Decision tree: "If X happens, send Y next." Always explicit.
 *  - `legalBasis` — One short reference for the curious reader.
 */
import type { LetterId } from "./letters";

export interface LetterGuide {
  recipient: string;
  findAddress: string;
  whenToSend: string;
  prerequisites: string[];
  mustInclude: string[];
  mustDo: string[];
  doNot: string[];
  expect: string;
  nextStep: { condition: string; letterId?: LetterId; action: string }[];
  legalBasis: string;
}

export const LETTER_GUIDES: Record<LetterId, LetterGuide> = {
  // ─────────────────────────── PHASE 2 · VALIDATE ───────────────────────────
  L01: {
    recipient:
      "The collection agency (the third-party debt collector) that recently contacted you about a debt. NOT the original lender, and NOT the credit bureaus.",
    findAddress:
      "Use the mailing address on the first written notice ('dunning letter') the collector sent you. If you only have a phone call, look the agency up on your credit report under 'Collections' — the bureau lists their address there.",
    whenToSend:
      "Within 30 days of the first written communication from the collector. Day 1 = the day you received their letter (postmark counts). After day 30 you keep your right to dispute, but you lose the automatic 'must-stop-collection' protection of FDCPA §1692g(b).",
    prerequisites: [
      "You received written contact from a collector in the last 30 days (a letter, not just a phone call).",
      "You have NOT already paid, settled, or admitted the debt in writing — doing so weakens validation.",
      "You have a printer, a pen for a wet signature, and access to USPS Certified Mail with Return Receipt.",
    ],
    mustInclude: [
      "Your full legal name, current mailing address, and the last 4 of your SSN (for matching only).",
      "The collector's reference / account number exactly as it appears on their notice.",
      "A clear statement: 'This is a request for validation under 15 U.S.C. §1692g.'",
      "A wet (ink) signature and the date you sign.",
    ],
    mustDo: [
      "Mail by USPS Certified Mail · Return Receipt Requested (the green card). Keep both receipts forever.",
      "Photocopy or scan the signed letter BEFORE sealing the envelope.",
      "Log the date sent + tracking number on your Round Tracker the same day.",
      "Treat the day they sign for it as 'Day 0' of your 30-day clock.",
    ],
    doNot: [
      "Do NOT send by email, fax, or the collector's web portal — none create the legal proof of delivery you need.",
      "Do NOT include payment, a partial payment, or a settlement offer of any kind in this envelope.",
      "Do NOT acknowledge the debt as yours ('I owe…', 'my account…'). Use neutral language: 'the alleged debt'.",
      "Do NOT call the collector after sending this. All contact must be in writing from now on.",
    ],
    expect:
      "By law they must either (a) provide validation — typically the original creditor name, the amount owed, and proof of their right to collect — or (b) cease collection AND stop reporting it until they do. Most agencies respond in 14–40 days. Roughly 30–40% never respond at all.",
    nextStep: [
      { condition: "No response within 30 days of their signed receipt", letterId: "L02", action: "Send L02 — Validation Follow-Up · No Response." },
      { condition: "They sent paper that is NOT real validation (just a printout, statement, or screenshot)", letterId: "L03", action: "Send L03 — Dispute of Inadequate Validation." },
      { condition: "Their response shows the data they are reporting is wrong (wrong balance, wrong dates, wrong owner)", letterId: "L04", action: "Send L04 — Validation Bridge · Errors Identified, then move into Phase 4." },
      { condition: "They provide complete, accurate validation and the debt is genuinely yours", action: "Stop here. Decide whether to pay, settle in writing (get pay-for-delete in writing first — see L18), or wait it out." },
    ],
    legalBasis: "FDCPA · 15 U.S.C. §1692g(b) — Validation of debts.",
  },

  L02: {
    recipient:
      "The same collection agency you sent L01 to — no one else.",
    findAddress:
      "Use the exact same mailing address you used for L01. If they have moved, use the address on any newer correspondence.",
    whenToSend:
      "Day 31 or later, counted from the day they signed for L01. If you mail it before day 31 you have not technically given them their full statutory window.",
    prerequisites: [
      "L01 was delivered (you have the signed green card or USPS proof of delivery).",
      "You have received no validation — silence, an automated reply, or only a request for more time does not count as validation.",
      "30+ days have passed since their delivery date.",
    ],
    mustInclude: [
      "A reference to L01 with the exact date you mailed it AND the date they signed for it.",
      "A copy of the green card or USPS tracking proof attached.",
      "A clear demand: cease collection and remove the tradeline from all three bureaus.",
      "Your wet signature and the date.",
    ],
    mustDo: [
      "Mail by USPS Certified Mail · Return Receipt Requested.",
      "Save your file copy and the new tracking number on the Round Tracker.",
      "Continue refusing all phone contact.",
    ],
    doNot: [
      "Do NOT threaten to sue or use legal language you cannot back up.",
      "Do NOT offer to settle — the leverage is on your side at this stage.",
      "Do NOT send a duplicate L01. Reference the original; don't restart the clock.",
    ],
    expect:
      "Many collectors quietly delete the tradeline within 14 days rather than respond. Some send late paperwork — that response is now governed by L03 logic. About 1 in 4 still ignore the letter; that becomes Phase 4 ammunition.",
    nextStep: [
      { condition: "Tradeline disappears from all three bureaus within ~30 days", action: "Document the deletion (save before/after reports). Move on to other accounts." },
      { condition: "They send late paperwork that is still inadequate", letterId: "L03", action: "Send L03 — Dispute of Inadequate Validation." },
      { condition: "Still total silence after another 30 days", letterId: "L11", action: "Move the item into Phase 4 — Bureau Dispute (L11)." },
    ],
    legalBasis: "FDCPA · 15 U.S.C. §1692g(b) continuing-violation theory.",
  },

  L03: {
    recipient: "The same collection agency.",
    findAddress: "Same address you have been using for L01 / L02.",
    whenToSend:
      "Within 15 days of receiving their inadequate response. Speed matters — it shows you reviewed and rejected their paper while the matter is fresh.",
    prerequisites: [
      "You received SOMETHING back from them but it does not actually validate the debt (e.g., a printed account statement, a screenshot, or a generic letter saying 'this is your account').",
      "You still have your file copies of L01 and proof of delivery.",
    ],
    mustInclude: [
      "A line-by-line list of what is missing (no signed contract, no chain of assignment, no itemized accounting from $0).",
      "A copy of what they sent, marked up if helpful.",
      "Renewed demand to cease collection until proper validation is produced.",
    ],
    mustDo: [
      "Be specific. Vague rejections lose. 'You provided an account summary but no signed agreement establishing my obligation' beats 'this is not enough'.",
      "Certified Mail · Return Receipt Requested.",
    ],
    doNot: [
      "Do NOT escalate to threats here. This letter is a legal record, not an argument.",
      "Do NOT pay even partially — partial payment can re-start the statute of limitations on the debt.",
    ],
    expect:
      "Either a second attempt at validation (often still inadequate), continued silence, or a deletion. Allow 30 days.",
    nextStep: [
      { condition: "They go silent or send another inadequate response", letterId: "L11", action: "Move to Phase 4 — Bureau Dispute (L11) treating the account as 'unverifiable, still reporting'." },
      { condition: "They send actual valid documentation", action: "Validation has been satisfied. Decide whether to pay/settle, or pivot to accuracy disputes if anything in their paperwork is wrong." },
    ],
    legalBasis: "FDCPA §1692g(b) — 'verification' must include identification of the original creditor and the amount of the debt.",
  },

  L04: {
    recipient:
      "The collection agency, AND simultaneously each of the three credit bureaus (Equifax, Experian, TransUnion). This letter has two flavors — one to the collector, mirrored copies to the bureaus.",
    findAddress:
      "Collector: same address as L01. Bureaus: see the address block in the L04 template — addresses are pre-filled. Always mail to the bureau-specific dispute P.O. Box, not their general HQ.",
    whenToSend:
      "Within 15 days of identifying the error in their validation packet. Timing matters because it pins the error to the response.",
    prerequisites: [
      "You completed L01 and they responded.",
      "Their response contains a concrete factual error you can point to (wrong balance, wrong open date, wrong original creditor, wrong owner).",
    ],
    mustInclude: [
      "A copy of the page(s) from their response showing the error.",
      "A copy of the page(s) from your credit report showing how it is currently being reported.",
      "A clear statement of what is wrong and what the correct information is.",
    ],
    mustDo: [
      "Send four envelopes: one to the collector, one each to Equifax, Experian, TransUnion.",
      "Use Certified Mail · Return Receipt for all four. Track each separately.",
    ],
    doNot: [
      "Do NOT use L04 if the only complaint is 'they were rude' or 'I don't think I owe it' — L04 needs a documented factual error.",
    ],
    expect:
      "Bureaus must respond within 30 days (45 if you also dispute under FACTA free-report rules). The collector typically updates or deletes once the bureau opens an investigation.",
    nextStep: [
      { condition: "Bureau confirms the deletion / correction", action: "Save the result-letter PDF for your records. Move on." },
      { condition: "Bureau says 'verified' but the error remains", letterId: "L12", action: "Escalate with L12 — Procedure Exposure / MOV Demand." },
    ],
    legalBasis: "FCRA · 15 U.S.C. §1681i — Procedure in case of disputed accuracy.",
  },

  // ─────────────────────────── PHASE 3 · CLEAN IDENTITY ───────────────────────────
  L05: {
    recipient:
      "The original creditor (the bank, lender, or store card company that owns the account). NOT a collection agency. NOT the bureaus.",
    findAddress:
      "On any monthly statement: the 'customer service / correspondence' address (NOT the payment-processing address — those go to a lockbox and are ignored). On their website, look for 'Notice Address' or 'Credit Bureau Disputes'.",
    whenToSend:
      "As soon as you discover any wrong personal information attached to the account: misspelled name, old address, wrong employer, wrong DOB.",
    prerequisites: [
      "You can prove the correct information (driver's license, utility bill, SSA letter).",
      "The account is still being reported in your name (open or recently closed).",
    ],
    mustInclude: [
      "Account number.",
      "The wrong information they currently show.",
      "The correct information.",
      "A photocopy of one ID document supporting the correction (NEVER send the original).",
    ],
    mustDo: [
      "Certified Mail · Return Receipt.",
      "Send to the correspondence address, not the payment lockbox.",
    ],
    doNot: [
      "Do NOT include disputes about the debt itself in this letter — keep it strictly to personal-info corrections.",
      "Do NOT send your full SSN; last four only.",
    ],
    expect:
      "Most creditors update within 30–60 days. The cleaned data flows down to the bureaus on the next monthly tape.",
    nextStep: [
      { condition: "Creditor updates and bureaus follow", action: "Confirm on next month's reports, then move on." },
      { condition: "Creditor refuses or ignores", letterId: "L06", action: "Go around them with L06 — Bureau Personal Information Dispute." },
    ],
    legalBasis: "FCRA §1681s-2(a) — Furnisher accuracy duty.",
  },

  L06: {
    recipient:
      "The three credit bureaus directly: Equifax, Experian, TransUnion. One envelope each.",
    findAddress:
      "Use the bureau dispute P.O. Boxes pre-filled in the template. Do NOT use HQ addresses or online portals — paper Certified Mail is intentional.",
    whenToSend:
      "Anytime after you have identified wrong personal data on your bureau file. Best practice: as the very first letter campaign in Phase 3.",
    prerequisites: [
      "You have your three bureau reports in hand.",
      "You have circled / listed every wrong name, address, employer, phone, and DOB.",
    ],
    mustInclude: [
      "A line-by-line list: 'Remove [wrong item]. My correct [item] is [X].'",
      "Photocopies of one government ID + one proof-of-address (utility bill).",
      "Last four of your SSN — never the full number.",
    ],
    mustDo: [
      "Three separate envelopes, three Certified Mail receipts. The bureaus do not share dispute records.",
      "List addresses you want REMOVED, not just the one you want kept — they will not infer.",
    ],
    doNot: [
      "Do NOT use the online portal. The portal locks you into eOSCAR codes that strip your detail and waive certain rights.",
      "Do NOT send full SSN, full DOB, or original documents.",
    ],
    expect:
      "Bureaus have 30 days (45 with a free annual report) to investigate and reply by mail. Most personal-info corrections are done quickly because the data is easy to verify.",
    nextStep: [
      { condition: "Bureau makes the correction", action: "Save the result letter. Pull a fresh report in 30 days to confirm the change held." },
      { condition: "Bureau replies 'verified' without explanation", letterId: "L07", action: "Send L07 — Failure to Investigate follow-up." },
      { condition: "Bureau ignores or doesn't respond at all in 30+ days", letterId: "L07", action: "Send L07 to put the missed deadline on the record." },
    ],
    legalBasis: "FCRA §1681i — Bureau investigation duty.",
  },

  L07: {
    recipient: "The specific bureau(s) that failed to investigate.",
    findAddress: "Same dispute P.O. Box you used for L06.",
    whenToSend: "Day 31 after your L06 was delivered, or as soon as you receive a 'verified' reply with no actual investigation detail.",
    prerequisites: ["L06 was delivered.", "30 days passed OR a non-substantive 'verified' reply was received."],
    mustInclude: [
      "Date L06 was sent + delivered (with tracking).",
      "A copy of the bureau's deficient response if any.",
      "Citation: §1681i requires a 'reasonable investigation,' not a rubber stamp.",
    ],
    mustDo: ["Certified Mail · Return Receipt.", "Keep tone factual, not threatening."],
    doNot: ["Do NOT re-list every single item — this letter is about THEIR failure to investigate, not the underlying data."],
    expect: "A second-pass investigation, often with corrections this time. ~20 days typical.",
    nextStep: [
      { condition: "Corrections made", action: "Done — confirm on next pull." },
      { condition: "Still 'verified' with no detail", letterId: "L09", action: "Escalate with L09 — Method of Verification demand." },
    ],
    legalBasis: "FCRA §1681i(a)(1)(A) — Reasonable investigation requirement.",
  },

  L08: {
    recipient: "All three bureaus. If theft is suspected, ALSO file an FTC IdentityTheft.gov report and attach it.",
    findAddress: "Bureau dispute P.O. Boxes (template-included).",
    whenToSend: "Immediately upon discovering accounts, addresses, or inquiries you do not recognize — or another person's data merged into your file.",
    prerequisites: [
      "You can specifically identify which items are not yours.",
      "If suspecting theft: an FTC Identity Theft Report (free, at IdentityTheft.gov) makes the bureau's response mandatory.",
    ],
    mustInclude: [
      "Per-item list of what is not yours and why (e.g., 'opened in TX while I lived in OR').",
      "FTC report number if filed.",
      "Police report copy if filed.",
      "ID + proof of address.",
    ],
    mustDo: [
      "Place a free fraud alert (one call to any bureau triggers all three).",
      "Consider a credit freeze before sending — stops new damage during the dispute.",
      "Certified Mail · Return Receipt to all three bureaus.",
    ],
    doNot: [
      "Do NOT pay anything on items you are claiming as not yours — payment can be construed as acknowledgement.",
      "Do NOT close the disputed accounts yourself if they appear on your real bank statements — let the investigation classify them first.",
    ],
    expect: "With an FTC report attached, bureaus must block the disputed information within 4 business days under §1681c-2.",
    nextStep: [
      { condition: "Items blocked", action: "Maintain the freeze, monitor monthly for re-insertion." },
      { condition: "Bureau refuses to block despite FTC report", letterId: "L13", action: "Escalate immediately — this is a §1681c-2 violation. Use L13 framing." },
    ],
    legalBasis: "FCRA §1681c-2 — Block of information resulting from identity theft.",
  },

  L09: {
    recipient: "The bureau(s) that returned a bare 'verified' result on personal information.",
    findAddress: "Same dispute P.O. Box.",
    whenToSend: "Within 15 days of receiving a 'verified' result that lacks substantive detail.",
    prerequisites: ["A prior dispute (L06 or L07) was answered with 'verified' but no description of how."],
    mustInclude: [
      "Reference to the prior dispute date.",
      "Explicit demand under §1681i(7) for the 'description of the procedure used to determine the accuracy and completeness of the information' — including business name, address, and telephone number of any person contacted.",
    ],
    mustDo: ["Certified Mail · Return Receipt.", "Be patient — bureaus have 15 days to provide MOV after request."],
    doNot: ["Do NOT confuse this with a re-dispute. This is a separate, named statutory request."],
    expect: "Either a vague reply (which becomes Phase 6 evidence), or a real description that often itself reveals the failure.",
    nextStep: [
      { condition: "MOV reveals the bureau just re-asked the furnisher who said 'yes'", letterId: "L13", action: "Send L13 — Notice of Intent to File Complaint (CFPB)." },
      { condition: "MOV reveals an actual investigation but the data is still wrong", letterId: "L15A", action: "Move to Phase 5 — Direct Furnisher Dispute (L15A or L15B)." },
    ],
    legalBasis: "FCRA §1681i(a)(7) — Description of reinvestigation procedure.",
  },

  L10: {
    recipient: "All three bureaus.",
    findAddress: "Bureau dispute P.O. Boxes.",
    whenToSend: "Once when establishing your file's foundation — and any time you see your SSN or DOB displayed wrong on a report.",
    prerequisites: ["You have a Social Security card and a government-issued ID with DOB."],
    mustInclude: [
      "Photocopy of SS card (cover all but last 4).",
      "Photocopy of ID showing DOB.",
      "A clear statement of what they currently show vs. correct.",
    ],
    mustDo: ["Certified Mail · Return Receipt.", "Use last 4 only when typed in the body of the letter."],
    doNot: ["Do NOT email or upload a photo of your SS card."],
    expect: "30 days; the correction is usually trivial once requested in writing.",
    nextStep: [
      { condition: "Corrected", action: "Done. Re-pull in 30 days to confirm." },
      { condition: "Refused / ignored", letterId: "L07", action: "Send L07 follow-up." },
    ],
    legalBasis: "FCRA §1681i + Privacy Act protections on SSN handling.",
  },

  // ─────────────────────────── PHASE 4 · DISPUTE BUREAUS ───────────────────────────
  L11: {
    recipient: "The three credit bureaus — Equifax, Experian, TransUnion. One envelope each, per inaccurate item.",
    findAddress: "Bureau dispute P.O. Boxes (template-included). Never the online portal for round 1.",
    whenToSend:
      "Round 1 of the bureau campaign. Start here for any inaccurate tradeline that is NOT eligible for fresh-collection validation (i.e., older than 30 days from first contact, or never reached you from a collector).",
    prerequisites: [
      "Phase 3 personal-info cleanup is complete (otherwise furnishers will reject on identity mismatch).",
      "You can name a specific factual inaccuracy — wrong balance, wrong dates, wrong status, wrong owner. 'I don't like it' is not a dispute.",
    ],
    mustInclude: [
      "Item-by-item list: account name, account number (last 4 is fine), what is reported, what is correct, and why.",
      "A copy of the report page showing the item.",
      "Any documentary support (canceled check showing payment, settlement letter, etc.).",
      "Last 4 of SSN, current address, ID + proof of address copies.",
    ],
    mustDo: [
      "Send THREE separate certified envelopes, one to each bureau.",
      "Number each disputed item so the bureau's reply maps cleanly back.",
      "Start your 30-day clock on the date each bureau signs for delivery (each is independent).",
    ],
    doNot: [
      "Do NOT use Credit Karma, the bureau app, or annualcreditreport.com to dispute. Online disputes are routed through eOSCAR — a 2-digit code system that strips your detail and waives the right to a written investigation description.",
      "Do NOT dispute more than ~5 items per envelope — bureaus may flag and dismiss as 'frivolous'.",
      "Do NOT include items that are actually accurate hoping for deletion. That damages your credibility for the items that matter.",
    ],
    expect:
      "Each bureau must investigate within 30 days (45 if you obtained a free annual report during the period). You will receive a results letter showing 'Deleted', 'Updated', or 'Verified'. Allow 5 extra days for mail.",
    nextStep: [
      { condition: "Deleted or updated to correct", action: "Save the results letter. Move on to the next item." },
      { condition: "Verified but still wrong", letterId: "L12", action: "Round 2 — send L12 (MOV Demand) within 15 days of their reply." },
      { condition: "No response within 35 days of delivery", letterId: "L13", action: "Skip to Round 3 — L13 (intent to complain). The missed deadline is itself a violation." },
    ],
    legalBasis: "FCRA §1681i(a) — Reinvestigation; §1681i(a)(2) — Notice to furnishers.",
  },

  L12: {
    recipient: "The bureau(s) that returned 'verified' on your L11.",
    findAddress: "Same bureau dispute P.O. Box.",
    whenToSend: "Within 15 days of receiving the L11 'verified' results letter.",
    prerequisites: ["L11 was answered with 'verified' on the items you still believe are wrong."],
    mustInclude: [
      "Reference to your L11 date and their response date.",
      "An explicit §1681i(a)(7) demand for the description of the procedure used, including the name, address, and phone number of every person contacted.",
      "A statement that you reserve the right to escalate to the CFPB and your State Attorney General.",
    ],
    mustDo: [
      "Certified Mail · Return Receipt.",
      "Send only to the bureau that 'verified' — no need to mirror to bureaus that already deleted.",
    ],
    doNot: [
      "Do NOT re-argue the underlying dispute here. This letter is strictly procedural.",
      "Do NOT make threats you would not actually carry out — the CFPB language only works if you mean it.",
    ],
    expect: "Bureau has 15 days to provide MOV. Many do not, or send a vague one — both outcomes strengthen Phase 6.",
    nextStep: [
      { condition: "MOV not provided OR vague", letterId: "L13", action: "Send L13 — Notice of Intent to File Complaint." },
      { condition: "MOV reveals furnisher just rubber-stamped 'yes'", letterId: "L15A", action: "Open Phase 5 with L15A or L15B (direct furnisher dispute)." },
    ],
    legalBasis: "FCRA §1681i(a)(7) — Description of reinvestigation procedure.",
  },

  L13: {
    recipient: "The bureau(s) still resisting — and a copy of the letter goes into your CFPB complaint draft.",
    findAddress: "Bureau dispute P.O. Box.",
    whenToSend: "After L12 produced no satisfactory MOV, or after a missed §1681i deadline.",
    prerequisites: ["L11 + L12 (or a missed L11 deadline) are documented."],
    mustInclude: [
      "Timeline: L11 sent / delivered / answered, L12 sent / delivered / answered.",
      "Specific statutory violations alleged (§1681i deadline, §1681i(a)(7) MOV failure, etc.).",
      "A 15-day cure window before you file the CFPB complaint.",
    ],
    mustDo: [
      "Be ready to actually file the CFPB complaint on day 16 if they do not cure. Empty threats teach the bureau you are bluffing.",
      "Certified Mail · Return Receipt.",
    ],
    doNot: ["Do NOT name a dollar amount or demand damages here — that is for counsel later."],
    expect: "Roughly 50% of items are deleted within the 15-day cure window. The rest become L14 / Phase 6.",
    nextStep: [
      { condition: "Deleted", action: "Done. Save the result letter." },
      { condition: "Still no movement after 15 days", letterId: "L14", action: "Send L14 — Final Violation Notice and prepare the CFPB complaint." },
    ],
    legalBasis: "FCRA §§1681i, 1681n, 1681o (negligent / willful noncompliance).",
  },

  L14: {
    recipient: "The bureau, with full violation log attached. This letter doubles as your Phase 6 exhibit.",
    findAddress: "Bureau dispute P.O. Box.",
    whenToSend: "After L13's 15-day cure window expires without correction.",
    prerequisites: ["Complete documented chain of L11 → L12 → L13 with delivery proofs."],
    mustInclude: [
      "Full timeline with dates and tracking numbers.",
      "List of statutory violations and their citations.",
      "Notice that the matter is being escalated to the CFPB, the State AG, and (if applicable) FCRA counsel.",
    ],
    mustDo: [
      "Certified Mail · Return Receipt.",
      "On the same day, prepare (do not yet submit) your CFPB complaint draft.",
    ],
    doNot: ["Do NOT continue past Round 4 in-system. After L14 the right move is the regulator, not Round 5 in the same channel."],
    expect: "Final in-system response within 30 days; many items delete just before CFPB submission.",
    nextStep: [
      { condition: "Deleted", action: "Document everything. You're done with this item." },
      { condition: "Still no correction", action: "Open Phase 6 — file the CFPB complaint with your assembled evidence." },
    ],
    legalBasis: "FCRA §§1681n, 1681o — willful and negligent noncompliance.",
  },

  // ─────────────────────────── PHASE 5 · CHALLENGE FURNISHERS ───────────────────────────
  L15A: {
    recipient: "The COLLECTION AGENCY (third-party debt buyer or contingency collector) reporting the tradeline.",
    findAddress: "On your credit report under the disputed account: 'Furnisher contact' or 'Creditor address'. If absent, use the address from any letter they have ever sent you.",
    whenToSend: "After Phase 4 either failed (verified-but-wrong) OR you want to attack the data at its source in parallel.",
    prerequisites: [
      "Personal info on file is clean (Phase 3 done).",
      "You can articulate the specific inaccuracy.",
    ],
    mustInclude: [
      "Notice that this is a §1681s-2(b) direct dispute.",
      "Specific inaccuracy named.",
      "Supporting documentation copies (statements, payment records, court documents).",
    ],
    mustDo: [
      "Certified Mail · Return Receipt — the furnisher does not have a special P.O. Box; use the one they list on their letterhead.",
      "Send L15C to the bureau on the same day so both ends investigate concurrently.",
    ],
    doNot: ["Do NOT call to 'follow up' — phone calls are not in the §1681s-2 record."],
    expect: "Furnisher must investigate within 30 days and report results to the bureaus. Many quietly delete rather than respond.",
    nextStep: [
      { condition: "Deleted / corrected", action: "Confirm on next bureau pull. Done." },
      { condition: "Furnisher refuses or stalls", letterId: "L16", action: "Use L16 — Inconsistency Attack — to widen the front." },
    ],
    legalBasis: "FCRA §1681s-2(b) — Furnisher direct-dispute duties.",
  },

  L15B: {
    recipient: "The ORIGINAL CREDITOR (the bank / lender that issued the account) — used when they are still the furnisher of record, not a collector.",
    findAddress: "Creditor's 'Notice Address' or 'Credit Bureau Disputes' department on their website. If unsure, ask their customer service in writing for the correct dispute mailing address.",
    whenToSend: "Same triggers as L15A, but when the original creditor is the one reporting.",
    prerequisites: ["Same as L15A."],
    mustInclude: ["Same as L15A — name the §1681s-2(b) basis explicitly."],
    mustDo: ["Certified Mail · Return Receipt to the Notice Address (NOT the payment lockbox)."],
    doNot: ["Do NOT send to a branch location.", "Do NOT enclose payment."],
    expect: "30-day investigation duty. Big banks tend to comply; specialty lenders are slower.",
    nextStep: [
      { condition: "Corrected / deleted", action: "Done." },
      { condition: "No response", letterId: "L13", action: "Loop back into Phase 4 with renewed L13 and add the §1681s-2 violation." },
    ],
    legalBasis: "FCRA §1681s-2(b).",
  },

  L15C: {
    recipient: "The three bureaus, mailed the same day as L15A or L15B.",
    findAddress: "Bureau dispute P.O. Boxes.",
    whenToSend: "Same day as L15A/B so the furnisher and the bureau investigate concurrently and cannot deflect to each other.",
    prerequisites: ["L15A or L15B is being mailed today."],
    mustInclude: [
      "Reference that a parallel direct dispute has been served on the furnisher today.",
      "Tracking numbers for the L15A/B envelopes.",
    ],
    mustDo: ["Certified Mail · Return Receipt.", "Mail all four envelopes (furnisher + 3 bureaus) the same day."],
    doNot: ["Do NOT skip this step thinking 'the furnisher will tell them' — they often don't, and the bureau then claims it never knew."],
    expect: "Both ends investigate; results converge in 30 days.",
    nextStep: [
      { condition: "Deleted / corrected", action: "Done." },
      { condition: "Both verify the same wrong data", letterId: "L16", action: "Send L16 — Inconsistency Attack." },
    ],
    legalBasis: "FCRA §§1681i and 1681s-2(b) jointly.",
  },

  L16: {
    recipient: "All three bureaus, individually.",
    findAddress: "Bureau dispute P.O. Boxes.",
    whenToSend: "When the same account is reported with materially different data across bureaus (different balance, different open date, different status).",
    prerequisites: [
      "All three bureau reports pulled within 7 days of each other (so timing differences cannot explain gaps).",
      "A side-by-side table of the inconsistencies.",
    ],
    mustInclude: [
      "The side-by-side table with each bureau's reported figures.",
      "Statement that mutually exclusive data cannot all be 'accurate' — at least two are wrong by definition.",
    ],
    mustDo: ["Certified Mail · Return Receipt to each bureau."],
    doNot: ["Do NOT send the same chart of inconsistencies for unrelated items — keep one issue per envelope."],
    expect: "Bureaus often delete rather than reconcile, because reconciliation requires re-contacting the furnisher.",
    nextStep: [
      { condition: "Deleted on at least two bureaus", action: "Use the deletions to leverage the third — re-dispute citing the deletions as evidence." },
      { condition: "All three verify identically (rare)", letterId: "L17", action: "If charge-off, escalate with L17 specialty letter." },
    ],
    legalBasis: "FCRA §1681e(b) — maximum possible accuracy.",
  },

  L17: {
    recipient: "The furnisher of a charged-off account (often the original creditor).",
    findAddress: "Notice Address from the charge-off creditor.",
    whenToSend: "When a charge-off account shows continuing balance updates, status flips, re-aged Date of First Delinquency, or post-charge-off interest.",
    prerequisites: [
      "You can show specific re-aging evidence (e.g., DoFD moving forward month-to-month).",
      "Phase 4 has been attempted on the same account.",
    ],
    mustInclude: [
      "Documented re-aging or post-charge-off changes with dates.",
      "Citation of FCRA §1681s-2(a)(5)(A) — duty to report DoFD accurately.",
      "Demand for correction or deletion within 30 days.",
    ],
    mustDo: ["Certified Mail · Return Receipt.", "Mirror to bureaus via L15C if not already done."],
    doNot: ["Do NOT pay anything on a re-aged charge-off without first getting deletion in writing — payment can re-start the clock."],
    expect: "Most furnishers either correct or delete; few want to defend a re-aging pattern in writing.",
    nextStep: [
      { condition: "Deleted / corrected", action: "Done. Confirm DoFD held on next pull." },
      { condition: "Refused", action: "Add to Phase 6 packet — re-aging is a CFPB-priority violation." },
    ],
    legalBasis: "FCRA §1681s-2(a)(5) — accurate reporting of date of first delinquency.",
  },

  L18: {
    recipient: "The current owner of the debt (collector or original creditor) — only after validation has been satisfied or rejected, and only if you've decided you'd pay to make it disappear.",
    findAddress: "Same address you have been using for the account.",
    whenToSend: "Late in the process, after L01–L03 have run their course, when removal — not vindication — is the goal.",
    prerequisites: [
      "You have funds available to pay the agreed amount IN ONE PAYMENT immediately on signed agreement.",
      "You understand that pay-for-delete is at the creditor's discretion — they are not legally obligated to accept.",
      "The debt is genuinely yours OR validation succeeded.",
    ],
    mustInclude: [
      "Specific dollar offer (often 30–60% of balance for old debt, higher for fresh).",
      "Explicit condition: payment in exchange for COMPLETE DELETION of the tradeline from all three bureaus, not just 'paid' status.",
      "A demand that any agreement be returned in writing on company letterhead, signed, BEFORE you send funds.",
    ],
    mustDo: [
      "Get the agreement IN WRITING and signed before sending one dollar.",
      "Pay only by traceable method (cashier's check or money order with memo line referencing the agreement date).",
      "Save the agreement and proof of payment forever.",
    ],
    doNot: [
      "Do NOT pay first and trust them to delete — they almost never do.",
      "Do NOT accept 'paid in full' or 'settled' as a substitute — those leave the tradeline showing for 7 years.",
      "Do NOT give bank account or debit card numbers — they can later draft beyond the agreed amount.",
    ],
    expect: "Acceptance, counter-offer, or refusal within 30 days. Many large collectors have written policies against pay-for-delete; smaller ones often accept.",
    nextStep: [
      { condition: "Accepted in writing", action: "Pay by cashier's check, then verify deletion on the next two monthly reports." },
      { condition: "Counter-offered", action: "Negotiate in writing only. Revise L18 with new terms; re-mail certified." },
      { condition: "Refused", action: "Return to L11 / L15A and continue the dispute campaign — you have not damaged your case." },
    ],
    legalBasis: "Contract law — there is no FCRA right to pay-for-delete; the leverage is purely commercial.",
  },

  L19: {
    recipient: "The lender or company that pulled the unauthorized hard inquiry. (Inquiries you did authorize are NOT eligible.)",
    findAddress: "Listed on your credit report next to the inquiry. If only a code appears, call the bureau to obtain the full inquirer name and address (do not dispute via the call — get the address only).",
    whenToSend: "Within 2 years of the inquiry date — though faster is better; lenders purge old records.",
    prerequisites: [
      "You can confirm you did NOT apply for credit, services, or insurance with that company in the prior ~30 days of the inquiry date.",
      "It is not a 'soft' or 'promotional' pull — those don't affect score and are not actionable.",
    ],
    mustInclude: [
      "Inquiry date, bureau, inquirer name as it appears on the report.",
      "Statement that you did not initiate, authorize, or apply for any credit triggering this pull.",
      "Demand for written confirmation of removal request to the bureaus within 30 days.",
      "Citation: FCRA §1681b — permissible purpose.",
    ],
    mustDo: ["Certified Mail · Return Receipt.", "Mirror to all three bureaus listing the same inquiry as 'unauthorized — disputing with inquirer'."],
    doNot: [
      "Do NOT include this in the same envelope as a tradeline dispute — keep inquiries on their own letter.",
      "Do NOT dispute inquiries you actually generated by rate-shopping — those have FCRA protections of their own and you'll undermine your credibility.",
    ],
    expect: "Many removals within 30–45 days. Some require a follow-up; statutory damages of up to $1,000 per willful unauthorized pull are available if litigated.",
    nextStep: [
      { condition: "Inquirer removes the pull", action: "Confirm on the next bureau pull. Done." },
      { condition: "Inquirer refuses or claims permissible purpose without proof", action: "Add to Phase 6 packet — CFPB and State AG complaint. Consider FCRA counsel for a §1681b violation case." },
    ],
    legalBasis: "FCRA §1681b — Permissible purposes of consumer reports.",
  },
};
