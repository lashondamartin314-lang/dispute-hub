import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ClipboardList,
  Plus,
  Trash2,
  Download,
  Upload,
  Mail,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Pencil,
  X,
  BellRing,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { LETTERS, LETTERS_BY_ID, type LetterId } from "@/data/letters";
import { PHASES_BY_ID } from "@/data/phases";
import { toast } from "sonner";

export const Route = createFileRoute("/tracker")({
  head: () => ({
    meta: [
      { title: "Dispute Tracker · The Dispute Playbook" },
      {
        name: "description",
        content:
          "Log every letter you send. Track sent dates, certified mail, delivery, bureau and furnisher responses, and your next action — all in one place.",
      },
      { property: "og:title", content: "Dispute Tracker · Credit Academy" },
      {
        property: "og:description",
        content:
          "A free, private dispute tracker for sent dates, certified tracking, responses, and next actions.",
      },
    ],
  }),
  component: TrackerPage,
});

type Outcome = "pending" | "deleted" | "verified" | "updated" | "no_response" | "other";
type Recipient = "Equifax" | "Experian" | "TransUnion" | "Furnisher" | "Collector" | "Creditor" | "Other";

interface Entry {
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

const STORAGE_KEY = "dispute-tracker-v1";

const outcomeMeta: Record<Outcome, { label: string; tone: string }> = {
  pending: { label: "Awaiting response", tone: "var(--brand-gold-deep)" },
  deleted: { label: "Deleted ✓", tone: "var(--brand-emerald, #2f7a4f)" },
  verified: { label: "Verified (still on)", tone: "var(--brand-magenta)" },
  updated: { label: "Updated", tone: "var(--brand-violet)" },
  no_response: { label: "No response", tone: "var(--brand-magenta-deep, #9b1c5b)" },
  other: { label: "Other", tone: "var(--brand-ink)" },
};

type LetterDefault = {
  recipient: Recipient;
  nextAction: string;
  /** Days from sent date to set Next-Action Due. */
  dueDays: number;
};

const LETTER_DEFAULTS: Record<LetterId, LetterDefault> = {
  L01: { recipient: "Collector", nextAction: "If silent 30+ days, send L02 follow-up", dueDays: 30 },
  L02: { recipient: "Collector", nextAction: "Escalate to L03 or file CFPB complaint", dueDays: 15 },
  L03: { recipient: "Collector", nextAction: "If still reporting, send L04 or pivot to dispute", dueDays: 30 },
  L04: { recipient: "Collector", nextAction: "Begin Phase 4 bureau dispute (L11)", dueDays: 30 },
  L05: { recipient: "Creditor", nextAction: "Re-pull report and confirm update", dueDays: 30 },
  L06: { recipient: "Equifax", nextAction: "If unchanged, send L07 follow-up", dueDays: 30 },
  L07: { recipient: "Equifax", nextAction: "Escalate via L09 MOV demand", dueDays: 30 },
  L08: { recipient: "Equifax", nextAction: "Send ID + FTC affidavit, follow up in 30 days", dueDays: 30 },
  L09: { recipient: "Equifax", nextAction: "If no method given, file CFPB complaint", dueDays: 15 },
  L10: { recipient: "Equifax", nextAction: "Verify SSN/DOB across all 3 bureaus", dueDays: 30 },
  L11: { recipient: "Equifax", nextAction: "If verified, send L12 MOV demand", dueDays: 30 },
  L12: { recipient: "Equifax", nextAction: "If no real method, send L13 Notice of Intent", dueDays: 30 },
  L13: { recipient: "Equifax", nextAction: "File CFPB + state AG complaints, then L14", dueDays: 15 },
  L14: { recipient: "Equifax", nextAction: "Begin Phase 6 escalation", dueDays: 15 },
  L15A: { recipient: "Collector", nextAction: "Send L15C bureau companion", dueDays: 30 },
  L15B: { recipient: "Creditor", nextAction: "Send L15C bureau companion", dueDays: 30 },
  L15C: { recipient: "Equifax", nextAction: "Compare both responses; escalate inconsistencies", dueDays: 30 },
  L16: { recipient: "Furnisher", nextAction: "If verified, escalate with L17 or CFPB", dueDays: 30 },
  L17: { recipient: "Furnisher", nextAction: "Escalate to CFPB; consider counsel", dueDays: 30 },
  L18: { recipient: "Collector", nextAction: "Get written confirmation BEFORE paying", dueDays: 14 },
  L19: { recipient: "Equifax", nextAction: "If verified, escalate to creditor + CFPB", dueDays: 30 },
};

function addDays(iso: string, days: number): string {
  if (!iso) return "";
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return "";
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function applyLetterDefaults(entry: Entry, letterId: LetterId): Entry {
  const def = LETTER_DEFAULTS[letterId];
  if (!def) return { ...entry, letterId };
  const recipientName = entry.recipientName?.trim() ? entry.recipientName : def.recipient;
  const nextAction = entry.nextAction?.trim() ? entry.nextAction : def.nextAction;
  const nextActionDue =
    entry.nextActionDue?.trim()
      ? entry.nextActionDue
      : entry.sentDate
        ? addDays(entry.sentDate, def.dueDays)
        : "";
  return {
    ...entry,
    letterId,
    recipient: def.recipient,
    recipientName,
    nextAction,
    nextActionDue,
  };
}

const emptyEntry = (): Entry => ({
  id: crypto.randomUUID(),
  letterId: "",
  customLabel: "",
  recipient: "Equifax",
  recipientName: "",
  accountRef: "",
  sentDate: "",
  certifiedNumber: "",
  deliveredDate: "",
  responseDate: "",
  outcome: "pending",
  nextAction: "",
  nextActionDue: "",
  notes: "",
  createdAt: Date.now(),
});

function loadEntries(): Entry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Entry[];
  } catch {
    return [];
  }
}

function saveEntries(entries: Entry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function fmtDate(d: string) {
  if (!d) return "—";
  try {
    const date = new Date(d + "T00:00:00");
    return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return d;
  }
}

function daysSince(d: string): number | null {
  if (!d) return null;
  const sent = new Date(d + "T00:00:00").getTime();
  if (Number.isNaN(sent)) return null;
  return Math.floor((Date.now() - sent) / 86_400_000);
}

function toCSV(entries: Entry[]): string {
  const headers = [
    "Letter",
    "Recipient",
    "Recipient Name",
    "Account/Item",
    "Sent",
    "Certified #",
    "Delivered",
    "Response Date",
    "Outcome",
    "Next Action",
    "Next Action Due",
    "Notes",
  ];
  const escape = (s: string) => `"${(s ?? "").replace(/"/g, '""')}"`;
  const rows = entries.map((e) => {
    const letter = e.letterId ? `${e.letterId} ${LETTERS_BY_ID[e.letterId as LetterId]?.title ?? ""}`.trim() : (e.customLabel ?? "");
    return [
      letter,
      e.recipient,
      e.recipientName,
      e.accountRef,
      e.sentDate,
      e.certifiedNumber,
      e.deliveredDate,
      e.responseDate,
      outcomeMeta[e.outcome].label,
      e.nextAction,
      e.nextActionDue,
      e.notes,
    ].map(escape).join(",");
  });
  return [headers.join(","), ...rows].join("\n");
}

/** Parse a CSV string with quoted fields and embedded newlines. Returns rows of cells. */
function parseCSVRows(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(field); field = ""; }
      else if (c === "\n" || c === "\r") {
        if (c === "\r" && text[i + 1] === "\n") i++;
        row.push(field); field = "";
        if (row.length > 1 || row[0] !== "") rows.push(row);
        row = [];
      } else field += c;
    }
  }
  if (field !== "" || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const OUTCOME_BY_LABEL: Record<string, Outcome> = (Object.keys(outcomeMeta) as Outcome[]).reduce(
  (acc, k) => { acc[outcomeMeta[k].label.toLowerCase()] = k; return acc; },
  {} as Record<string, Outcome>,
);

const RECIPIENT_VALUES: Recipient[] = [
  "Equifax", "Experian", "TransUnion", "Furnisher", "Collector", "Creditor", "Other",
];

function fromCSV(text: string): { entries: Entry[]; skipped: number } {
  const rows = parseCSVRows(text);
  if (rows.length === 0) return { entries: [], skipped: 0 };
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (name: string) => header.indexOf(name.toLowerCase());
  const cLetter = idx("Letter");
  const cRecipient = idx("Recipient");
  const cRecipientName = idx("Recipient Name");
  const cAccount = idx("Account/Item");
  const cSent = idx("Sent");
  const cCert = idx("Certified #");
  const cDelivered = idx("Delivered");
  const cResponse = idx("Response Date");
  const cOutcome = idx("Outcome");
  const cNext = idx("Next Action");
  const cNextDue = idx("Next Action Due");
  const cNotes = idx("Notes");

  const out: Entry[] = [];
  let skipped = 0;
  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    if (cells.every((v) => !v?.trim())) continue;
    const get = (i: number) => (i >= 0 ? (cells[i] ?? "").trim() : "");

    const letterRaw = get(cLetter);
    const letterMatch = letterRaw.match(/^(L\d{1,2}[A-C]?)\b/i);
    const letterId = (letterMatch?.[1].toUpperCase() as LetterId | undefined) ?? "";
    const customLabel = letterId ? "" : letterRaw;

    if (!letterId && !customLabel) { skipped++; continue; }

    const recipientRaw = get(cRecipient);
    const recipient = (RECIPIENT_VALUES.find((v) => v.toLowerCase() === recipientRaw.toLowerCase()) ?? "Other") as Recipient;

    const outcomeRaw = get(cOutcome).toLowerCase();
    const outcome: Outcome = OUTCOME_BY_LABEL[outcomeRaw] ?? "pending";

    out.push({
      id: crypto.randomUUID(),
      letterId: letterId || "",
      customLabel,
      recipient,
      recipientName: get(cRecipientName),
      accountRef: get(cAccount),
      sentDate: get(cSent),
      certifiedNumber: get(cCert),
      deliveredDate: get(cDelivered),
      responseDate: get(cResponse),
      outcome,
      nextAction: get(cNext),
      nextActionDue: get(cNextDue),
      notes: get(cNotes),
      createdAt: Date.now() + r,
    });
  }
  return { entries: out, skipped };
}

const NOTIFIED_KEY = "dispute-tracker-notified-v1";

function loadNotified(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try { return JSON.parse(window.localStorage.getItem(NOTIFIED_KEY) || "{}"); } catch { return {}; }
}
function saveNotified(map: Record<string, string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(NOTIFIED_KEY, JSON.stringify(map));
}

function isOverdueDue(entry: Entry): boolean {
  if (entry.outcome !== "pending") return false;
  if (!entry.nextActionDue) return false;
  const due = new Date(entry.nextActionDue + "T23:59:59").getTime();
  return !Number.isNaN(due) && Date.now() > due;
}

function TrackerPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [editing, setEditing] = useState<Entry | null>(null);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | Outcome>("all");
  const [hydrated, setHydrated] = useState(false);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission | "unsupported">("default");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEntries(loadEntries());
    setHydrated(true);
    if (typeof window !== "undefined" && "Notification" in window) {
      setNotifPerm(Notification.permission);
    } else {
      setNotifPerm("unsupported");
    }
  }, []);

  useEffect(() => {
    if (hydrated) saveEntries(entries);
  }, [entries, hydrated]);

  // Overdue scan + browser notifications (one per entry per due date)
  useEffect(() => {
    if (!hydrated) return;
    const overdueEntries = entries.filter(isOverdueDue);
    if (overdueEntries.length === 0) return;

    const notified = loadNotified();
    let dirty = false;
    let toastShown = false;

    for (const e of overdueEntries) {
      const stamp = `${e.id}:${e.nextActionDue}`;
      if (notified[e.id] === e.nextActionDue) continue;
      const letterLabel = e.letterId
        ? `${e.letterId} ${LETTERS_BY_ID[e.letterId as LetterId]?.title ?? ""}`.trim()
        : (e.customLabel || "Untitled letter");

      if (!toastShown) {
        toast.warning(`${overdueEntries.length} overdue ${overdueEntries.length === 1 ? "entry" : "entries"}`, {
          description: `Earliest: ${letterLabel} — due ${fmtDate(e.nextActionDue)}`,
          duration: 8000,
        });
        toastShown = true;
      }

      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
        try {
          new Notification("Dispute Tracker — response overdue", {
            body: `${letterLabel}\nNext action was due ${fmtDate(e.nextActionDue)}`,
            tag: stamp,
          });
        } catch {
          /* noop */
        }
      }
      notified[e.id] = e.nextActionDue;
      dirty = true;
    }
    if (dirty) saveNotified(notified);
  }, [entries, hydrated]);

  function requestNotifications() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      toast.error("Browser notifications aren't supported here");
      return;
    }
    Notification.requestPermission().then((p) => {
      setNotifPerm(p);
      if (p === "granted") toast.success("Reminders on — we'll alert you when an entry goes overdue");
      else if (p === "denied") toast.error("Notifications blocked. Enable in your browser settings.");
    });
  }

  const stats = useMemo(() => {
    const total = entries.length;
    const pending = entries.filter((e) => e.outcome === "pending").length;
    const delivered = entries.filter((e) => e.deliveredDate).length;
    const wins = entries.filter((e) => e.outcome === "deleted" || e.outcome === "updated").length;
    const overdue = entries.filter(isOverdueDue).length;
    return { total, pending, delivered, wins, overdue };
  }, [entries]);

  const visible = useMemo(
    () => (filter === "all" ? entries : entries.filter((e) => e.outcome === filter)),
    [entries, filter],
  );

  const sorted = useMemo(
    () =>
      [...visible].sort((a, b) => {
        if (a.sentDate && b.sentDate) return b.sentDate.localeCompare(a.sentDate);
        return b.createdAt - a.createdAt;
      }),
    [visible],
  );

  function openAdd() {
    setEditing(emptyEntry());
    setOpen(true);
  }
  function openEdit(e: Entry) {
    setEditing({ ...e });
    setOpen(true);
  }
  function saveDraft() {
    if (!editing) return;
    setEntries((prev) => {
      const exists = prev.some((p) => p.id === editing.id);
      if (exists) return prev.map((p) => (p.id === editing.id ? editing : p));
      return [editing, ...prev];
    });
    setOpen(false);
    setEditing(null);
    toast.success("Saved to your tracker");
  }
  function removeEntry(id: string) {
    setEntries((prev) => prev.filter((p) => p.id !== id));
    toast.success("Entry removed");
  }
  function clearAll() {
    setEntries([]);
    toast.success("Tracker cleared");
  }
  function exportCsv() {
    const csv = toCSV(entries);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dispute-tracker-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
  function triggerImport() {
    fileInputRef.current?.click();
  }
  async function handleImportFile(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    try {
      const text = await file.text();
      const { entries: imported, skipped } = fromCSV(text);
      if (imported.length === 0) {
        toast.error("Couldn't find any rows. Make sure the CSV has the same headers as the export.");
        return;
      }
      setEntries((prev) => [...imported, ...prev]);
      toast.success(
        `Imported ${imported.length} ${imported.length === 1 ? "entry" : "entries"}` +
          (skipped ? ` · ${skipped} skipped` : ""),
      );
    } catch (err) {
      console.error(err);
      toast.error("Couldn't read that file");
    }
  }

  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden
          className="absolute inset-0 opacity-95"
          style={{
            background:
              "radial-gradient(60% 80% at 80% 0%, color-mix(in oklab, var(--brand-emerald, #2f7a4f) 22%, transparent), transparent 70%), radial-gradient(60% 70% at 0% 100%, color-mix(in oklab, var(--brand-violet) 18%, transparent), transparent 70%), var(--background)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-14 md:py-20">
          <p className="eyebrow text-[color:var(--brand-gold-deep)]">Companion Tool · Private to your browser</p>
          <h1 className="font-display mt-4 text-5xl leading-[0.95] md:text-7xl">
            Dispute <em className="font-editorial bg-gradient-to-r from-[color:var(--brand-magenta)] via-[color:var(--brand-violet)] to-[color:var(--brand-navy)] bg-clip-text text-transparent not-italic">Tracker</em>
          </h1>
          <p className="font-editorial mt-5 max-w-2xl text-lg text-foreground/80 md:text-xl">
            Log every letter you mail. Capture sent dates, certified tracking, delivery, the bureau or furnisher response, and your next move — all in one place. Saved privately on this device.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={openAdd} size="lg" className="rounded-full bg-[color:var(--brand-navy)] text-[color:var(--brand-cream)] hover:bg-[color:var(--brand-violet-deep)]">
              <Plus className="size-4" /> Log a letter
            </Button>
            <Button onClick={triggerImport} variant="outline" size="lg" className="rounded-full">
              <Upload className="size-4" /> Import CSV
            </Button>
            <Button onClick={exportCsv} variant="outline" size="lg" className="rounded-full" disabled={entries.length === 0}>
              <Download className="size-4" /> Export CSV
            </Button>
            {notifPerm !== "granted" && notifPerm !== "unsupported" && (
              <Button
                onClick={requestNotifications}
                variant="outline"
                size="lg"
                className="rounded-full border-[color:var(--brand-gold)] text-[color:var(--brand-gold-deep)] hover:bg-[color:var(--brand-gold)]/10"
              >
                <BellRing className="size-4" /> Turn on reminders
              </Button>
            )}
            <Link to="/letters" className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold hover:border-[color:var(--brand-gold)]">
              Browse letter library <ExternalLink className="size-3.5" />
            </Link>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleImportFile}
            />
          </div>
          {notifPerm === "granted" && (
            <p className="mt-3 inline-flex items-center gap-2 text-xs text-[color:var(--brand-emerald,#2f7a4f)]">
              <BellRing className="size-3.5" /> Reminders are on for this device. We'll alert you the moment a "Next action due" date passes.
            </p>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-6xl px-6 pt-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          <StatCard icon={<ClipboardList className="size-4" />} label="Logged" value={stats.total} tint="var(--brand-navy)" />
          <StatCard icon={<Clock className="size-4" />} label="Awaiting" value={stats.pending} tint="var(--brand-gold-deep)" />
          <StatCard icon={<Mail className="size-4" />} label="Delivered" value={stats.delivered} tint="var(--brand-violet)" />
          <StatCard icon={<CheckCircle2 className="size-4" />} label="Wins" value={stats.wins} tint="var(--brand-emerald, #2f7a4f)" />
          <StatCard icon={<AlertCircle className="size-4" />} label="Overdue" value={stats.overdue} tint="var(--brand-magenta-deep, #9b1c5b)" />
        </div>
      </section>

      {/* Filters + table */}
      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="eyebrow text-[10px]">Filter</span>
            {(["all", "pending", "deleted", "verified", "updated", "no_response"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition-all ${
                  filter === f
                    ? "border-[color:var(--brand-navy)] bg-[color:var(--brand-navy)] text-[color:var(--brand-cream)]"
                    : "border-border bg-card hover:border-[color:var(--brand-gold)]"
                }`}
              >
                {f === "all" ? "All" : outcomeMeta[f].label}
              </button>
            ))}
          </div>
          {entries.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  <Trash2 className="size-4" /> Clear all
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear the entire tracker?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This permanently removes all {entries.length} entr{entries.length === 1 ? "y" : "ies"} from this device. Export a CSV first if you want a backup.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAll}>Clear all</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {sorted.length === 0 ? (
          <EmptyState onAdd={openAdd} />
        ) : (
          <div className="grid gap-3">
            {sorted.map((e) => (
              <EntryCard key={e.id} entry={e} onEdit={() => openEdit(e)} onRemove={() => removeEntry(e.id)} />
            ))}
          </div>
        )}
      </section>

      {/* Editor dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">
              {editing && entries.some((p) => p.id === editing.id) ? "Edit entry" : "Log a letter"}
            </DialogTitle>
            <DialogDescription>
              Record what you sent, where it went, and what came back. Required: letter and sent date.
            </DialogDescription>
          </DialogHeader>

          {editing && (
            <div className="grid gap-4 py-2">
              <div className="grid gap-2">
                <Label>Letter</Label>
                <Select
                  value={editing.letterId || "custom"}
                  onValueChange={(v) =>
                    setEditing(
                      v === "custom"
                        ? { ...editing, letterId: "" }
                        : applyLetterDefaults(editing, v as LetterId),
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a Playbook letter" />
                  </SelectTrigger>
                  <SelectContent className="max-h-72">
                    {LETTERS.map((l) => (
                      <SelectItem key={l.id} value={l.id}>
                        <span className="font-mono text-xs opacity-60 mr-1.5">{l.id}</span>
                        {l.title}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">— Custom (not in Playbook)</SelectItem>
                  </SelectContent>
                </Select>
                {!editing.letterId && (
                  <Input
                    placeholder="Custom letter label (e.g., Goodwill — Capital One)"
                    value={editing.customLabel ?? ""}
                    onChange={(ev) => setEditing({ ...editing, customLabel: ev.target.value })}
                  />
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Recipient type</Label>
                  <Select value={editing.recipient} onValueChange={(v) => setEditing({ ...editing, recipient: v as Recipient })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Equifax">Equifax</SelectItem>
                      <SelectItem value="Experian">Experian</SelectItem>
                      <SelectItem value="TransUnion">TransUnion</SelectItem>
                      <SelectItem value="Collector">Collector</SelectItem>
                      <SelectItem value="Creditor">Original creditor</SelectItem>
                      <SelectItem value="Furnisher">Furnisher (other)</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label>Recipient name (optional)</Label>
                  <Input
                    placeholder="e.g., Midland Credit Mgmt"
                    value={editing.recipientName}
                    onChange={(ev) => setEditing({ ...editing, recipientName: ev.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Account / item reference</Label>
                <Input
                  placeholder="Last 4, account #, or item description"
                  value={editing.accountRef}
                  onChange={(ev) => setEditing({ ...editing, accountRef: ev.target.value })}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label>Sent date</Label>
                  <Input type="date" value={editing.sentDate} onChange={(ev) => setEditing({ ...editing, sentDate: ev.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Delivered</Label>
                  <Input type="date" value={editing.deliveredDate} onChange={(ev) => setEditing({ ...editing, deliveredDate: ev.target.value })} />
                </div>
                <div className="grid gap-2">
                  <Label>Response received</Label>
                  <Input type="date" value={editing.responseDate} onChange={(ev) => setEditing({ ...editing, responseDate: ev.target.value })} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>USPS certified tracking #</Label>
                <Input
                  placeholder="9214 7901 2345 6789 0123 45"
                  value={editing.certifiedNumber}
                  onChange={(ev) => setEditing({ ...editing, certifiedNumber: ev.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label>Outcome</Label>
                <Select value={editing.outcome} onValueChange={(v) => setEditing({ ...editing, outcome: v as Outcome })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(Object.keys(outcomeMeta) as Outcome[]).map((k) => (
                      <SelectItem key={k} value={k}>{outcomeMeta[k].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
                <div className="grid gap-2">
                  <Label>Next action</Label>
                  <Input
                    placeholder="e.g., Send L02 follow-up"
                    value={editing.nextAction}
                    onChange={(ev) => setEditing({ ...editing, nextAction: ev.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Due</Label>
                  <Input type="date" value={editing.nextActionDue} onChange={(ev) => setEditing({ ...editing, nextActionDue: ev.target.value })} />
                </div>
              </div>

              <div className="grid gap-2">
                <Label>Notes</Label>
                <Textarea
                  rows={3}
                  placeholder="Anything you want to remember about this round."
                  value={editing.notes}
                  onChange={(ev) => setEditing({ ...editing, notes: ev.target.value })}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={saveDraft} disabled={!editing || (!editing.letterId && !editing.customLabel) || !editing.sentDate}>
              Save entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ icon, label, value, tint }: { icon: React.ReactNode; label: string; value: number; tint: string }) {
  return (
    <div
      className="rounded-2xl border-2 bg-card p-4 shadow-sm"
      style={{
        borderColor: `color-mix(in oklab, ${tint} 35%, transparent)`,
        background: `color-mix(in oklab, ${tint} 6%, var(--card))`,
      }}
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]" style={{ color: tint }}>
        {icon} {label}
      </div>
      <div className="font-display mt-2 text-3xl text-[color:var(--brand-ink)]">{value}</div>
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="rounded-3xl border-2 border-dashed border-border bg-card p-10 text-center">
      <ClipboardList className="mx-auto size-10 text-muted-foreground" />
      <h2 className="font-display mt-4 text-2xl">No entries yet</h2>
      <p className="font-editorial mt-2 text-muted-foreground">
        Every letter you mail belongs here. Start with the validation letter, the bureau dispute, or whatever round you’re on now.
      </p>
      <Button onClick={onAdd} className="mt-5 rounded-full bg-[color:var(--brand-navy)] text-[color:var(--brand-cream)] hover:bg-[color:var(--brand-violet-deep)]">
        <Plus className="size-4" /> Log your first letter
      </Button>
    </div>
  );
}

function EntryCard({ entry, onEdit, onRemove }: { entry: Entry; onEdit: () => void; onRemove: () => void }) {
  const letter = entry.letterId ? LETTERS_BY_ID[entry.letterId as LetterId] : null;
  const phase = letter ? PHASES_BY_ID[letter.phaseId] : null;
  const accent = phase ? `var(${phase.colorVar})` : "var(--brand-navy)";
  const days = daysSince(entry.sentDate);
  const overdue = entry.outcome === "pending" && days !== null && days > 30;
  const tone = outcomeMeta[entry.outcome].tone;

  return (
    <article
      className="relative overflow-hidden rounded-2xl border-2 bg-card p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-elegant"
      style={{ borderColor: `color-mix(in oklab, ${accent} 35%, transparent)` }}
    >
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ background: `linear-gradient(180deg, ${accent}, ${tone})` }}
      />
      <div className="flex flex-wrap items-start justify-between gap-3 pl-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {letter ? (
              <>
                <span className="font-mono text-xs text-muted-foreground">{letter.id}</span>
                <Link
                  to="/playbook/letter/$id"
                  params={{ id: letter.id as LetterId }}
                  className="font-display text-lg leading-tight text-[color:var(--brand-ink)] hover:underline"
                >
                  {letter.title}
                </Link>
              </>
            ) : (
              <h3 className="font-display text-lg leading-tight text-[color:var(--brand-ink)]">{entry.customLabel || "Untitled letter"}</h3>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            <strong className="text-foreground">{entry.recipient}</strong>
            {entry.recipientName ? ` · ${entry.recipientName}` : ""}
            {entry.accountRef ? ` · ${entry.accountRef}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="border-2"
            style={{ borderColor: `color-mix(in oklab, ${tone} 50%, transparent)`, color: tone, background: `color-mix(in oklab, ${tone} 8%, transparent)` }}
          >
            {outcomeMeta[entry.outcome].label}
          </Badge>
          {overdue && (
            <Badge className="bg-[color:var(--brand-magenta-deep,#9b1c5b)] text-[color:var(--brand-cream)]">
              {days}d overdue
            </Badge>
          )}
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-3 pl-3 text-sm md:grid-cols-4">
        <Field label="Sent" value={fmtDate(entry.sentDate)} />
        <Field label="Delivered" value={fmtDate(entry.deliveredDate)} />
        <Field label="Response" value={fmtDate(entry.responseDate)} />
        <Field
          label="Certified #"
          value={
            entry.certifiedNumber ? (
              <a
                className="break-all text-[color:var(--brand-violet)] underline-offset-2 hover:underline"
                href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodeURIComponent(entry.certifiedNumber.replace(/\s+/g, ""))}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {entry.certifiedNumber}
              </a>
            ) : (
              "—"
            )
          }
        />
      </dl>

      {(entry.nextAction || entry.notes) && (
        <div className="mt-4 grid gap-2 rounded-xl bg-muted/40 p-3 pl-3">
          {entry.nextAction && (
            <p className="text-sm">
              <span className="eyebrow text-[10px] mr-2">Next</span>
              <span className="font-semibold">{entry.nextAction}</span>
              {entry.nextActionDue && <span className="ml-2 text-muted-foreground">· due {fmtDate(entry.nextActionDue)}</span>}
            </p>
          )}
          {entry.notes && <p className="text-sm text-muted-foreground whitespace-pre-wrap">{entry.notes}</p>}
        </div>
      )}

      <div className="mt-4 flex items-center justify-end gap-2 pl-3">
        <Button variant="ghost" size="sm" onClick={onEdit}>
          <Pencil className="size-3.5" /> Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-[color:var(--brand-magenta-deep,#9b1c5b)]">
              <X className="size-3.5" /> Remove
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove this entry?</AlertDialogTitle>
              <AlertDialogDescription>This can't be undone.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onRemove}>Remove</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="eyebrow text-[10px]">{label}</dt>
      <dd className="mt-0.5 font-medium text-foreground">{value}</dd>
    </div>
  );
}
