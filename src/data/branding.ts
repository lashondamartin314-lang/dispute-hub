/**
 * BRANDING CONFIG — single source of truth for swappable visuals.
 *
 * Edit values here to change them everywhere in the app:
 *   - SHONDA_AVATAR  → the host photo on /ask, headers, etc.
 *   - PHASE_ICONS    → the lucide icon used for each of the 6 phases
 *   - STARS          → rating-star defaults (filled count, total, label)
 *
 * To swap the avatar:
 *   1. Drop a new image into `src/assets/` (PNG/JPG/WebP).
 *   2. Change the `import` line below to point at the new file.
 *
 * To swap a phase icon:
 *   - Pick any icon from https://lucide.dev/icons and import it from
 *     "lucide-react", then assign it on the matching `PhaseId` key.
 */
import type { LucideIcon } from "lucide-react";
import {
  Compass,
  ShieldCheck,
  UserCheck,
  Building2,
  Gavel,
  Megaphone,
} from "lucide-react";
import type { PhaseId } from "./letters";
import shondaPhoto from "@/assets/shonda.png";

/** Host avatar — used on /ask and any "from Shonda" callouts. */
export const SHONDA_AVATAR = {
  src: shondaPhoto,
  alt: "Shonda Martin",
};

/** Lucide icon for each phase. Change any value to re-skin the phase chrome. */
export const PHASE_ICONS: Record<PhaseId, LucideIcon> = {
  prepare: Compass,
  validate: ShieldCheck,
  "clean-identity": UserCheck,
  "dispute-bureaus": Building2,
  "challenge-furnishers": Gavel,
  escalate: Megaphone,
};

/** Default star rating shown in testimonials / featured cards. */
export const STARS = {
  filled: 5,
  total: 5,
  label: "5 out of 5 stars",
  /** Tailwind/oklch color used for the filled star. */
  color: "var(--brand-gold)",
};
