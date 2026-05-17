# Gamified Progress Dashboard + SmartCredit Auto-Import

A full member dashboard at `/progress` that pulls everything together: credit scores, dispute pipeline, letters sent, response logs, wins, and XP. Members can drag-drop their SmartCredit 3B report (PDF) or a CSV; Lovable AI parses it, splits accounts into a credit-report overview + negative pipeline + positive pipeline, and recommends an action lane for each account. Nothing saves until the user confirms.

## What the user sees

### 1. Dashboard hero (top of `/progress`)

- Display name, "Day X of your journey!"
- **Score panel**: 3 bureau cards (Equifax / Experian / TransUnion) each showing starting → current → delta with a sparkline of score history. Big "+47 pts gained" headline.
- **XP + Level**: action points (letters, responses, wins, phase completions) shown as a Level X bar with next-milestone target.
- **Phase progress** (existing 6-phase bar, kept) with checkmark in the corner of each phase completed.

### 2. "Your Credit Report at a glance"

Cards generated from the latest uploaded report:

- Total accounts, total open, total closed, overall utilization %, derogatory count, inquiries count.
- Last imported date + "Re-upload report" button.

### 3. Negative accounts — Action lanes

AI-classified and grouped, each card shows account, balance, status, suggested route:

- **Lane A — Validate first (Phase 2)**: collections, charge-offs (third-party), unfamiliar accounts
- **Lane B — Direct furnisher dispute (Phase 5)**: original-creditor charge-offs, defaults
- **Lane C — Specialty / hardship**: bankruptcy, accounts included in BK, repossessions, foreclosures
- **Lane D — Late-pay rehab**: open lines with 30/60/90/120 lates (goodwill route)

Each card → "Start a letter for this account" deep-links into the right letter template with the account pre-filled.

### 4. Positive accounts — Keep building

Grouped by type (Credit card, Retail, Auto loan, Mortgage, Student loan, Personal loan). Utilization shown per revolving line + overall. Highlights cards above 30% utilization with "Pay down to X for +Y points" suggestion. and guide them to utilize Smart Credit Best By date feature. 

### 5. Dispute pipeline (Kanban)

Columns: **Drafting → Sent (awaiting) → Bureau responded → Verified (escalate) → Deleted/Win → Updated**. Each card = one dispute round on one account, shows day-counter (FCRA 30-day clock), letter sent date, response logged date, outcome.

### 6. Activity log

Reverse-chronological feed: "Sent Letter L02 to Experian", "Logged response from TransUnion: verified", "+25 XP — response logged", "🏆 DELETED! - Capital One charge-off (+100 XP)".

## SmartCredit auto-import flow

1. **Upload screen** (`/progress/import`): drag-drop PDF or CSV. Max 20 MB. Tells user this is for the SmartCredit 3B report; works with SMARTcredit's 3B PDF or csv and direct them to download thiers through this link: [https://www.smartcredit.com/Shonda2499](https://www.smartcredit.com/Shonda2499)  - 7 Day free trial for new users and special Credit Cousin pricing $24.99/mo vs 35.99 market price.
2. **Server-side parse** via `createServerFn` → Lovable AI Gateway (`google/gemini-2.5-pro` for PDF — handles vision + long context; `google/gemini-3-flash-preview` for CSV) with `Output.object` + a Zod schema. Extracts: scores (3 bureaus), inquiries, all tradelines (creditor, account #, type, balance, limit, status, payment history, opened/closed dates), derogatory flags.
3. **AI second pass** classifies each negative into one of the 4 action lanes and tags each positive by account type.
4. **Review screen**: editable table grouped Overview / Negatives / Positives. User can fix mis-reads, delete rows, change classifications. Big "Save to my tracker" button commits everything in one transaction.
5. On save: rows fan out into `credit_reports`, `credit_scores`, `accounts`. Score deltas auto-compute against the previous import. XP awarded for "+50 — Report imported".

## Technical Design

### New database tables (Supabase migration)

- `credit_reports` — id, user_id, source (`smartcredit_pdf`/`smartcredit_csv`/`manual`), pulled_at, summary jsonb (totals, utilization, inquiries count), raw_file_path
- `credit_scores` — id, user_id, report_id, bureau (`equifax`/`experian`/`transunion`), score int, pulled_at
- `accounts` — id, user_id, report_id, creditor, account_number_masked, type (`credit_card`/`retail`/`auto`/`mortgage`/`student`/`personal`/`collection`/`other`), status (`open`/`closed`/`collection`/`charge_off`/`bankruptcy`/`repossession`/`foreclosure`/`included_in_bk`), balance, credit_limit, payment_status, opened_at, closed_at, is_negative bool, action_lane (`validate`/`furnisher`/`specialty`/`late_rehab`/null), bureaus jsonb (which of the 3 report it)
- `disputes` — id, user_id, account_id, current_phase, current_round, status (`drafting`/`sent`/`responded`/`verified`/`deleted`/`updated`/`closed`)
- `letters_sent` — id, user_id, dispute_id, letter_template_id, bureau_or_furnisher, sent_at, tracking_number, response_due_at (sent_at + 35 days)
- `letter_responses` — id, user_id, letter_id, received_at, outcome (`deleted`/`verified`/`updated`/`no_response`/`other`), notes, attachment_path
- `xp_events` — id, user_id, kind (`letter_sent`/`response_logged`/`dispute_won`/`phase_complete`/`report_imported`/`score_gain`), points, ref_id, ref_table, created_at
- All tables: RLS scoped to `auth.uid() = user_id`, plus owner-only insert/update/delete policies. Mirror the existing `phase_badges` pattern.

### Server functions (TanStack `createServerFn`)

Files under `src/lib/`, all protected by `requireSupabaseAuth`:

- `dashboard.functions.ts` — `getDashboardSummary()` (scores, deltas, XP total, level, account counts, kanban totals, recent activity)
- `accounts.functions.ts` — `listAccounts({ scope: 'negative'|'positive'|'all' })`, `updateAccount`, `setActionLane`
- `disputes.functions.ts` — `listDisputes`, `createDispute`, `updateDisputeStatus`
- `letters-log.functions.ts` — `logLetterSent`, `logLetterResponse`
- `xp.functions.ts` — `awardXp` (called by other functions)
- `credit-import.functions.ts`:
  - `parseCreditReport({ fileBase64, mime })` — uploads to Supabase Storage, calls Lovable AI Gateway with `Output.object`+Zod, returns the extracted+classified preview WITHOUT saving
  - `saveCreditReport({ parsedReport })` — atomic insert into reports/scores/accounts; computes score deltas; awards XP
- `gateway helper`: `src/lib/ai-gateway.ts` (per knowledge file, `Lovable-API-Key` header, server-only, reads `process.env.LOVABLE_API_KEY` inside handler)

### Storage

New private bucket `credit-reports` with RLS: users can read/write only files under `{user_id}/...`. Stored only so the user can re-download or re-parse; never linked publicly.

### XP / point rules (`xp_events.points`)

- Letter sent: +10
- Response logged: +25
- Round completed (response → next action chosen): +15
- Dispute deleted/win: +100
- Account fully resolved: +150
- Phase checklist complete: +50
- Report imported: +50
- Score gain bonus: +1 per real point gained across any bureau (logged when a new report's score > previous for that bureau)
- Level = `floor(sqrt(totalXp / 50))`; next-level target shown as a progress bar.

### Routes (TanStack file-based)

- `src/routes/_authenticated/progress.tsx` — moved under the `_authenticated` layout (or keep at `/progress` and gate via `beforeLoad`)
- `src/routes/_authenticated/progress.import.tsx` — upload + AI review screen
- Existing `/progress` becomes the dashboard above (replaces the simple badge list — badges still appear as one section)

### Frontend pieces (new components)

- `src/components/dashboard/ScoreCard.tsx`, `XpBar.tsx`, `ReportOverview.tsx`, `AccountLaneCard.tsx`, `PositiveAccountsTable.tsx`, `DisputeKanban.tsx`, `ActivityLog.tsx`
- `src/components/dashboard/ReportUploadDropzone.tsx`, `ParsedReportReview.tsx`
- Reuse existing brand tokens; no new colors.

### AI extraction prompt + schema (Zod, server-only)

- Schema captures: `scores[]`, `inquiries[]`, `accounts[]` with `category` (positive/negative/neutral), `type`, `status`, plus AI-suggested `action_lane` for negatives.
- System prompt anchored to FCRA terminology and the 4-lane routing rules the user described.
- `generateText({ output: Output.object({ schema }) })` so we get typed JSON, not regex-parsed text.

### Security & validation

- Zod validate every server-fn input.
- File size cap (20 MB), mime allowlist (`application/pdf`, `text/csv`).
- Never return raw service-role data; everything filtered by `auth.uid()`.
- AI extraction runs server-side only; `LOVABLE_API_KEY` stays in `process.env`.
- Review-before-save: nothing AI-extracted is persisted without explicit user confirm.

## Build order

1. Migration: all new tables + RLS + storage bucket + policies.
2. XP + dashboard server fns + dashboard UI shell (works with empty data).
3. Account/dispute/letter/response server fns + UI (kanban, activity log).
4. SmartCredit import: upload screen → parse server fn → review screen → save server fn.
5. Wire phase-checklist + existing letter-tracker actions to award XP and create rows in `letters_sent`/`disputes` so the new dashboard reflects user activity going forward.
6. QA at desktop + mobile widths.

## Out of scope (call out for later)

- Live API sync with SmartCredit / Credit Karma / MyFICO (no public consumer API).
- Auto-mailing letters (USPS/Lob integration) — current flow stays "you mail, then log it".
- Score predictions / what-if simulator.