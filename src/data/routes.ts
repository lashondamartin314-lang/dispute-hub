/**
 * Internal routes registry — the single source of truth for cross-references
 * inside the playbook copy. Used by <Ref /> so renames don't break links.
 */
import type { PhaseId } from "./letters";

export type RefId =
  | "hub"
  | "playbook"
  | "foundation"
  | "strategy"
  | "phases-rounds"
  | "phase-map"
  | "round-strategy"
  | "account-router"
  | "round-tracker"
  | "letters"
  | "resources"
  | `phase-${PhaseId}`
  | `round-${1 | 2 | 3 | 4 | 5}`;

export interface RefTarget {
  label: string;
  to: string;
  hash?: string;
}

export const REFS: Record<RefId, RefTarget> = {
  hub: { label: "Hub", to: "/" },
  playbook: { label: "Playbook", to: "/playbook" },
  foundation: { label: "Foundation", to: "/playbook/foundation" },
  strategy: { label: "Strategy", to: "/playbook/strategy" },
  "phases-rounds": { label: "Phases & Rounds", to: "/playbook/foundation", hash: "phases-rounds" },
  "phase-map": { label: "Phase Map", to: "/playbook/strategy", hash: "phase-map" },
  "round-strategy": { label: "5-Round Strategy", to: "/playbook/strategy", hash: "round-strategy" },
  "account-router": { label: "Account Router", to: "/playbook/strategy", hash: "account-router" },
  "round-tracker": { label: "Round Tracker", to: "/playbook/strategy", hash: "round-tracker" },
  letters: { label: "Letter Library", to: "/letters" },
  resources: { label: "Resources", to: "/resources" },

  "phase-prepare": { label: "Phase 1 · Prepare", to: "/playbook/phase/prepare" },
  "phase-validate": { label: "Phase 2 · Validate", to: "/playbook/phase/validate" },
  "phase-clean-identity": {
    label: "Phase 3 · Clean Identity",
    to: "/playbook/phase/clean-identity",
  },
  "phase-dispute-bureaus": {
    label: "Phase 4 · Dispute Bureaus",
    to: "/playbook/phase/dispute-bureaus",
  },
  "phase-challenge-furnishers": {
    label: "Phase 5 · Challenge Furnishers",
    to: "/playbook/phase/challenge-furnishers",
  },
  "phase-escalate": { label: "Phase 6 · Escalate", to: "/playbook/phase/escalate" },

  "round-1": { label: "Round 1 · Open the dispute", to: "/playbook/strategy", hash: "round-1" },
  "round-2": { label: "Round 2 · Cite the law", to: "/playbook/strategy", hash: "round-2" },
  "round-3": { label: "Round 3 · Direct demand", to: "/playbook/strategy", hash: "round-3" },
  "round-4": { label: "Round 4 · Violation notice", to: "/playbook/strategy", hash: "round-4" },
  "round-5": { label: "Round 5 · Final notice", to: "/playbook/strategy", hash: "round-5" },
};
