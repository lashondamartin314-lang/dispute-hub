import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ExternalLink, FileDown } from "lucide-react";
import type { Letter } from "@/data/letters";

interface Props {
  letter: Letter | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function docIdFrom(url: string): string | null {
  const m = url.match(/\/document\/d\/([^/]+)/);
  return m ? m[1] : null;
}

export function LetterPreviewDialog({ letter, open, onOpenChange }: Props) {
  const docId = letter ? docIdFrom(letter.viewUrl) : null;
  const previewUrl = docId ? `https://docs.google.com/document/d/${docId}/preview` : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 gap-0 overflow-hidden h-[90vh] flex flex-col">
        <DialogHeader className="border-b border-border px-5 py-3 flex-row items-start justify-between gap-3 space-y-0">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
              {letter?.id} · Template preview
            </p>
            <DialogTitle className="font-display text-lg font-bold truncate mt-0.5">
              {letter?.title ?? "Letter"}
            </DialogTitle>
            {letter?.lede && (
              <DialogDescription className="font-editorial text-sm text-foreground/70 mt-1 line-clamp-2">
                {letter.lede}
              </DialogDescription>
            )}
          </div>
          {letter && (
            <div className="flex flex-wrap gap-2 shrink-0 pr-8">
              <a
                href={letter.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-semibold transition-all hover:-translate-y-0.5"
              >
                <ExternalLink className="size-3.5" aria-hidden /> Open in Docs
              </a>
              <a
                href={letter.copyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-magenta)] px-3 py-1.5 text-xs font-bold text-[color:var(--brand-cream)] transition-all hover:-translate-y-0.5 hover:shadow-elegant"
              >
                <FileDown className="size-3.5" aria-hidden /> Copy to Drive
              </a>
            </div>
          )}
        </DialogHeader>
        <div className="flex-1 min-h-0 bg-muted/30">
          {previewUrl ? (
            <iframe
              key={previewUrl}
              src={previewUrl}
              title={letter?.title ?? "Letter preview"}
              className="w-full h-full border-0"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No preview available.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
