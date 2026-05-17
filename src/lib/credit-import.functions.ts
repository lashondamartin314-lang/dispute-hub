import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateText, Output } from "ai";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { createLovableAiGatewayProvider } from "./ai-gateway";

// ----- Schemas -----
const ScoreSchema = z.object({
  bureau: z.enum(["equifax", "experian", "transunion"]),
  score: z.number().int().min(300).max(900),
});

const AccountSchema = z.object({
  creditor: z.string().min(1).max(120),
  account_number_masked: z.string().max(60).optional().nullable(),
  type: z.enum(["credit_card", "retail", "auto", "mortgage", "student", "personal", "collection", "other"]),
  status: z.enum(["open", "closed", "collection", "charge_off", "bankruptcy", "repossession", "foreclosure", "included_in_bk", "late", "paid", "other"]),
  balance: z.number().nullable().optional(),
  credit_limit: z.number().nullable().optional(),
  payment_status: z.string().max(120).optional().nullable(),
  opened_at: z.string().optional().nullable(),
  closed_at: z.string().optional().nullable(),
  is_negative: z.boolean(),
  action_lane: z.enum(["validate", "furnisher", "specialty", "late_rehab"]).nullable().optional(),
  bureaus: z.object({
    equifax: z.boolean().optional(),
    experian: z.boolean().optional(),
    transunion: z.boolean().optional(),
  }).optional(),
});

const ExtractionSchema = z.object({
  scores: z.array(ScoreSchema),
  summary: z.object({
    inquiries_count: z.number().int().nullable().optional(),
    open_accounts: z.number().int().nullable().optional(),
    closed_accounts: z.number().int().nullable().optional(),
    derogatory_count: z.number().int().nullable().optional(),
    utilization_pct: z.number().nullable().optional(),
  }),
  accounts: z.array(AccountSchema),
});

const SYSTEM_PROMPT = `You are an expert credit-report parser. The user uploads a SmartCredit 3-bureau report (PDF or CSV). Extract structured data.

Rules:
1. Extract scores for all 3 bureaus (Equifax, Experian, TransUnion). Skip a bureau if it's not present.
2. Extract EVERY tradeline (account) you can find. Do not summarize.
3. For each account, mark is_negative=true if it is: collection, charge-off, defaulted, bankruptcy, included in bankruptcy, repossession, foreclosure, OR open with any 30/60/90/120+ day late payments.
4. Assign action_lane for negatives ONLY (positives must be null):
   - "validate" = collections, third-party charge-offs, unfamiliar accounts (route through debt validation first)
   - "furnisher" = original-creditor charge-offs and defaults still owned by the original creditor
   - "specialty" = bankruptcy, accounts included in BK, repossessions, foreclosures
   - "late_rehab" = currently OPEN accounts with late payment history (goodwill route)
5. type must classify positives by product: credit_card, retail (store cards), auto, mortgage, student, personal, collection (only for collection accounts), other.
6. bureaus: mark which of the 3 bureaus is reporting the account.
7. Mask account numbers to last 4 digits if visible (e.g. "****1234"). Never include full numbers.
8. Compute summary stats from what you extracted.

Return only the structured object. No prose.`;

// ----- Helpers -----
function bytesToBase64(buf: ArrayBuffer): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Buf = (globalThis as any).Buffer;
  if (Buf) return Buf.from(buf).toString("base64");
  let binary = "";
  const arr = new Uint8Array(buf);
  for (let i = 0; i < arr.byteLength; i++) binary += String.fromCharCode(arr[i]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (globalThis as any).btoa(binary);
}

// ----- parseCreditReport -----
// Input: { fileBase64, mime, filename }
// Returns the parsed preview WITHOUT saving. Also stores the file in Storage.
const ParseInputSchema = z.object({
  fileBase64: z.string().min(1).max(40_000_000), // ~30MB base64
  mime: z.enum(["application/pdf", "text/csv"]),
  filename: z.string().min(1).max(255),
});

export const parseCreditReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => ParseInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI is not configured. Missing LOVABLE_API_KEY.");

    // Decode and upload to storage
    const bin = Uint8Array.from(atob(data.fileBase64), (c) => c.charCodeAt(0));
    if (bin.byteLength > 20 * 1024 * 1024) throw new Error("File too large (max 20 MB).");
    const ext = data.mime === "application/pdf" ? "pdf" : "csv";
    const path = `${userId}/${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("credit-reports")
      .upload(path, bin, { contentType: data.mime, upsert: false });
    if (upErr) throw new Error(`Upload failed: ${upErr.message}`);

    const gateway = createLovableAiGatewayProvider(apiKey);
    const isPdf = data.mime === "application/pdf";
    const model = gateway(isPdf ? "google/gemini-2.5-pro" : "google/gemini-3-flash-preview");

    let extracted: z.infer<typeof ExtractionSchema>;
    try {
      const result = await generateText({
        model,
        system: SYSTEM_PROMPT,
        output: Output.object({ schema: ExtractionSchema }),
        messages: [
          {
            role: "user",
            content: isPdf
              ? [
                  { type: "text", text: "Extract every account, all 3 bureau scores, and summary stats from this SmartCredit 3-bureau report." },
                  { type: "file", data: bin, mediaType: "application/pdf" },
                ]
              : [
                  {
                    type: "text",
                    text: `Extract every account and the scores from this CSV export.\n\n${new TextDecoder().decode(bin).slice(0, 200_000)}`,
                  },
                ],
          },
        ],
      });
      extracted = result.output as z.infer<typeof ExtractionSchema>;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes("429")) throw new Error("Too many requests. Try again in a minute.");
      if (msg.includes("402")) throw new Error("AI credits exhausted. Add credits in Settings → Workspace → Usage.");
      throw new Error(`Could not parse report: ${msg}`);
    }

    return { parsed: extracted, filePath: path };
  });

// ----- saveCreditReport -----
const SaveInputSchema = z.object({
  source: z.enum(["smartcredit_pdf", "smartcredit_csv", "manual", "other"]),
  filePath: z.string().max(500).optional().nullable(),
  parsed: ExtractionSchema,
});

export const saveCreditReport = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => SaveInputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Insert report
    const { data: report, error: rErr } = await supabase
      .from("credit_reports")
      .insert({
        user_id: userId,
        source: data.source,
        summary: data.parsed.summary,
        raw_file_path: data.filePath ?? null,
      })
      .select("id")
      .single();
    if (rErr) throw new Error(rErr.message);

    // Insert scores
    if (data.parsed.scores.length) {
      const scoreRows = data.parsed.scores.map((s) => ({
        user_id: userId,
        report_id: report.id,
        bureau: s.bureau,
        score: s.score,
      }));
      const { error: sErr } = await supabase.from("credit_scores").insert(scoreRows);
      if (sErr) throw new Error(sErr.message);
    }

    // Compute score-gain XP vs previous report
    const { data: prevScores } = await supabase
      .from("credit_scores")
      .select("bureau, score, pulled_at")
      .eq("user_id", userId)
      .neq("report_id", report.id)
      .order("pulled_at", { ascending: false })
      .limit(30);

    let totalGain = 0;
    if (prevScores?.length) {
      const prevByBureau: Record<string, number> = {};
      for (const p of prevScores) {
        if (prevByBureau[p.bureau] === undefined) prevByBureau[p.bureau] = p.score;
      }
      for (const s of data.parsed.scores) {
        const prev = prevByBureau[s.bureau];
        if (prev !== undefined && s.score > prev) totalGain += s.score - prev;
      }
    }

    // Insert accounts
    if (data.parsed.accounts.length) {
      const acctRows = data.parsed.accounts.map((a) => ({
        user_id: userId,
        report_id: report.id,
        creditor: a.creditor,
        account_number_masked: a.account_number_masked ?? null,
        type: a.type,
        status: a.status,
        balance: a.balance ?? null,
        credit_limit: a.credit_limit ?? null,
        payment_status: a.payment_status ?? null,
        opened_at: a.opened_at || null,
        closed_at: a.closed_at || null,
        is_negative: a.is_negative,
        action_lane: a.is_negative ? a.action_lane ?? null : null,
        bureaus: a.bureaus ?? {},
      }));
      const { error: aErr } = await supabase.from("accounts").insert(acctRows);
      if (aErr) throw new Error(aErr.message);
    }

    // XP: report imported
    await supabase.from("xp_events").insert({
      user_id: userId,
      kind: "report_imported",
      points: 50,
      description: "Credit report imported",
      ref_table: "credit_reports",
      ref_id: report.id,
    });

    if (totalGain > 0) {
      await supabase.from("xp_events").insert({
        user_id: userId,
        kind: "score_gain",
        points: totalGain,
        description: `+${totalGain} points across bureaus`,
        ref_table: "credit_reports",
        ref_id: report.id,
      });
    }

    return { ok: true, reportId: report.id, scoreGain: totalGain };
  });
