// Bureau Response Decoder data
// Plain-English translations of common phrases credit bureaus and furnishers
// use in dispute responses, plus the recommended next move.

export type ResponseSeverity = "good" | "neutral" | "warning" | "bad";

export type ResponseCategory =
  | "verified"
  | "stall"
  | "deletion"
  | "update"
  | "frivolous"
  | "furnisher"
  | "identity"
  | "procedural";

export interface BureauResponse {
  id: string;
  /** The exact-ish phrase the bureau uses. */
  phrase: string;
  /** Other ways the same outcome is phrased. */
  aliases?: string[];
  category: ResponseCategory;
  severity: ResponseSeverity;
  /** Plain-English explanation of what the bureau actually did. */
  meaning: string;
  /** What this means for the consumer's file. */
  impact: string;
  /** Recommended next action(s). */
  nextStep: string;
  /** Suggested letter ID(s) from the playbook letter library. */
  suggestedLetters?: string[];
  /** Optional consumer right / FCRA reference. */
  citation?: string;
}

export const RESPONSE_CATEGORIES: { id: ResponseCategory; label: string }[] = [
  { id: "verified", label: "Verified / Remains" },
  { id: "deletion", label: "Deletion / Removed" },
  { id: "update", label: "Updated / Modified" },
  { id: "stall", label: "Stall tactics" },
  { id: "frivolous", label: "Frivolous / Suspicious" },
  { id: "furnisher", label: "Furnisher response" },
  { id: "identity", label: "Identity / Verification" },
  { id: "procedural", label: "Procedural" },
];

export const SEVERITY_LABEL: Record<ResponseSeverity, string> = {
  good: "Win",
  neutral: "Neutral",
  warning: "Watch out",
  bad: "Pushback",
};

export const BUREAU_RESPONSES: BureauResponse[] = [
  // ───────────── Verified / Remains ─────────────
  {
    id: "verified-as-reported",
    phrase: "Verified as reported",
    aliases: ["Information verified", "Account verified"],
    category: "verified",
    severity: "bad",
    meaning:
      "The bureau says it contacted the data furnisher and the furnisher confirmed the account is being reported correctly. In practice, this is almost always an automated e-OSCAR ping, not a real review of documents.",
    impact:
      "The disputed item stays on your report exactly as it was. No correction was made.",
    nextStep:
      "Send a Method of Verification (MOV) demand. Force the bureau to disclose WHO they spoke to, WHEN, HOW, and what documents were reviewed. If they can't produce it within 15 days, the item must be deleted under FCRA §611(a)(7).",
    suggestedLetters: ["L08", "L09"],
    citation: "FCRA §611(a)(7) — Method of Verification",
  },
  {
    id: "remains",
    phrase: "Remains",
    aliases: ["Item remains", "Account remains as is"],
    category: "verified",
    severity: "bad",
    meaning:
      "Short-form code on the dispute results page meaning the bureau decided no change was warranted. Same as 'verified.'",
    impact: "Account stays. Score impact is unchanged.",
    nextStep:
      "Pivot strategy. Round 2 should attack METHOD of verification, not the original error. Then take the dispute directly to the furnisher with a debt validation or 623 letter.",
    suggestedLetters: ["L08", "L11", "L12"],
  },
  {
    id: "meets-fcra",
    phrase: "Meets FCRA requirements",
    category: "verified",
    severity: "bad",
    meaning:
      "Generic compliance language meaning the bureau believes its reinvestigation met federal standards. Often boilerplate, not item-specific.",
    impact: "No deletion. The account continues to report.",
    nextStep:
      "Demand a description of the reinvestigation procedure (FCRA §611(a)(6)(B)(iii)). Then escalate to the furnisher with a 623 dispute citing the specific inaccuracy.",
    suggestedLetters: ["L08", "L12"],
  },

  // ───────────── Deletion / Removed ─────────────
  {
    id: "deleted",
    phrase: "Deleted",
    aliases: ["Item removed", "Account deleted from file"],
    category: "deletion",
    severity: "good",
    meaning:
      "The bureau removed the disputed item from your file. The furnisher either agreed to remove, didn't respond in time (30 days), or couldn't verify.",
    impact:
      "The tradeline is gone. Score should improve at the next refresh. Pull a fresh report in 7–14 days to confirm it's also gone from the other two bureaus.",
    nextStep:
      "Log the deletion in the tracker with the date and bureau. Pull all three reports and dispute the same account at any bureau still showing it.",
    suggestedLetters: [],
  },
  {
    id: "suppressed",
    phrase: "Suppressed",
    aliases: ["Account suppressed", "Hidden from report"],
    category: "deletion",
    severity: "warning",
    meaning:
      "The bureau is temporarily hiding the account from your report but the data is still on file. Often a placeholder while the dispute is in progress.",
    impact:
      "The item won't show on a pulled report right now, but it can come back if the furnisher re-reports it or the dispute is closed against you.",
    nextStep:
      "Wait 30 days, then pull a fresh report. If it returns, send a re-insertion notice demand under FCRA §611(a)(5)(B) — bureaus must notify you within 5 business days of any re-insertion.",
    citation: "FCRA §611(a)(5)(B) — Reinsertion notice",
  },

  // ───────────── Updated / Modified ─────────────
  {
    id: "updated",
    phrase: "Updated",
    aliases: ["Information updated", "Account updated"],
    category: "update",
    severity: "neutral",
    meaning:
      "Something on the tradeline changed — could be balance, status, payment history, or even just a date. The bureau won't always tell you which field changed.",
    impact:
      "Could help OR hurt your score. An 'updated' late-pay account can refresh the date and make recent damage look more recent.",
    nextStep:
      "Compare the new tradeline side-by-side with your old report. If the date last reported moved without a real account event, dispute again as 'inaccurate / re-aged.'",
    suggestedLetters: ["L05", "L08"],
  },
  {
    id: "modified",
    phrase: "Modified",
    category: "update",
    severity: "neutral",
    meaning:
      "Same family as 'updated' — the bureau changed at least one field on the account.",
    impact: "Re-pull and verify which field changed before celebrating.",
    nextStep:
      "If the modification didn't fix the dispute you actually filed, send a follow-up dispute citing the specific field that's still wrong.",
    suggestedLetters: ["L05"],
  },

  // ───────────── Stall tactics ─────────────
  {
    id: "frivolous",
    phrase: "Frivolous or irrelevant",
    aliases: ["Dispute frivolous", "Considered frivolous"],
    category: "frivolous",
    severity: "warning",
    meaning:
      "The bureau is refusing to investigate your dispute, claiming it has no merit or that you didn't provide enough information. Often triggered by template letters that look credit-repair-company generated.",
    impact:
      "Your dispute is closed without an investigation. The clock does NOT restart automatically.",
    nextStep:
      "Send a Frivolous Rebuttal: state the dispute is bona fide, list the specific inaccuracy, attach proof of identity (ID + utility bill), and demand reinvestigation. Always handwrite or personalize — never use generic templates.",
    suggestedLetters: ["L09"],
    citation: "FCRA §611(a)(3) — bureau must explain the frivolous determination",
  },
  {
    id: "previously-investigated",
    phrase: "Previously investigated",
    aliases: ["Same dispute already processed"],
    category: "stall",
    severity: "warning",
    meaning:
      "The bureau says you already disputed this and they already verified it, so they won't reinvestigate.",
    impact: "Dispute closed. No new investigation.",
    nextStep:
      "Submit NEW relevant information (a different angle, new document, or different specific inaccuracy). Or pivot directly to a 623 furnisher dispute. The 'previously investigated' shield only applies when nothing has changed.",
    suggestedLetters: ["L08", "L12"],
  },
  {
    id: "no-info-provided",
    phrase: "Insufficient information provided",
    aliases: ["Need more information", "Unable to process"],
    category: "stall",
    severity: "warning",
    meaning:
      "Bureau claims they can't tell what you disputed or who you are. Sometimes legitimate, often a stall on properly filed disputes.",
    impact: "Nothing happens until you respond.",
    nextStep:
      "Re-file with: full name, current address, DOB, last-4 SSN, account number, the SPECIFIC field you dispute, and proof of identity. Send certified mail with return receipt so they can't claim non-delivery.",
  },
  {
    id: "stall-30-day",
    phrase: "We need additional 15 days",
    aliases: ["Investigation extended"],
    category: "stall",
    severity: "warning",
    meaning:
      "The bureau is invoking the 15-day extension allowed when you submit additional documents mid-dispute (FCRA §611(a)(1)(B)). Total window becomes 45 days.",
    impact: "Your investigation now has 15 extra days to complete.",
    nextStep:
      "Mark the new deadline in the tracker. If they still don't respond within the extended 45 days, the disputed item must be deleted.",
    citation: "FCRA §611(a)(1)(B)",
  },

  // ───────────── Furnisher ─────────────
  {
    id: "furnisher-no-response",
    phrase: "Creditor did not respond",
    aliases: ["No response from data furnisher"],
    category: "furnisher",
    severity: "good",
    meaning:
      "The bureau forwarded your dispute to the furnisher and got no answer within 30 days.",
    impact:
      "By law the item must be deleted or modified to match your dispute. This is an automatic win.",
    nextStep:
      "Confirm deletion on your next report pull. If it's still there, send a Failure-to-Verify Demand citing FCRA §611(a)(5)(A).",
    citation: "FCRA §611(a)(5)(A)(i)",
  },
  {
    id: "furnisher-confirmed",
    phrase: "Creditor confirmed accuracy",
    aliases: ["Furnisher verified", "Data furnisher reaffirmed"],
    category: "furnisher",
    severity: "bad",
    meaning:
      "The original creditor told the bureau the account is accurate. May or may not include actual document review on their end.",
    impact: "Account stays. Bureau treats this as final.",
    nextStep:
      "Skip the bureau and dispute directly with the furnisher under FCRA §623 — include a debt validation request if it's a collection, or proof of payment / contract dispute if it's a tradeline.",
    suggestedLetters: ["L11", "L12"],
    citation: "FCRA §623(b) — furnisher direct dispute",
  },

  // ───────────── Identity ─────────────
  {
    id: "identity-not-verified",
    phrase: "Unable to verify identity",
    aliases: ["Identity verification failed"],
    category: "identity",
    severity: "warning",
    meaning:
      "Bureau says the personal info on your dispute doesn't match what's on your file. Often happens when old addresses or aliases are still on the report.",
    impact: "Dispute closed without action.",
    nextStep:
      "Send a Personal Information Cleanup request first (remove old addresses and unfamiliar names), then re-file the original dispute with current ID + utility bill matching the address on file.",
    suggestedLetters: ["L03"],
  },
  {
    id: "fraud-block-confirmed",
    phrase: "Fraud block confirmed",
    aliases: ["Item blocked under §605B"],
    category: "identity",
    severity: "good",
    meaning:
      "Under FCRA §605B, items resulting from identity theft must be blocked within 4 business days of receiving an FTC Identity Theft Report. The bureau is confirming the block.",
    impact:
      "The fraudulent items are off your file. The furnisher is also barred from re-reporting them.",
    nextStep:
      "Keep your IdentityTheft.gov report, the police report, and the bureau's confirmation letter together for at least 7 years.",
    citation: "FCRA §605B",
  },

  // ───────────── Procedural ─────────────
  {
    id: "results-enclosed",
    phrase: "Results enclosed",
    aliases: ["See enclosed report"],
    category: "procedural",
    severity: "neutral",
    meaning:
      "Cover-letter language. The decision is in the attached report — you have to read each line item to know what actually happened.",
    impact: "Depends on the per-item codes inside (Verified, Updated, Deleted, etc.).",
    nextStep:
      "Decode each line item in the enclosed report individually using this tool, then log the outcome per dispute in the tracker.",
  },
  {
    id: "consumer-statement-added",
    phrase: "Consumer statement added",
    category: "procedural",
    severity: "neutral",
    meaning:
      "Bureau attached a 100-word statement you submitted to the disputed account. The account itself was not removed or changed.",
    impact:
      "Most automated underwriting systems IGNORE consumer statements. Useful for manual underwriters only.",
    nextStep:
      "Don't rely on this as a fix. Continue disputing the underlying item with the furnisher.",
  },
];

export function searchResponses(query: string): BureauResponse[] {
  const q = query.trim().toLowerCase();
  if (!q) return BUREAU_RESPONSES;
  return BUREAU_RESPONSES.filter((r) => {
    const haystack = [
      r.phrase,
      ...(r.aliases ?? []),
      r.meaning,
      r.impact,
      r.nextStep,
      r.category,
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}
