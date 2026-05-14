import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, RotateCcw, Trophy } from "lucide-react";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";
import { PHASES, type Phase } from "@/data/phases";
import { buildChecklist, CHECKLIST_STORAGE_PREFIX } from "@/lib/checklist";
import { awardPhaseBadge } from "@/lib/badges.functions";
import { supabase } from "@/integrations/supabase/client";
import { MilestonePrompt } from "@/components/milestone-prompt";

interface PhaseChecklistProps {
  phase: Phase;
}

const STORAGE_PREFIX = CHECKLIST_STORAGE_PREFIX;

export function PhaseChecklist({ phase }: PhaseChecklistProps) {
  const items = useMemo(() => buildChecklist(phase), [phase]);
  const storageKey = `${STORAGE_PREFIX}${phase.id}`;

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  // Load
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [storageKey]);

  // Persist
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(checked));
    } catch {
      /* ignore */
    }
  }, [checked, storageKey, hydrated]);

  const total = items.length;
  const done = items.filter((i) => checked[i.id]).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  // Confetti burst when checklist transitions to fully complete.
  const prevPctRef = useRef(0);
  useEffect(() => {
    if (!hydrated) {
      prevPctRef.current = pct;
      return;
    }
    if (pct === 100 && prevPctRef.current < 100) {
      const root = getComputedStyle(document.documentElement);
      const colors = [
        root.getPropertyValue(`${phase.colorVar}-deep`).trim() || "#704214",
        root.getPropertyValue(phase.colorVar).trim() || "#a87a4a",
        root.getPropertyValue("--brand-gold").trim() || "#c9a84c",
        root.getPropertyValue("--brand-cream").trim() || "#f5f0e0",
      ];
      const fire = (ratio: number, opts: confetti.Options) =>
        confetti({
          particleCount: Math.floor(180 * ratio),
          spread: 70,
          startVelocity: 45,
          ticks: 220,
          colors,
          disableForReducedMotion: true,
          ...opts,
        });
      fire(0.3, { origin: { x: 0.2, y: 0.7 }, angle: 60 });
      fire(0.3, { origin: { x: 0.8, y: 0.7 }, angle: 120 });
      fire(0.4, { origin: { x: 0.5, y: 0.6 }, spread: 100 });

      // Best-effort: persist a milestone badge + capture email for the prompt.
      (async () => {
        try {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user?.email) setUserEmail(data.session.user.email);
          if (data.session) {
            await awardPhaseBadge({
              data: {
                phaseId: phase.id,
                phaseNumber: phase.number,
                phaseName: phase.name,
              },
            });
          }
        } catch {
          /* ignore — badge will award next time the user completes/visits */
        }
      })();

      // Open the milestone prompt unless the user already dismissed it for
      // this phase on this device.
      try {
        const dismissed = window.localStorage.getItem(
          `milestone-prompt-shown:${phase.id}`,
        );
        if (!dismissed) setMilestoneOpen(true);
      } catch {
        setMilestoneOpen(true);
      }
    }
    prevPctRef.current = pct;
  }, [pct, hydrated, phase.colorVar, phase.id, phase.number, phase.name]);

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const reset = () => setChecked({});

  const phaseColor = `var(${phase.colorVar})`;
  const phaseDeep = `var(${phase.colorVar}-deep)`;
  const phaseSoft = `var(${phase.colorVar}-soft)`;

  // Geometry for the progress ring
  const size = 140;
  const stroke = 12;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct / 100);

  return (
    <section
      id="checklist"
      className="scroll-mt-24 rounded-3xl border-2 p-6 md:p-8"
      style={{
        borderColor: `color-mix(in oklab, ${phaseColor} 40%, transparent)`,
        background: `linear-gradient(180deg, color-mix(in oklab, ${phaseSoft} 35%, var(--card)) 0%, var(--card) 100%)`,
      }}
    >
      <div className="grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
        {/* Progress wheel */}
        <div className="flex items-center justify-center">
          <div
            className="relative"
            style={{ width: size, height: size }}
            role="img"
            aria-label={`Phase ${phase.number} progress: ${pct}% complete (${done} of ${total} tasks done)`}
          >
            <svg width={size} height={size} className="-rotate-90">
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                strokeWidth={stroke}
                stroke={`color-mix(in oklab, ${phaseColor} 18%, transparent)`}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={r}
                fill="none"
                strokeLinecap="round"
                strokeWidth={stroke}
                stroke={phaseDeep}
                strokeDasharray={c}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 600ms cubic-bezier(.2,.8,.2,1)" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {pct === 100 ? (
                <Trophy
                  className="size-7"
                  style={{ color: phaseDeep }}
                  aria-hidden
                />
              ) : (
                <p
                  className="font-display text-3xl leading-none"
                  style={{ color: phaseDeep }}
                >
                  {pct}%
                </p>
              )}
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {done} / {total}
              </p>
            </div>
          </div>
        </div>

        {/* Header + reset */}
        <div className="min-w-0">
          <p className="eyebrow" style={{ color: phaseDeep }}>
            Phase {phase.number} checklist
          </p>
          <h2 className="font-display mt-1 text-3xl leading-tight md:text-4xl">
            {pct === 100
              ? `${phase.name} — locked in.`
              : pct === 0
                ? `Walk through ${phase.name}.`
                : `${phase.name} in progress.`}
          </h2>
          <p className="font-editorial mt-2 text-base leading-relaxed text-foreground/80 md:text-lg">
            Check each task as you finish it. Your progress saves on this device
            so you can leave and come back without losing your place.
          </p>
          {done > 0 && (
            <button
              type="button"
              onClick={reset}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
            >
              <RotateCcw className="size-3" aria-hidden /> Reset checklist
            </button>
          )}
        </div>
      </div>

      {/* Items */}
      <ul className="mt-8 grid gap-2.5 md:grid-cols-2">
        {items.map((item) => {
          const isDone = !!checked[item.id];
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-pressed={isDone}
                className={cn(
                  "group flex w-full items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all",
                  "hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                )}
                style={{
                  borderColor: isDone
                    ? phaseDeep
                    : `color-mix(in oklab, ${phaseColor} 22%, transparent)`,
                  background: isDone
                    ? `color-mix(in oklab, ${phaseColor} 12%, var(--card))`
                    : "var(--card)",
                  // @ts-expect-error custom CSS var
                  "--tw-ring-color": phaseDeep,
                }}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md border-2 transition-all",
                    isDone ? "scale-100" : "scale-95",
                  )}
                  style={{
                    borderColor: phaseDeep,
                    background: isDone ? phaseDeep : "transparent",
                    color: "var(--brand-cream)",
                  }}
                >
                  {isDone && <Check className="size-4" strokeWidth={3} />}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className="font-mono text-[10px] uppercase tracking-wider"
                    style={{ color: phaseDeep, opacity: 0.75 }}
                  >
                    {item.group}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-sm font-semibold leading-snug text-pretty",
                      isDone && "line-through opacity-60",
                    )}
                  >
                    {item.label}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Continue to next phase — appears once the checklist is fully complete */}
      {pct === 100 && (() => {
        const nextPhase = PHASES.find((p) => p.number === phase.number + 1);
        if (!nextPhase) {
          return (
            <div
              className="mt-8 flex flex-col items-start gap-3 rounded-2xl border-2 p-5 sm:flex-row sm:items-center sm:justify-between"
              style={{
                borderColor: phaseDeep,
                background: `color-mix(in oklab, ${phaseColor} 10%, var(--card))`,
              }}
            >
              <p className="font-display text-lg leading-tight">
                You've finished the final phase. The system is yours.
              </p>
              <Link
                to="/playbook"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-[color:var(--brand-cream)] shadow-card transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                style={
                  {
                    background: phaseDeep,
                    ["--tw-ring-color" as string]: phaseDeep,
                  } as React.CSSProperties
                }
              >
                Back to playbook cover
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          );
        }
        const nextDeep = `var(${nextPhase.colorVar}-deep)`;
        const nextColor = `var(${nextPhase.colorVar})`;
        return (
          <div
            className="mt-8 flex flex-col items-start gap-3 rounded-2xl border-2 p-5 sm:flex-row sm:items-center sm:justify-between"
            style={{
              borderColor: nextDeep,
              background: `color-mix(in oklab, ${nextColor} 10%, var(--card))`,
            }}
          >
            <div className="min-w-0">
              <p className="eyebrow text-[10px]" style={{ color: nextDeep }}>
                Phase {nextPhase.number} · {nextPhase.eyebrow}
              </p>
              <p className="font-display mt-0.5 text-lg leading-tight md:text-xl">
                Ready for {nextPhase.name}?
              </p>
            </div>
            <Link
              to="/playbook/phase/$id"
              params={{ id: nextPhase.id }}
              aria-label={`Continue to Phase ${nextPhase.number}: ${nextPhase.name}`}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-[color:var(--brand-cream)] shadow-card transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              style={
                {
                  background: nextDeep,
                  ["--tw-ring-color" as string]: nextDeep,
                } as React.CSSProperties
              }
            >
              Continue to next phase
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        );
      })()}

      {/* Re-open the milestone prompt anytime once the phase is complete. */}
      {pct === 100 && (
        <button
          type="button"
          onClick={() => {
            try {
              window.localStorage.removeItem(`milestone-prompt-shown:${phase.id}`);
            } catch {
              /* ignore */
            }
            setMilestoneOpen(true);
          }}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
        >
          Update tracker for this phase →
        </button>
      )}

      <MilestonePrompt
        phase={phase}
        open={milestoneOpen}
        onClose={() => setMilestoneOpen(false)}
        defaultEmail={userEmail}
      />
    </section>
  );
}
