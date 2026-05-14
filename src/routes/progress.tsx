import { useEffect, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { Award, ArrowRight, LogOut, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getMyBadges, getMyProfile } from "@/lib/badges.functions";
import { PHASES } from "@/data/phases";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Your Progress · The Dispute Playbook" },
      { name: "description", content: "Your earned milestone badges and phase-by-phase progress through the Dispute Playbook." },
    ],
  }),
  component: ProgressPage,
});

interface Badge {
  phase_id: string;
  phase_number: number;
  phase_name: string;
  earned_at: string;
}

function ProgressPage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      const isIn = !!data.session;
      setSignedIn(isIn);
      setHydrated(true);
      if (!isIn) {
        setLoading(false);
        return;
      }
      try {
        const [b, p] = await Promise.all([getMyBadges(), getMyProfile()]);
        if (!active) return;
        setBadges(b);
        setDisplayName(p?.display_name ?? null);
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
    setBadges([]);
  }

  if (!hydrated) {
    return <div className="px-6 py-16 text-center text-sm text-muted-foreground">Loading…</div>;
  }

  if (!signedIn) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <p className="eyebrow" style={{ color: "var(--brand-magenta-deep)" }}>
          Sign in required
        </p>
        <h1 className="font-display mt-2 text-3xl leading-tight md:text-4xl">
          Sign in to see your badges.
        </h1>
        <p className="font-editorial mt-3 text-base text-foreground/75">
          Your milestone badges are saved to your profile so you can pick up on any device.
        </p>
        <Link
          to="/auth"
          className="mt-6 inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-[color:var(--brand-cream)]"
          style={{ background: "var(--brand-ink)" }}
        >
          Sign in or create account <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    );
  }

  const earnedIds = new Set(badges.map((b) => b.phase_id));
  const completed = badges.length;
  const total = PHASES.length;
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
      <header className="flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow" style={{ color: "var(--brand-magenta-deep)" }}>
            {displayName ? `Hi, ${displayName}.` : "Your progress"}
          </p>
          <h1 className="font-display mt-1 text-3xl leading-tight md:text-5xl">
            {completed === total
              ? "Every phase. Locked in."
              : completed === 0
                ? "Earn your first badge."
                : `${completed} of ${total} phases complete.`}
          </h1>
          <p className="font-editorial mt-2 max-w-2xl text-base text-foreground/75 md:text-lg">
            Finish a phase checklist and the badge automatically lands here. Saved
            to your profile, available on every device you sign in from.
          </p>
        </div>
        <button
          type="button"
          onClick={signOut}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          <LogOut className="size-3.5" aria-hidden /> Sign out
        </button>
      </header>

      {/* Progress summary bar */}
      <div
        className="mt-8 rounded-3xl border-2 p-5 md:p-6"
        style={{
          borderColor: "color-mix(in oklab, var(--brand-gold) 45%, transparent)",
          background:
            "linear-gradient(180deg, color-mix(in oklab, var(--brand-gold) 10%, var(--card)) 0%, var(--card) 100%)",
        }}
      >
        <div className="flex items-center gap-4">
          <Trophy className="size-9 shrink-0" style={{ color: "var(--brand-gold-deep)" }} aria-hidden />
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-3">
              <p className="font-display text-xl md:text-2xl">{pct}% of the playbook</p>
              <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                {completed} / {total}
              </p>
            </div>
            <div
              className="mt-2 h-2 w-full overflow-hidden rounded-full"
              style={{ background: "color-mix(in oklab, var(--brand-ink) 10%, transparent)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pct}%`,
                  background:
                    "linear-gradient(90deg, var(--brand-magenta), var(--brand-gold))",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Badge grid */}
      <h2 className="font-display mt-12 text-2xl md:text-3xl">Milestone badges</h2>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PHASES.map((phase) => {
          const earned = earnedIds.has(phase.id);
          const badge = badges.find((b) => b.phase_id === phase.id);
          const phaseColor = `var(${phase.colorVar})`;
          const phaseDeep = `var(${phase.colorVar}-deep)`;
          return (
            <li key={phase.id}>
              <Link
                to="/playbook/phase/$id"
                params={{ id: phase.id }}
                className="group flex h-full flex-col rounded-2xl border-2 p-5 transition-all hover:-translate-y-0.5"
                style={{
                  borderColor: earned
                    ? phaseDeep
                    : `color-mix(in oklab, ${phaseColor} 22%, transparent)`,
                  background: earned
                    ? `color-mix(in oklab, ${phaseColor} 10%, var(--card))`
                    : "var(--card)",
                  opacity: earned ? 1 : 0.78,
                }}
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-flex size-12 shrink-0 items-center justify-center rounded-full"
                    style={{
                      background: earned ? phaseDeep : "transparent",
                      color: earned ? "var(--brand-cream)" : phaseDeep,
                      border: earned ? "none" : `2px dashed ${phaseDeep}`,
                    }}
                  >
                    <Award className="size-6" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-wider" style={{ color: phaseDeep }}>
                      Phase {phase.number}
                    </p>
                    <p className="font-display mt-0.5 text-lg leading-tight">
                      {phase.name}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {earned && badge
                    ? `Earned ${new Date(badge.earned_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}`
                    : "Not yet — finish this phase's checklist."}
                </p>
              </Link>
            </li>
          );
        })}
      </ul>

      {loading && (
        <p className="mt-6 text-center text-xs text-muted-foreground">Refreshing…</p>
      )}
    </div>
  );
}
