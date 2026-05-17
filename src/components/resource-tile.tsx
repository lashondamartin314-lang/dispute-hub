import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  BookOpen,
  Info,
  ListChecks,
  Printer,
  FileText,
  Activity,
  Scale,
  FolderOpen,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import type { DisputeRound, Resource, ResourceCategory } from "@/data/resources";

const CATEGORY_ICON: Record<ResourceCategory, LucideIcon> = {
  report: FileText,
  monitoring: Activity,
  complaint: Scale,
  kit: FolderOpen,
  academy: GraduationCap,
};

const CATEGORY_LABEL: Record<ResourceCategory, string> = {
  report: "Credit Report",
  monitoring: "Monitoring",
  complaint: "Regulatory",
  kit: "Letter Kit",
  academy: "Education",
};
import { PrintChecklistButton } from "@/components/print-checklist-button";
import { CfpbWalkthrough } from "@/components/cfpb-walkthrough";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ResourceTileProps {
  resource: Resource;
  className?: string;
  /** Currently-selected dispute round (for highlight emphasis). */
  activeRound?: DisputeRound | null;
}

/**
 * Editorial resource card.
 *
 * Every outbound link now opens an explainer Dialog first that describes
 * **what the site is** and **when you'd use it** in the dispute cycle. From
 * inside the dialog the member can launch the external site, print steps,
 * or jump to the matching section of the Playbook. The CFPB resource gets a
 * full screen-by-screen walkthrough that mirrors P6.1–P6.7 of the kit.
 */
export function ResourceTile({ resource, className, activeRound }: ResourceTileProps) {
  const isInActiveRound =
    activeRound != null && resource.rounds?.includes(activeRound);
  const isDimmed = activeRound != null && !isInActiveRound;
  const [open, setOpen] = useState(false);

  const hasSteps = (resource.steps && resource.steps.length > 0) ?? false;
  const isCfpb = resource.id === "cfpb";

  const printSteps = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!resource.steps) return;
    const win = window.open("", "_blank", "noopener,noreferrer,width=820,height=1000");
    if (!win) return;
    const items = resource.steps
      .map(
        (line, i) =>
          `<li><span class="num">${String(i + 1).padStart(2, "0")}</span><span>${escapeHtml(line)}</span></li>`,
      )
      .join("");
    win.document.write(`<!doctype html><html><head><meta charset="utf-8" />
<title>${escapeHtml(resource.actionLabel)} · Step by step</title>
<style>
  *{box-sizing:border-box}html,body{margin:0;background:#fff;color:#111}
  body{font:14px/1.55 ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;padding:40px 48px;max-width:760px;margin:0 auto}
  .eyebrow{font:700 10px/1 ui-monospace,Menlo,monospace;letter-spacing:.18em;text-transform:uppercase;color:#8a6a00}
  h1{font:700 28px/1.15 Georgia,serif;margin:8px 0 4px}
  .meta{font-size:12px;color:#555;margin:0 0 20px}
  .src{font-size:11px;color:#1a0dab;word-break:break-all}
  hr{border:0;border-top:1px solid #d0d0d0;margin:18px 0 22px}
  ol{list-style:none;padding:0;margin:0;counter-reset:s}
  li{display:flex;gap:14px;padding:12px 0;border-bottom:1px dashed #d8d8d8;align-items:flex-start}
  li:last-child{border-bottom:0}
  .num{font:700 12px/1 ui-monospace,monospace;color:#8a6a00;min-width:22px;padding-top:2px}
  .actions{display:flex;gap:8px;margin:0 0 20px}
  .btn{font:600 12px/1 system-ui,sans-serif;padding:8px 12px;border:1px solid #111;background:#fff;border-radius:6px;cursor:pointer}
  .btn.primary{background:#111;color:#fff}
  @media print{.noprint{display:none}body{padding:24px 28px}li{page-break-inside:avoid}}
</style></head><body>
<div class="actions noprint">
  <button class="btn primary" onclick="window.print()">Print or Save as PDF</button>
  <button class="btn" onclick="window.close()">Close</button>
</div>
<p class="eyebrow">Step by step · The Dispute Playbook</p>
<h1>${escapeHtml(resource.actionLabel)}</h1>
<p class="meta">${escapeHtml(resource.description)}<br /><a class="src" href="${escapeHtml(resource.url)}">${escapeHtml(resource.url)}</a></p>
<hr />
<ol>${items}</ol>
</body></html>`);
    win.document.close();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <div
        className={cn(
          "group relative flex flex-col gap-4 rounded-xl border-2 bg-card p-5 shadow-card transition-all",
          isInActiveRound
            ? "border-[color:var(--brand-gold-deep)] ring-2 ring-[color:var(--brand-gold)]/30"
            : "border-border hover:border-[color:var(--brand-gold-deep)] hover:-translate-y-0.5 hover:shadow-elegant",
          isDimmed && "opacity-50",
          className,
        )}
      >
        {isInActiveRound && (
          <span className="absolute -top-2.5 left-4 rounded-full bg-[color:var(--brand-gold-deep)] px-2.5 py-0.5 font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-cream)]">
            Use this round
          </span>
        )}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-3">
            <DialogTrigger asChild>
              <button
                type="button"
                className="group/eyebrow inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 -mx-1.5 text-left font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[color:var(--brand-gold-deep)] transition-colors hover:bg-[color:var(--brand-gold)]/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-gold-deep)]"
                aria-label={`Learn about ${resource.label}: what it is and when to use it`}
              >
                {hasSteps ? <ListChecks className="size-3.5" aria-hidden /> : <Info className="size-3.5" aria-hidden />}
                <span className="underline decoration-dotted underline-offset-4 decoration-[color:var(--brand-gold-deep)]/60 group-hover/eyebrow:decoration-[color:var(--brand-gold-deep)]">
                  {resource.actionLabel}
                </span>
                <ArrowRight className="size-3 opacity-70 transition-transform group-hover/eyebrow:translate-x-0.5" aria-hidden />
              </button>
            </DialogTrigger>
            {resource.rounds && resource.rounds.length > 0 && (
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground whitespace-nowrap pt-1">
                Rounds {resource.rounds.join(", ")}
              </p>
            )}
          </div>
          <h3 className="font-display text-xl leading-tight">{resource.label}</h3>
          <p className="text-sm leading-relaxed text-muted-foreground">{resource.description}</p>
          {resource.usage && (
            <div className="mt-3 border-t border-border/60 pt-3">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[color:var(--brand-gold-deep)]">
                What to pull
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{resource.usage}</p>
            </div>
          )}
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-navy)] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-[color:var(--brand-cream)] transition-colors hover:bg-[color:var(--brand-violet-deep)]"
            >
              {isCfpb ? "Open walkthrough" : hasSteps ? "How to use this" : "What is this?"}
              <ArrowRight className="size-3.5" aria-hidden />
            </button>
          </DialogTrigger>
          <PrintChecklistButton resource={resource} />
        </div>
      </div>

      {/* Explainer dialog — every external link opens here first. */}
      <DialogContent className={cn(isCfpb ? "max-w-3xl" : "max-w-2xl", "max-h-[90vh] overflow-y-auto")}>
        <DialogHeader>
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-gold-deep)]">
            {isCfpb ? "CFPB Filing · Step by step" : hasSteps ? "Step by step · From the Playbook" : "About this resource"}
          </p>
          <DialogTitle className="font-display text-2xl leading-tight">
            {resource.actionLabel}
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-foreground/80">
            {resource.description}
          </DialogDescription>
        </DialogHeader>

        {/* What it is + When to use it — shown for every resource */}
        {resource.usage && (
          <section className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-[color:var(--brand-cream)]/40 p-4">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-gold-deep)]">
                What it is
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{resource.description}</p>
            </div>
            <div className="rounded-lg border border-border bg-[color:var(--brand-cream)]/40 p-4">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-gold-deep)]">
                When to use it{resource.rounds && resource.rounds.length > 0 ? ` · Rounds ${resource.rounds.join(", ")}` : ""}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-foreground/85">{resource.usage}</p>
            </div>
          </section>
        )}

        {/* CFPB → full illustrated walkthrough. Other resources → ordered steps. */}
        {isCfpb ? (
          <div className="mt-5">
            <CfpbWalkthrough />
          </div>
        ) : hasSteps ? (
          <ol className="mt-4 space-y-3">
            {resource.steps!.map((step, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-lg border border-border/60 bg-background/40 p-3"
              >
                <span className="font-mono inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-gold)]/20 text-[10px] font-bold text-[color:var(--brand-gold-deep)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-sm leading-relaxed text-foreground/90">{step}</p>
              </li>
            ))}
          </ol>
        ) : null}

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              title={`Open ${resource.label} (opens in a new tab)`}
              aria-label={`Open ${resource.label} (opens in a new tab, leaves the Playbook)`}
              className="inline-flex items-center gap-1.5 rounded-md bg-[color:var(--brand-gold-deep)] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[color:var(--brand-cream)] hover:opacity-90"
            >
              Open the site
              <ArrowUpRight className="size-3.5" aria-hidden />
            </a>
            {hasSteps && (
              <button
                type="button"
                onClick={printSteps}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-bold uppercase tracking-wide hover:bg-[color:var(--brand-gold)]/15"
              >
                <Printer className="size-3.5" aria-hidden />
                Print steps
              </button>
            )}
          </div>
          {resource.playbookRef && (
            <Link
              to={resource.playbookRef.href}
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-[#1a0dab] underline underline-offset-4 decoration-[#1a0dab]/40 hover:decoration-[#1a0dab]"
            >
              <BookOpen className="size-3.5" aria-hidden />
              Read in the Playbook: {resource.playbookRef.label}
            </Link>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
