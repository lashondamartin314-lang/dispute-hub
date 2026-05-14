import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PHASES } from "@/data/phases";
import { buildChecklist, readPhaseProgress } from "@/lib/checklist";

interface DownloadProgressPdfProps {
  className?: string;
  variant?: "primary" | "ghost";
}

/** Build + download a PDF snapshot of every phase checklist plus
 *  the user's locally-saved progress. Client-only — jsPDF is loaded
 *  on demand to keep it out of the SSR bundle. */
export function DownloadProgressPdf({ className, variant = "primary" }: DownloadProgressPdfProps) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    setBusy(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const margin = 48;
      const pageW = doc.internal.pageSize.getWidth();
      const pageH = doc.internal.pageSize.getHeight();
      const contentW = pageW - margin * 2;
      let y = margin;

      const ensureSpace = (needed: number) => {
        if (y + needed > pageH - margin) {
          doc.addPage();
          y = margin;
        }
      };

      // Cover header
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.text("The Dispute Playbook", margin, y);
      y += 26;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text("Phase checklist progress export", margin, y);
      y += 14;
      doc.text(
        `Generated ${new Date().toLocaleString()}`,
        margin,
        y,
      );
      y += 10;
      doc.setDrawColor(200);
      doc.line(margin, y + 6, pageW - margin, y + 6);
      y += 24;
      doc.setTextColor(20);

      // Overall summary
      let totalAll = 0;
      let doneAll = 0;
      const phaseSummaries = PHASES.map((p) => {
        const items = buildChecklist(p);
        const checked = readPhaseProgress(p.id);
        const done = items.filter((i) => checked[i.id]).length;
        totalAll += items.length;
        doneAll += done;
        return { phase: p, items, checked, done };
      });
      const pctAll = totalAll === 0 ? 0 : Math.round((doneAll / totalAll) * 100);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(`Overall progress: ${pctAll}%  (${doneAll} of ${totalAll} tasks)`, margin, y);
      y += 22;

      // Per-phase blocks
      for (const { phase, items, checked, done } of phaseSummaries) {
        const pct = items.length === 0 ? 0 : Math.round((done / items.length) * 100);
        ensureSpace(60);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        doc.text(`Phase ${phase.number} · ${phase.name}`, margin, y);
        y += 16;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(100);
        doc.text(`${pct}% complete · ${done} / ${items.length} tasks`, margin, y);
        y += 14;

        // progress bar
        const barW = contentW;
        const barH = 6;
        doc.setFillColor(230, 230, 230);
        doc.rect(margin, y, barW, barH, "F");
        doc.setFillColor(40, 40, 40);
        doc.rect(margin, y, (barW * pct) / 100, barH, "F");
        y += barH + 14;
        doc.setTextColor(20);

        // items
        doc.setFontSize(10);
        for (const item of items) {
          const isDone = !!checked[item.id];
          const box = "[" + (isDone ? "x" : " ") + "]";
          const line = `${box}  ${item.group}  —  ${item.label}`;
          const wrapped = doc.splitTextToSize(line, contentW - 12);
          ensureSpace(wrapped.length * 13 + 4);
          if (isDone) doc.setTextColor(120);
          else doc.setTextColor(20);
          doc.text(wrapped, margin + 4, y);
          y += wrapped.length * 13 + 2;
        }
        doc.setTextColor(20);
        y += 14;
      }

      // Footer page numbers
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(140);
        doc.text(
          `The Dispute Playbook · Progress export · Page ${i} of ${pageCount}`,
          pageW / 2,
          pageH - 20,
          { align: "center" },
        );
      }

      const stamp = new Date().toISOString().slice(0, 10);
      doc.save(`dispute-playbook-progress-${stamp}.pdf`);
      toast.success("Progress PDF downloaded");
    } catch (err) {
      console.error(err);
      toast.error("Could not build PDF. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0";
  const styles =
    variant === "primary"
      ? "bg-[color:var(--brand-navy)] text-[color:var(--brand-cream)] hover:bg-[color:var(--brand-violet-deep)] focus-visible:ring-[color:var(--brand-gold-deep)]"
      : "border border-border bg-card text-[color:var(--brand-ink)] hover:border-[color:var(--brand-gold)] focus-visible:ring-[color:var(--brand-gold-deep)]";

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-label="Download a PDF of all phase checklists with your saved progress"
      className={`${base} ${styles} ${className ?? ""}`}
    >
      {busy ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden /> Building PDF…
        </>
      ) : (
        <>
          <Download className="size-4" aria-hidden /> Download progress PDF
        </>
      )}
    </button>
  );
}
