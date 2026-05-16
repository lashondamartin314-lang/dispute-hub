import { Printer } from "lucide-react";
import type { Resource } from "@/data/resources";

interface PrintChecklistButtonProps {
  resource: Resource;
}

/**
 * Opens a printable, self-contained HTML window with the resource's
 * "Before you file" checklist. The user prints to PDF (or paper) from
 * the browser dialog, no extra dependency required.
 */
export function PrintChecklistButton({ resource }: PrintChecklistButtonProps) {
  if (!resource.checklist || resource.checklist.length === 0) return null;

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const win = window.open("", "_blank", "noopener,noreferrer,width=820,height=1000");
    if (!win) return;

    const items = resource
      .checklist!.map(
        (line) =>
          `<li><span class="box" aria-hidden="true"></span><span>${escapeHtml(line)}</span></li>`,
      )
      .join("");

    win.document.write(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Before you file · ${escapeHtml(resource.label)}</title>
<style>
  :root { color-scheme: light; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: #ffffff; color: #111111; }
  body { font: 14px/1.55 ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; padding: 40px 48px; max-width: 760px; margin: 0 auto; }
  .eyebrow { font: 700 10px/1 ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace; letter-spacing: .18em; text-transform: uppercase; color: #8a6a00; }
  h1 { font: 700 28px/1.15 Georgia, "Times New Roman", serif; margin: 8px 0 4px; }
  .meta { font-size: 12px; color: #555; margin: 0 0 20px; }
  .source { display: inline-block; font-size: 11px; color: #1a0dab; word-break: break-all; }
  hr { border: 0; border-top: 1px solid #d0d0d0; margin: 18px 0 22px; }
  h2 { font: 700 16px/1.2 ui-sans-serif, system-ui, sans-serif; letter-spacing: .02em; margin: 0 0 14px; }
  ul { list-style: none; padding: 0; margin: 0; }
  li { display: flex; gap: 12px; padding: 10px 0; border-bottom: 1px dashed #d8d8d8; align-items: flex-start; }
  li:last-child { border-bottom: 0; }
  .box { flex: 0 0 16px; width: 16px; height: 16px; margin-top: 2px; border: 1.5px solid #111; border-radius: 3px; display: inline-block; }
  .footer { margin-top: 28px; font-size: 11px; color: #666; }
  .stamp { margin-top: 16px; font: 700 10px/1 ui-monospace, monospace; letter-spacing: .18em; text-transform: uppercase; color: #8a6a00; }
  @media print {
    body { padding: 24px 28px; }
    .noprint { display: none; }
    li { page-break-inside: avoid; }
  }
  .actions { display: flex; gap: 8px; margin: 0 0 20px; }
  .btn { font: 600 12px/1 ui-sans-serif, system-ui, sans-serif; padding: 8px 12px; border: 1px solid #111; background: #fff; color: #111; border-radius: 6px; cursor: pointer; }
  .btn.primary { background: #111; color: #fff; }
</style>
</head>
<body>
  <div class="actions noprint">
    <button class="btn primary" onclick="window.print()">Print or Save as PDF</button>
    <button class="btn" onclick="window.close()">Close</button>
  </div>
  <p class="eyebrow">Before you file · The Dispute Playbook</p>
  <h1>${escapeHtml(resource.label)}</h1>
  <p class="meta">${escapeHtml(resource.description)}<br /><a class="source" href="${escapeHtml(resource.url)}">${escapeHtml(resource.url)}</a></p>
  <hr />
  <h2>Gather and save to your Drive folder</h2>
  <ul>${items}</ul>
  <p class="stamp">Credit Academy · The Dispute Playbook</p>
  <p class="footer">Tip: keep this printout in the front of your Round folder so every step has a check box and date next to it.</p>
  <script>setTimeout(function(){window.focus();}, 50);</script>
</body>
</html>`);
    win.document.close();
  };

  return (
    <button
      type="button"
      onClick={handlePrint}
      className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-foreground transition-colors hover:bg-[color:var(--brand-gold)]/15 hover:border-[color:var(--brand-gold-deep)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--brand-gold-deep)]"
      aria-label={`Print the Before you file checklist for ${resource.label}`}
    >
      <Printer className="size-3.5" aria-hidden="true" />
      Checklist PDF
    </button>
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
