import { useEffect, useMemo, useState } from "react";
import { Check, RotateCcw, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Phase } from "@/data/phases";
import { lettersForPhase } from "@/data/letters";

interface PhaseChecklistProps {
  phase: Phase;
}

interface ChecklistItem {
  id: string;
  label: string;
  /** Short tag rendered as a chip (e.g. "Step 02", "Module 03", "Send L05"). */
  group: string;
}

/** Derive an actionable checklist from a phase's data. */
function buildChecklist(phase: Phase): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  // Core "the work" steps
  phase.steps.forEach((s, i) =>
    items.push({
      id: `step-${i + 1}`,
      label: s.title,
      group: `Step ${String(i + 1).padStart(2, "0")}`,
    }),
  );

  // Teaching modules
  phase.teaching?.modules.forEach((m, i) =>
    items.push({
      id: `module-${i + 1}`,
      label: `Read · ${m.title}`,
      group: m.eyebrow,
    }),
  );

  // Letters to send
  lettersForPhase(phase.id).forEach((l) =>
    items.push({
      id: `letter-${l.id}`,
      label: `Send ${l.id} · ${l.title}`,
      group: "Send letter",
    }),
  );

  return items;
}

const STORAGE_PREFIX = "playbook:checklist:";

export function PhaseChecklist({ phase }: PhaseChecklistProps) {
  const items = useMemo(() => buildChecklist(phase), [phase]);
  const storageKey = `${STORAGE_PREFIX}${phase.id}`;

  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

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
    </section>
  );
}
