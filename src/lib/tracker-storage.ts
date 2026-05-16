// Shared helpers for reading/writing dispute-tracker entries from anywhere
// in the app (tracker page, decoder "Save to tracker", etc.).
//
// The shape MUST stay in sync with src/routes/tracker.tsx.

import type { LetterId } from "@/data/letters";

export type Outcome = "pending" | "deleted" | "verified" | "updated" | "no_response" | "other";

export type Recipient =
  | "Equifax"
  | "Experian"
  | "TransUnion"
  | "Furnisher"
  | "Collector"
  | "Creditor"
  | "Other";

export interface TrackerEntry {
  id: string;
  letterId?: LetterId | "";
  customLabel?: string;
  recipient: Recipient;
  recipientName: string;
  accountRef: string;
  sentDate: string;
  certifiedNumber: string;
  deliveredDate: string;
  responseDate: string;
  outcome: Outcome;
  nextAction: string;
  nextActionDue: string;
  notes: string;
  createdAt: number;
}

export const TRACKER_STORAGE_KEY = "dispute-tracker-v1";

interface LetterDefault {
  recipient: Recipient;
  nextAction: string;
  /** Days from sent date to set Next-Action Due. */
  dueDays: number;
}

const LETTER_DEFAULTS: Partial<Record<LetterId, LetterDefault>> = {
  L01: {
    recipient: "Collector",
    nextAction: "If silent 30+ days, send L02 follow-up",
    dueDays: 30,
  },
  L02: {
    recipient: "Collector",
    nextAction: "Escalate to L03 or file CFPB complaint",
    dueDays: 15,
  },
  L03: {
    recipient: "Collector",
    nextAction: "If still reporting, send L04 or pivot to dispute",
    dueDays: 30,
  },
  L04: { recipient: "Collector", nextAction: "Begin Phase 4 bureau dispute (L11)", dueDays: 30 },
  L05: { recipient: "Creditor", nextAction: "Re-pull report and confirm update", dueDays: 30 },
  L06: { recipient: "Equifax", nextAction: "If unchanged, send L07 follow-up", dueDays: 30 },
  L07: { recipient: "Equifax", nextAction: "Escalate via L09 MOV demand", dueDays: 30 },
  L08: {
    recipient: "Equifax",
    nextAction: "Send ID + FTC affidavit, follow up in 30 days",
    dueDays: 30,
  },
  L09: { recipient: "Equifax", nextAction: "If no method given, file CFPB complaint", dueDays: 15 },
  L10: { recipient: "Equifax", nextAction: "Verify SSN/DOB across all 3 bureaus", dueDays: 30 },
  L11: { recipient: "Equifax", nextAction: "If verified, send L12 MOV demand", dueDays: 30 },
  L12: {
    recipient: "Equifax",
    nextAction: "If no real method, send L13 Notice of Intent",
    dueDays: 30,
  },
  L13: {
    recipient: "Equifax",
    nextAction: "File CFPB + state AG complaints, then L14",
    dueDays: 15,
  },
  L14: { recipient: "Equifax", nextAction: "Begin Phase 6 escalation", dueDays: 15 },
  L15A: { recipient: "Collector", nextAction: "Send L15C bureau companion", dueDays: 30 },
  L15B: { recipient: "Creditor", nextAction: "Send L15C bureau companion", dueDays: 30 },
  L15C: {
    recipient: "Equifax",
    nextAction: "Compare both responses; escalate inconsistencies",
    dueDays: 30,
  },
  L16: {
    recipient: "Furnisher",
    nextAction: "If verified, escalate with L17 or CFPB",
    dueDays: 30,
  },
  L17: { recipient: "Furnisher", nextAction: "Escalate to CFPB; consider counsel", dueDays: 30 },
  L18: {
    recipient: "Collector",
    nextAction: "Get written confirmation BEFORE paying",
    dueDays: 14,
  },
  L19: {
    recipient: "Equifax",
    nextAction: "If verified, escalate to creditor + CFPB",
    dueDays: 30,
  },
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function loadTrackerEntries(): TrackerEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(TRACKER_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TrackerEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveTrackerEntries(entries: TrackerEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TRACKER_STORAGE_KEY, JSON.stringify(entries));
}

export interface AppendTrackerInput {
  letterId?: LetterId;
  customLabel?: string;
  notes?: string;
  accountRef?: string;
  /** Override the default sent date (ISO yyyy-mm-dd). Defaults to today. */
  sentDate?: string;
  /** Override the default due-days from the letter playbook. */
  dueDays?: number;
}

/**
 * Append a tracker entry derived from a suggested letter (e.g. from the
 * Bureau Response Decoder). Pre-fills recipient, next action, and a sensible
 * due date from the letter playbook so the user only has to confirm details.
 */
export function appendTrackerEntry(input: AppendTrackerInput): TrackerEntry {
  const sent = input.sentDate || todayISO();
  const def = input.letterId ? LETTER_DEFAULTS[input.letterId] : undefined;
  const dueDays = input.dueDays ?? def?.dueDays ?? 30;

  const entry: TrackerEntry = {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    letterId: input.letterId ?? "",
    customLabel: input.customLabel ?? "",
    recipient: def?.recipient ?? "Equifax",
    recipientName: def?.recipient ?? "",
    accountRef: input.accountRef ?? "",
    sentDate: sent,
    certifiedNumber: "",
    deliveredDate: "",
    responseDate: "",
    outcome: "pending",
    nextAction: def?.nextAction ?? "",
    nextActionDue: addDays(sent, dueDays),
    notes: input.notes ?? "",
    createdAt: Date.now(),
  };

  const all = loadTrackerEntries();
  saveTrackerEntries([entry, ...all]);
  return entry;
}
