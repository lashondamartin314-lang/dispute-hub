import { useState } from "react";
import { createFileRoute, Link, redirect, useRouter } from "@tanstack/react-router";
import { ArrowLeft, FileText, Loader2, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { parseCreditReport, saveCreditReport } from "@/lib/credit-import.functions";

export const Route = createFileRoute("/progress_/import")({
  head: () => ({
    meta: [
      { title: "Import Credit Report · The Dispute Playbook" },
      { name: "description", content: "Upload your SmartCredit 3-bureau PDF or CSV — AI extracts scores, accounts, and routes negatives into dispute lanes." },
    ],
  }),
  beforeLoad: async ({ location }) => {
    if (typeof window === "undefined") return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      throw redirect({ to: "/auth", search: { redirect: location.href } });
    }
  },
  component: ImportPage,
});

type Parsed = Awaited<ReturnType<typeof parseCreditReport>>["parsed"];

function ImportPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState<"idle" | "parsing" | "saving">("idle");
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [filePath, setFilePath] = useState<string | null>(null);

  async function handleParse() {
    if (!file) return;
    setError(null);
    setBusy("parsing");
    try {
      if (file.size > 20 * 1024 * 1024) throw new Error("File too large (max 20 MB).");
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      const chunk = 0x8000;
      for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
      }
      const b64 = btoa(binary);
      const mime = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "text/csv";
      const res = await parseCreditReport({ data: { fileBase64: b64, mime, filename: file.name } });
      setParsed(res.parsed);
      setFilePath(res.filePath);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not parse file.");
    } finally {
      setBusy("idle");
    }
  }

  async function handleSave() {
    if (!parsed) return;
    setError(null);
    setBusy("saving");
    try {
      const source = file?.name.toLowerCase().endsWith(".pdf") ? "smartcredit_pdf" : "smartcredit_csv";
      await saveCreditReport({ data: { source, filePath, parsed } });
      await router.navigate({ to: "/progress" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save.");
      setBusy("idle");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
      <Link to="/progress" className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" aria-hidden /> Back to dashboard
      </Link>
      <h1 className="font-display mt-3 text-3xl md:text-4xl">Import your credit report</h1>
      <p className="font-editorial mt-2 text-base text-foreground/75">
        Upload your SmartCredit 3-bureau PDF or CSV export. AI extracts scores, accounts, and suggests a dispute lane for each negative.
        Nothing saves until you review and confirm.
      </p>
      <p className="mt-2 text-xs text-muted-foreground">
        Don't have a SmartCredit subscription?{" "}
        <a href="https://www.smartcredit.com/Shonda2499" target="_blank" rel="noreferrer" className="font-semibold underline" style={{ color: "var(--brand-magenta-deep)" }}>
          Get it through Credit Cousin
        </a>{" "}— 7-day free trial, $24.99/mo (vs $35.99 market).
      </p>

      {!parsed && (
        <div className="mt-8 rounded-3xl border-2 border-dashed border-border bg-card p-8">
          <div className="text-center">
            <FileText className="mx-auto size-10 text-muted-foreground" aria-hidden />
            <p className="font-display mt-3 text-xl">Choose your file</p>
            <p className="mt-1 text-xs text-muted-foreground">PDF or CSV · max 20 MB</p>
            <input
              type="file"
              accept="application/pdf,.pdf,text/csv,.csv"
              onChange={(e) => { setFile(e.target.files?.[0] ?? null); setError(null); }}
              className="mt-4 block w-full text-sm"
            />
            {file && (
              <p className="mt-2 text-xs text-muted-foreground">{file.name} · {(file.size / 1024).toFixed(0)} KB</p>
            )}
            <button
              onClick={handleParse}
              disabled={!file || busy !== "idle"}
              className="mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-[color:var(--brand-cream)] disabled:opacity-50"
              style={{ background: "var(--brand-ink)" }}
            >
              {busy === "parsing" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Upload className="size-4" aria-hidden />}
              {busy === "parsing" ? "Parsing with AI…" : "Parse with AI"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-900">{error}</p>
      )}

      {parsed && (
        <div className="mt-8 space-y-6">
          <section className="rounded-2xl border-2 border-border bg-card p-5">
            <h2 className="font-display text-xl">Scores extracted</h2>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {(["equifax", "experian", "transunion"] as const).map((b) => {
                const s = parsed.scores.find((x) => x.bureau === b);
                return (
                  <div key={b} className="rounded-xl border border-border bg-background p-3 text-center">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{b}</p>
                    <p className="font-display text-3xl">{s?.score ?? "—"}</p>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border-2 border-border bg-card p-5">
            <h2 className="font-display text-xl">Accounts found ({parsed.accounts.length})</h2>
            <p className="text-xs text-muted-foreground">
              {parsed.accounts.filter((a) => a.is_negative).length} negative · {parsed.accounts.filter((a) => !a.is_negative).length} positive
            </p>
            <div className="mt-3 max-h-96 overflow-y-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-card">
                  <tr className="text-left">
                    <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Creditor</th>
                    <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Status</th>
                    <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Balance</th>
                    <th className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Lane</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.accounts.map((a, i) => (
                    <tr key={i} className="border-t border-border" style={{ background: a.is_negative ? "color-mix(in oklab, var(--brand-magenta) 5%, transparent)" : undefined }}>
                      <td className="px-3 py-2 font-semibold">{a.creditor}</td>
                      <td className="px-3 py-2 text-muted-foreground">{a.status?.replace(/_/g, " ")}</td>
                      <td className="px-3 py-2 tabular-nums">{a.balance != null ? `$${Number(a.balance).toLocaleString()}` : "—"}</td>
                      <td className="px-3 py-2 text-xs">{a.action_lane ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleSave}
              disabled={busy !== "idle"}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-[color:var(--brand-cream)] disabled:opacity-50"
              style={{ background: "var(--brand-ink)" }}
            >
              {busy === "saving" ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              Save to my tracker
            </button>
            <button
              onClick={() => { setParsed(null); setFile(null); setFilePath(null); }}
              className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold"
            >
              Start over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
