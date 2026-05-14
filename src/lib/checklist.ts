import { lettersForPhase } from "@/data/letters";
import type { Phase } from "@/data/phases";

export interface ChecklistItem {
  id: string;
  label: string;
  /** Short tag rendered as a chip (e.g. "Step 02", "Module 03", "Send L05"). */
  group: string;
}

/** Derive an actionable checklist from a phase's data. Shared between the
 *  in-page checklist UI and the PDF export so they never drift. */
export function buildChecklist(phase: Phase): ChecklistItem[] {
  const items: ChecklistItem[] = [];

  phase.steps.forEach((s, i) =>
    items.push({
      id: `step-${i + 1}`,
      label: s.title,
      group: `Step ${String(i + 1).padStart(2, "0")}`,
    }),
  );

  phase.teaching?.modules.forEach((m, i) =>
    items.push({
      id: `module-${i + 1}`,
      label: `Read · ${m.title}`,
      group: m.eyebrow,
    }),
  );

  lettersForPhase(phase.id).forEach((l) =>
    items.push({
      id: `letter-${l.id}`,
      label: `Send ${l.id} · ${l.title}`,
      group: "Send letter",
    }),
  );

  return items;
}

export const CHECKLIST_STORAGE_PREFIX = "playbook:checklist:";

export function readPhaseProgress(phaseId: string): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(`${CHECKLIST_STORAGE_PREFIX}${phaseId}`);
    return raw ? (JSON.parse(raw) as Record<string, boolean>) : {};
  } catch {
    return {};
  }
}
