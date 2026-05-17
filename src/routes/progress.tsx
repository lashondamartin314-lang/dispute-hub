import { useEffect, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  Award,
  ArrowRight,
  ExternalLink,
  FileText,
  LogOut,
  Plus,
  Sparkles,
  TrendingUp,
  Trophy,
  Upload,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getDashboardSummary } from "@/lib/dashboard.functions";
import { PHASES } from "@/data/phases";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your Progress · The Dispute Playbook" },
      { name: "description", content: "Your full credit-repair dashboard: scores, accounts, dispute pipeline, letters, responses, and XP." },
    ],
  }),
  component: ProgressPage,
});

type Summary = Awaited<ReturnType<typeof getDashboardSummary>>;

const LANE_META: Record<string, { label: string; sub: string; color: string }> = {
  validate: { label: "Validate first", sub: "Phase 2 · Debt validation", color: "var(--brand-magenta-deep)" },
  furnisher: { label: "Direct furnisher dispute", sub: "Phase 5 · Furnisher route", color: "var(--brand-gold-deep)" },
  specialty: { label: "Specialty / hardship", sub: "BK, repos, foreclosures", color: "#9b4423" },
  late_rehab: { label: "Late-pay rehab", sub: "Goodwill route", color: "#2d8a9e" },
};

function ProgressPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [data, setData] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data: sess } = await supabase.auth.getSession();
      if (!active) return;
      const isIn = !!sess.session;
      setSignedIn(isIn);
      setHydrated(true);
      if (!isIn) {
        setLoading(false);
        return;
      }
      try {
        const summary = await getDashboardSummary();
        if (!active) return;
        setData(summary);
        setDisplayName(sess.session?.user?.user_metadata?.display_name ?? sess.session?.user?.email?.split("@")[0] ?? null);
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    await router.invalidate();
    setSignedIn(false);
    setData(null);
  }

  if (!hydrated) {
    return <div className="px-6 py-16 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="eyebrow" style={{ color: "var(--brand-magenta-deep)" }}>Sign in required</p>
        <h1 className="font-display mt-2 text-3xl leading-tight md:text-4xl">Sign in to see your dashboard.</h1>
        <p className="font-editorial mt-3 text-base text-foreground/75">
          Your scores, disputes, letters, and badges live in your profile so you can pick up on any device.
        </p>
        <Link to="/auth" className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-[color:var(--brand-cream)]" style={{ background: "var(--brand-ink)" }}>
          Sign in or create account <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    );
  }

  if (loading || !data) {
    return <div className="px-6 py-16 text-center text-sm text-muted-foreground">Loading your dashboard…</div>;
  }

  const earnedIds = new Set(data.badges.map((b) => b.phase_id));
  const phaseCompleted = data.badges.length;
  const phaseTotal = PHASES.length;
  const phasePct = phaseTotal === 0 ? 0 : Math.round((phaseCompleted / phaseTotal) * 100);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
      {/* ===== Header ===== */}
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow" style={{ color: "var(--brand-magenta-deep)" }}>
            {displayName ? `Hi, ${displayName}.` : "Your dashboard"}
          </p>
          <h1 className="font-display mt-1 text-3xl leading-tight md:text-5xl">Your progress, all in one place.</h1>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/progress/import"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold text-[color:var(--brand-cream)]"
            style={{ background: "var(--brand-ink)" }}
          >
            <Upload className="size-3.5" aria-hidden /> Upload credit report
          </Link>
          <button onClick={signOut} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground">
            <LogOut className="size-3.5" aria-hidden /> Sign out
          </button>
        </div>
      </header>

      {/* ===== Scores ===== */}
      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {(["equifax", "experian", "transunion"] as const).map((b) => {
          const s = data.scores[b];
          const delta = s.starting != null && s.current != null ? s.current - s.starting : null;
          const label = b === "equifax" ? "Equifax" : b === "experian" ? "Experian" : "TransUnion";
          return (
            <div key={b} className="rounded-2xl border-2 border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
                {delta != null && delta !== 0 && (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
                    style={{
                      background: delta > 0 ? "color-mix(in oklab, var(--brand-gold) 18%, transparent)" : "color-mix(in oklab, var(--brand-magenta) 18%, transparent)",
                      color: delta > 0 ? "var(--brand-gold-deep)" : "var(--brand-magenta-deep)",
                    }}
                  >
                    <TrendingUp className="size-3" aria-hidden /> {delta > 0 ? `+${delta}` : delta}
                  </span>
                )}
              </div>
              <p className="font-display mt-1 text-5xl leading-none">{s.current ?? "—"}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                {s.starting != null ? `Started at ${s.starting}` : "Upload a report to start tracking"}
              </p>
            </div>
          );
        })}
      </section>

      {/* ===== XP / Level ===== */}
      <section className="mt-6 rounded-3xl border-2 p-5 md:p-6" style={{
        borderColor: "color-mix(in oklab, var(--brand-gold) 45%, transparent)",
        background: "linear-gradient(180deg, color-mix(in oklab, var(--brand-gold) 10%, var(--card)) 0%, var(--card) 100%)",
      }}>
        <div className="flex items-start gap-4">
          <Sparkles className="size-9 shrink-0" style={{ color: "var(--brand-gold-deep)" }} aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-display text-xl md:text-2xl">Level {data.xp.level} · {data.xp.total} XP</p>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {data.xp.xpForNext - data.xp.total} XP to level {data.xp.level + 1}
              </p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full" style={{ background: "color-mix(in oklab, var(--brand-ink) 10%, transparent)" }}>
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${data.xp.pctToNext}%`, background: "linear-gradient(90deg, var(--brand-magenta), var(--brand-gold))" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Phase progress ===== */}
      <section className="mt-6 rounded-2xl border-2 border-border bg-card p-5">
        <div className="flex items-center gap-3">
          <Trophy className="size-7 shrink-0" style={{ color: "var(--brand-gold-deep)" }} aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="font-display text-lg md:text-xl">{phasePct}% of the playbook · {phaseCompleted} / {phaseTotal} phases</p>
            </div>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "color-mix(in oklab, var(--brand-ink) 10%, transparent)" }}>
              <div className="h-full rounded-full" style={{ width: `${phasePct}%`, background: "linear-gradient(90deg, var(--brand-magenta), var(--brand-gold))" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== Credit report overview ===== */}
      {data.latestReport ? (
        <section className="mt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-2xl md:text-3xl">Credit report at a glance</h2>
            <p className="text-xs text-muted-foreground">
              Imported {new Date(data.latestReport.pulled_at).toLocaleDateString()}
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
            <StatCard label="Accounts" value={data.accounts.totalCount} />
            <StatCard label="Negative" value={data.accounts.derogatoryCount} accent />
            <StatCard label="Positive" value={data.accounts.totalCount - data.accounts.derogatoryCount} />
            <StatCard label="Utilization" value={data.latestReport.summary?.utilization_pct != null ? `${data.latestReport.summary.utilization_pct}%` : "—"} />
            <StatCard label="Inquiries" value={data.latestReport.summary?.inquiries_count ?? "—"} />
          </div>
        </section>
      ) : (
        <section className="mt-10 rounded-3xl border-2 border-dashed border-border bg-card p-8 text-center">
          <FileText className="mx-auto size-10 text-muted-foreground" aria-hidden />
          <h2 className="font-display mt-3 text-2xl">Import your credit report</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Upload your SmartCredit 3-bureau PDF or CSV — AI will pull every score, every account, and route negatives into the right dispute lane.
          </p>
          <a
            href="https://www.smartcredit.com/Shonda2499"
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold underline"
            style={{ color: "var(--brand-magenta-deep)" }}
          >
            Don't have a SmartCredit report? Get the Credit Cousin price <ExternalLink className="size-3" aria-hidden />
          </a>
          <div className="mt-5">
            <Link to="/progress/import" className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-[color:var(--brand-cream)]" style={{ background: "var(--brand-ink)" }}>
              <Upload className="size-4" aria-hidden /> Upload report
            </Link>
          </div>
        </section>
      )}

      {/* ===== Negative accounts by lane ===== */}
      {data.accounts.negatives.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl md:text-3xl">Negative accounts · action lanes</h2>
          <p className="mt-1 text-sm text-muted-foreground">AI-routed. Tap a card to start the right letter for that account.</p>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {(["validate", "furnisher", "specialty", "late_rehab"] as const).map((lane) => {
              const items = data.accounts.negatives.filter((a) => a.action_lane === lane);
              if (items.length === 0) return null;
              const meta = LANE_META[lane];
              return (
                <div key={lane} className="rounded-2xl border-2 border-border bg-card p-5">
                  <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: meta.color }}>{meta.sub}</p>
                  <p className="font-display mt-0.5 text-lg">{meta.label}</p>
                  <ul className="mt-3 space-y-2">
                    {items.map((a) => (
                      <li key={a.id} className="rounded-xl border border-border bg-background p-3">
                        <div className="flex items-baseline justify-between gap-2">
                          <p className="font-semibold text-sm">{a.creditor}</p>
                          <p className="font-mono text-[11px] text-muted-foreground">{a.account_number_masked ?? ""}</p>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {(a.status ?? "").replace(/_/g, " ")}{a.balance != null ? ` · $${Number(a.balance).toLocaleString()}` : ""}
                        </p>
                        <Link to="/letters" className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold underline" style={{ color: "var(--brand-magenta-deep)" }}>
                          Start a letter <ArrowRight className="size-3" aria-hidden />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== Positive accounts ===== */}
      {data.accounts.positives.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl md:text-3xl">Positive accounts · keep building</h2>
          <div className="mt-4 overflow-x-auto rounded-2xl border-2 border-border">
            <table className="w-full text-sm">
              <thead className="bg-card">
                <tr className="text-left">
                  <th className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Creditor</th>
                  <th className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Type</th>
                  <th className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Balance</th>
                  <th className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Limit</th>
                  <th className="px-4 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Util.</th>
                </tr>
              </thead>
              <tbody>
                {data.accounts.positives.map((a) => {
                  const util = a.credit_limit && a.balance != null && Number(a.credit_limit) > 0
                    ? Math.round((Number(a.balance) / Number(a.credit_limit)) * 100)
                    : null;
                  const high = util != null && util > 30;
                  return (
                    <tr key={a.id} className="border-t border-border">
                      <td className="px-4 py-2 font-semibold">{a.creditor}</td>
                      <td className="px-4 py-2 text-muted-foreground">{(a.type ?? "").replace(/_/g, " ")}</td>
                      <td className="px-4 py-2 tabular-nums">{a.balance != null ? `$${Number(a.balance).toLocaleString()}` : "—"}</td>
                      <td className="px-4 py-2 tabular-nums">{a.credit_limit != null ? `$${Number(a.credit_limit).toLocaleString()}` : "—"}</td>
                      <td className="px-4 py-2 tabular-nums" style={{ color: high ? "var(--brand-magenta-deep)" : undefined, fontWeight: high ? 700 : 400 }}>
                        {util != null ? `${util}%` : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ===== Dispute pipeline ===== */}
      <section className="mt-10">
        <h2 className="font-display text-2xl md:text-3xl">Dispute pipeline</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-6">
          <KanbanCol label="Drafting" count={data.kanban.drafting} />
          <KanbanCol label="Sent (awaiting)" count={data.kanban.sent} />
          <KanbanCol label="Responded" count={data.kanban.responded} />
          <KanbanCol label="Verified" count={data.kanban.verified} accent />
          <KanbanCol label="Deleted (win)" count={data.kanban.deleted} win />
          <KanbanCol label="Updated" count={data.kanban.updated} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Counts come from your logged letters and responses. <Link to="/letters" className="underline">Log a letter or response</Link>.
        </p>
      </section>

      {/* ===== Activity log ===== */}
      <section className="mt-10">
        <h2 className="font-display text-2xl md:text-3xl">Recent activity</h2>
        {data.activity.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No XP events yet. Send your first letter or import a report to start earning.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border rounded-2xl border-2 border-border bg-card">
            {data.activity.map((e) => (
              <li key={e.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm">{e.description ?? e.kind}</p>
                  <p className="text-[11px] text-muted-foreground">{new Date(e.created_at).toLocaleString()}</p>
                </div>
                <span className="shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold" style={{
                  background: "color-mix(in oklab, var(--brand-gold) 18%, transparent)",
                  color: "var(--brand-gold-deep)",
                }}>
                  +{e.points} XP
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ===== Badges ===== */}
      <section className="mt-12">
        <h2 className="font-display text-2xl md:text-3xl">Milestone badges</h2>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {PHASES.map((phase) => {
            const earned = earnedIds.has(phase.id);
            const badge = data.badges.find((b) => b.phase_id === phase.id);
            const phaseColor = `var(${phase.colorVar})`;
            const phaseDeep = `var(${phase.colorVar}-deep)`;
            return (
              <li key={phase.id}>
                <Link to="/playbook/phase/$id" params={{ id: phase.id }} className="group flex h-full flex-col rounded-2xl border-2 p-4 transition-all hover:-translate-y-0.5" style={{
                  borderColor: earned ? phaseDeep : `color-mix(in oklab, ${phaseColor} 22%, transparent)`,
                  background: earned ? `color-mix(in oklab, ${phaseColor} 10%, var(--card))` : "var(--card)",
                  opacity: earned ? 1 : 0.78,
                }}>
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="inline-flex size-10 shrink-0 items-center justify-center rounded-full" style={{
                      background: earned ? phaseDeep : "transparent",
                      color: earned ? "var(--brand-cream)" : phaseDeep,
                      border: earned ? "none" : `2px dashed ${phaseDeep}`,
                    }}>
                      <Award className="size-5" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: phaseDeep }}>Phase {phase.number}</p>
                      <p className="font-display mt-0.5 text-base leading-tight">{phase.name}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {earned && badge
                      ? `Earned ${new Date(badge.earned_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
                      : "Not yet — finish this phase's checklist."}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number | string; accent?: boolean }) {
  return (
    <div className="rounded-2xl border-2 border-border bg-card p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display mt-1 text-2xl" style={{ color: accent ? "var(--brand-magenta-deep)" : undefined }}>{value}</p>
    </div>
  );
}

function KanbanCol({ label, count, accent, win }: { label: string; count: number; accent?: boolean; win?: boolean }) {
  return (
    <div className="rounded-2xl border-2 p-4" style={{
      borderColor: win ? "var(--brand-gold-deep)" : accent ? "var(--brand-magenta-deep)" : "var(--border)",
      background: win
        ? "color-mix(in oklab, var(--brand-gold) 12%, var(--card))"
        : accent
          ? "color-mix(in oklab, var(--brand-magenta) 8%, var(--card))"
          : "var(--card)",
    }}>
      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-display mt-1 text-3xl">{count}</p>
    </div>
  );
}

// Unused but kept for completeness
export const _Plus = Plus;
