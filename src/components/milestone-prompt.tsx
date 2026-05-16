import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Mail, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Phase } from "@/data/phases";
import { lettersForPhase } from "@/data/letters";
import { appendTrackerEntry } from "@/lib/tracker-storage";

const PROMPT_KEY = (phaseId: string) => `milestone-prompt-shown:${phaseId}`;

interface RowState {
  letterId: string;
  title: string;
  include: boolean;
  sentDate: string;
  certifiedNumber: string;
  accountRef: string;
  notes: string;
}

interface Props {
  phase: Phase;
  /** True once the checklist has just hit 100%. Parent owns this signal. */
  open: boolean;
  onClose: () => void;
  /** Optional email pre-fill (when the user is signed in). */
  defaultEmail?: string;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function buildRows(phase: Phase): RowState[] {
  return lettersForPhase(phase.id).map((l) => ({
    letterId: l.id,
    title: l.title,
    include: true,
    sentDate: todayISO(),
    certifiedNumber: "",
    accountRef: "",
    notes: "",
  }));
}

export function MilestonePrompt({ phase, open, onClose, defaultEmail }: Props) {
  const [rows, setRows] = useState<RowState[]>(() => buildRows(phase));
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [savedCount, setSavedCount] = useState<number | null>(null);

  // Reset when the phase changes or the dialog re-opens.
  useEffect(() => {
    if (open) {
      setRows(buildRows(phase));
      setSavedCount(null);
      if (defaultEmail) setEmail(defaultEmail);
    }
  }, [open, phase, defaultEmail]);

  const phaseColor = `var(${phase.colorVar})`;
  const phaseDeep = `var(${phase.colorVar}-deep)`;

  function update<K extends keyof RowState>(idx: number, key: K, value: RowState[K]) {
    setRows((prev) => prev.map((r, i) => (i === idx ? { ...r, [key]: value } : r)));
  }

  function handleSave() {
    const included = rows.filter((r) => r.include);
    included.forEach((r) => {
      appendTrackerEntry({
        // Cast: letterId values come from the typed Letter list above.
        letterId: r.letterId as Parameters<typeof appendTrackerEntry>[0]["letterId"],
        sentDate: r.sentDate || todayISO(),
        accountRef: r.accountRef.slice(0, 80),
        notes: r.notes.slice(0, 400),
      });
    });
    setSavedCount(included.length);
  }

  function handleEmailMyself() {
    const included = rows.filter((r) => r.include);
    if (included.length === 0 || !email.trim()) return;

    const subject = `Phase ${phase.number} — ${phase.name} · Tracker summary`;
    const lines: string[] = [
      `Phase ${phase.number}: ${phase.name}`,
      `Marked complete: ${new Date().toLocaleString()}`,
      "",
      "Save this email — it's your paper trail for the letters you sent in this phase.",
      "",
    ];
    included.forEach((r) => {
      lines.push(`— ${r.letterId}: ${r.title}`);
      lines.push(`   Sent: ${r.sentDate || "(not set)"}`);
      if (r.certifiedNumber) lines.push(`   Certified #: ${r.certifiedNumber}`);
      if (r.accountRef) lines.push(`   Account ref: ${r.accountRef}`);
      if (r.notes) lines.push(`   Notes: ${r.notes}`);
      lines.push(`   Follow up by: 30 days from sent date`);
      lines.push("");
    });
    lines.push("— Credit Academy · The Dispute Playbook");

    const href = `mailto:${encodeURIComponent(email.trim())}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
    window.location.href = href;
  }

  function dismiss() {
    try {
      window.localStorage.setItem(PROMPT_KEY(phase.id), "1");
    } catch {
      /* ignore */
    }
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && dismiss()}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <p
            className="font-mono text-[10px] uppercase tracking-wider"
            style={{ color: phaseDeep }}
          >
            Milestone · Phase {phase.number}
          </p>
          <DialogTitle className="font-display text-2xl leading-tight md:text-3xl">
            Lock {phase.name} into your tracker.
          </DialogTitle>
          <DialogDescription className="font-editorial text-base text-foreground/75">
            Fill in the dates and certified-mail numbers for the letters you sent in this phase.
            Save it to your tracker, and email yourself a copy so you have a paper trail with
            response deadlines.
          </DialogDescription>
        </DialogHeader>

        {rows.length === 0 ? (
          <p className="rounded-md bg-muted/40 px-3 py-3 text-sm text-muted-foreground">
            This phase doesn't have letter-based steps to log. You can still close this and the
            badge stays on your profile.
          </p>
        ) : (
          <ul
            className="mt-2 space-y-3 rounded-2xl border-2 p-3"
            style={{
              borderColor: `color-mix(in oklab, ${phaseColor} 28%, transparent)`,
              background: `color-mix(in oklab, ${phaseColor} 5%, var(--card))`,
            }}
          >
            {rows.map((r, i) => (
              <li
                key={r.letterId}
                className={cn(
                  "rounded-xl border bg-card p-3 transition-opacity",
                  !r.include && "opacity-50",
                )}
                style={{ borderColor: "var(--border)" }}
              >
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={r.include}
                    onChange={(e) => update(i, "include", e.target.checked)}
                    aria-label={`Include ${r.letterId}`}
                    className="mt-1 size-4"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className="font-mono text-[10px] uppercase tracking-wider"
                      style={{ color: phaseDeep }}
                    >
                      {r.letterId}
                    </p>
                    <p className="text-sm font-semibold leading-snug">{r.title}</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <Field label="Sent date">
                        <input
                          type="date"
                          value={r.sentDate}
                          onChange={(e) => update(i, "sentDate", e.target.value)}
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Certified #">
                        <input
                          type="text"
                          value={r.certifiedNumber}
                          maxLength={40}
                          onChange={(e) => update(i, "certifiedNumber", e.target.value)}
                          placeholder="USPS tracking"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Account ref (optional)">
                        <input
                          type="text"
                          value={r.accountRef}
                          maxLength={80}
                          onChange={(e) => update(i, "accountRef", e.target.value)}
                          placeholder="Last 4, account name…"
                          className={inputCls}
                        />
                      </Field>
                      <Field label="Notes (optional)">
                        <input
                          type="text"
                          value={r.notes}
                          maxLength={200}
                          onChange={(e) => update(i, "notes", e.target.value)}
                          className={inputCls}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Email row */}
        {rows.length > 0 && (
          <div
            className="mt-4 rounded-xl border-2 border-dashed p-3"
            style={{ borderColor: "var(--border)" }}
          >
            <Field label="Email a copy to">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                maxLength={255}
                className={inputCls}
              />
            </Field>
            <p className="mt-2 text-[11px] text-muted-foreground">
              Opens your mail app with the summary pre-filled — works on every device, nothing to
              set up.
            </p>
          </div>
        )}

        {savedCount !== null && (
          <p
            className="mt-3 rounded-md px-3 py-2 text-sm"
            style={{
              background: `color-mix(in oklab, ${phaseColor} 12%, var(--card))`,
              color: phaseDeep,
            }}
          >
            ✓ Saved {savedCount} {savedCount === 1 ? "entry" : "entries"} to your tracker.{" "}
            <Link to="/tracker" className="font-semibold underline-offset-4 hover:underline">
              Open tracker →
            </Link>
          </p>
        )}

        <DialogFooter className="mt-4 gap-2 sm:gap-2">
          <button
            type="button"
            onClick={dismiss}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" aria-hidden /> Maybe later
          </button>
          {rows.length > 0 && (
            <>
              <button
                type="button"
                onClick={handleEmailMyself}
                disabled={!email.trim()}
                className="inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-2 text-sm font-bold transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                style={{ borderColor: phaseDeep, color: phaseDeep }}
              >
                <Mail className="size-4" aria-hidden /> Email me a copy
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-[color:var(--brand-cream)] transition-all hover:-translate-y-0.5"
                style={{ background: phaseDeep }}
              >
                <Save className="size-4" aria-hidden /> Save to tracker
              </button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--brand-magenta-deep)]/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
