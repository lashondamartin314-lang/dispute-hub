/**
 * CFPB Filing · Step-by-step walkthrough.
 *
 * Mirrors pages P6.1–P6.7 of the Dispute Playbook kit
 * (https://shondamartincom.netlify.app/repairplaybook/kit.html#phase-6-escalate).
 * Renders illustrated browser mocks for each of the 6 screens the user will
 * see on consumerfinance.gov so members know exactly what to expect before
 * they click through.
 */
import { ArrowUpRight, CheckCircle2, FileText, Upload } from "lucide-react";

const PREP_CHECKLIST = [
  "Copies of your dispute letters (Letters 11–17, whichever applied)",
  "Certified mail receipts and delivery confirmations for every letter",
  "Bureau or furnisher responses you received, dated",
  "Copy of your most recent consumer report showing the disputed account",
  "Any prior correspondence, settlement offers, or acknowledgments",
  "A one-page timeline: dates, tracking numbers, and outcomes",
];

const TIMELINE = [
  { when: "Within 24 hours", what: "You receive a CFPB complaint number and a confirmation email. The CFPB forwards your complaint to the bureau or furnisher." },
  { when: "Within 15 days", what: "The bureau or furnisher must provide an initial response through the CFPB portal. You will be notified." },
  { when: "Within 60 days", what: "Final substantive response. You can review their response and submit feedback through the CFPB portal." },
];

interface StepProps {
  num: number;
  page: string;
  eyebrow: string;
  title: string;
  sub: string;
  url: string;
  children: React.ReactNode;
  direction: React.ReactNode;
  callout?: React.ReactNode;
}

function StepShell({ num, page, eyebrow, title, sub, url, children, direction, callout }: StepProps) {
  return (
    <section
      className="rounded-xl border-2 border-border bg-card p-5 shadow-card md:p-6"
      aria-labelledby={`cfpb-step-${num}`}
    >
      <header className="flex items-start gap-4">
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-[color:var(--brand-gold-deep)] bg-[color:var(--brand-gold)]/15 font-display text-lg font-bold text-[color:var(--brand-gold-deep)]"
        >
          {num}
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-gold-deep)]">
              {eyebrow}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{page}</p>
          </div>
          <h3 id={`cfpb-step-${num}`} className="font-display mt-1 text-xl leading-tight md:text-2xl">
            {title}
          </h3>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{sub}</p>
        </div>
      </header>

      {/* Illustrated browser mock — mirrors the kit's CFPB walkthrough pages. */}
      <div className="mt-5 overflow-hidden rounded-lg border border-border bg-[color:var(--brand-cream)]">
        <div className="flex items-center gap-1.5 border-b border-border/70 bg-card px-3 py-2">
          <span aria-hidden className="size-2 rounded-full bg-[color:color-mix(in_oklab,var(--brand-magenta)_70%,transparent)]" />
          <span aria-hidden className="size-2 rounded-full bg-[color:color-mix(in_oklab,var(--brand-gold)_80%,transparent)]" />
          <span aria-hidden className="size-2 rounded-full bg-[color:color-mix(in_oklab,var(--brand-sage)_70%,transparent)]" />
          <code className="ml-3 truncate font-mono text-[10px] text-foreground/70">{url}</code>
        </div>
        <div className="bg-[#1E4A73] px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-white/90">
          Consumer Financial Protection Bureau
        </div>
        <div className="space-y-3 p-4">{children}</div>
      </div>

      {callout}

      <p className="mt-4 flex items-start gap-2 text-sm leading-relaxed">
        <span aria-hidden className="font-mono text-base text-[color:var(--brand-gold-deep)]">→</span>
        <span className="text-foreground/85">{direction}</span>
      </p>
    </section>
  );
}

function Calloutbox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 rounded-md border-l-[3px] border-[color:var(--brand-gold-deep)] bg-[color:var(--brand-gold)]/10 px-4 py-3">
      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-gold-deep)]">
        {label}
      </p>
      <div className="mt-1 text-sm leading-relaxed text-foreground/85">{children}</div>
    </div>
  );
}

function MockH({ children }: { children: React.ReactNode }) {
  return <p className="font-display text-base font-semibold text-[#14111A]">{children}</p>;
}
function MockSub({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] leading-snug text-foreground/70">{children}</p>;
}
function MockButton({ children, callout }: { children: React.ReactNode; callout?: string }) {
  return (
    <div className="relative inline-flex">
      <span className="inline-flex items-center gap-1.5 rounded-md bg-[#1E4A73] px-3.5 py-2 text-[12px] font-semibold text-white shadow-sm">
        {children}
      </span>
      {callout && (
        <span className="absolute -top-2.5 -right-2 -rotate-3 rounded-sm bg-[color:var(--brand-magenta)] px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-white shadow">
          {callout}
        </span>
      )}
    </div>
  );
}
function MockOption({ children, selected, callout }: { children: React.ReactNode; selected?: boolean; callout?: string }) {
  return (
    <div
      className={
        "relative flex items-center gap-2.5 rounded-md border px-3 py-2 text-[12px] " +
        (selected ? "border-[#1E4A73] bg-[#F0F6FB] font-semibold text-[#14111A]" : "border-border bg-card text-foreground/80")
      }
    >
      <span
        aria-hidden
        className={"size-3.5 shrink-0 rounded-full border " + (selected ? "border-[#1E4A73] bg-[#1E4A73] ring-2 ring-white ring-offset-1 ring-offset-[#1E4A73]" : "border-foreground/40")}
      />
      <span>{children}</span>
      {callout && (
        <span className="absolute -top-2 right-2 rounded-sm bg-[color:var(--brand-magenta)] px-1.5 py-0.5 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-white shadow">
          {callout}
        </span>
      )}
    </div>
  );
}

export function CfpbWalkthrough() {
  return (
    <div className="space-y-6">
      {/* Overview · P6.1 */}
      <section className="rounded-xl border-2 border-[color:var(--brand-gold-deep)] bg-[color:color-mix(in_oklab,var(--brand-gold)_8%,var(--card))] p-5 shadow-card md:p-6">
        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[color:var(--brand-gold-deep)]">
          P6.1 · Overview
        </p>
        <h3 className="font-display mt-1.5 text-2xl leading-tight md:text-3xl">
          File a CFPB complaint — the full walkthrough.
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/85 md:text-base">
          Six screens on consumerfinance.gov. The whole filing takes 20–30 minutes if your paper trail is organized.
          The next pages mirror exactly what you'll see on screen, in order, with the same callouts from the kit.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--brand-navy)]">
              <CheckCircle2 className="size-3.5" aria-hidden /> Before you begin · documentation
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-foreground/80">
              {PREP_CHECKLIST.map((line) => (
                <li key={line} className="flex gap-2">
                  <span aria-hidden className="mt-1 size-1 shrink-0 rounded-full bg-[color:var(--brand-gold-deep)]" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <p className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[color:var(--brand-navy)]">
              <FileText className="size-3.5" aria-hidden /> What happens after you file
            </p>
            <ol className="mt-2 space-y-2">
              {TIMELINE.map((row, i) => (
                <li key={row.when} className="flex gap-3 text-sm">
                  <span
                    aria-hidden
                    className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[color:var(--brand-gold-deep)] font-mono text-[10px] font-bold text-[color:var(--brand-cream)]"
                  >
                    {i + 1}
                  </span>
                  <span>
                    <span className="font-semibold text-foreground">{row.when}.</span>{" "}
                    <span className="text-foreground/75">{row.what}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <Calloutbox label="Name files clearly before uploading">
          “01_Letter11_Round1_dispute_2026-01-15.pdf” reads cleaner than “Scan_001.pdf” and makes your complaint easier
          to review. Upload up to 25 files; each under 25 MB.
        </Calloutbox>
      </section>

      {/* Step 1 · P6.2 */}
      <StepShell
        num={1}
        page="P6.2 · Step 1 of 6"
        eyebrow="CFPB Step 1"
        title="Go to the official site."
        sub="Open your browser and navigate to the CFPB's consumer complaint page. Bookmark it now so you can return to check status."
        url="https://www.consumerfinance.gov/complaint/"
        direction={<>Type <strong>consumerfinance.gov/complaint</strong> in the address bar. Press Enter. Click <strong>Start a new complaint</strong> to begin.</>}
        callout={
          <Calloutbox label="If the page looks different">
            The CFPB occasionally updates its visual design. The structure of the complaint form stays the same. Look for
            “Submit a complaint” or “Start a new complaint” — that is your entry point regardless of styling.
          </Calloutbox>
        }
      >
        <MockH>Submit a complaint</MockH>
        <MockSub>We forward your complaint to the company and work to get a response. Companies have 15 days to respond.</MockSub>
        <div className="rounded-md border border-border bg-card p-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#1E4A73]">Have these ready:</p>
          <ul className="mt-1.5 space-y-1 pl-4 text-[11px] text-foreground/75">
            <li className="list-disc">The name of the company involved</li>
            <li className="list-disc">Account or transaction details</li>
            <li className="list-disc">Documents that support your complaint (PDF, JPG, PNG)</li>
            <li className="list-disc">Brief description of what happened, in your own words</li>
          </ul>
        </div>
        <MockButton callout="Click here">Start a new complaint →</MockButton>
      </StepShell>

      {/* Step 2 · P6.3 */}
      <StepShell
        num={2}
        page="P6.3 · Step 2 of 6"
        eyebrow="CFPB Step 2"
        title="Select the product."
        sub="For credit-reporting issues, choose 'Credit reporting or other personal consumer reports.' Almost always your starting point for any account, inquiry, or PI dispute."
        url="https://www.consumerfinance.gov/complaint/process/"
        direction={<>Select <strong>Credit reporting or other personal consumer reports</strong>, then click <strong>Continue</strong>.</>}
        callout={
          <Calloutbox label="Special case · debt collection">
            If your complaint is specifically about a collection agency's behavior — abusive contact, FDCPA violations,
            harassment — file under “Debt collection” instead, OR file two separate complaints (one credit reporting, one
            debt collection). The CFPB allows multiple complaints when multiple issues exist.
          </Calloutbox>
        }
      >
        <MockH>What product or service is your complaint about?</MockH>
        <MockSub>Choose the option that best matches your issue.</MockSub>
        <div className="space-y-1.5">
          <MockOption>Checking or savings account</MockOption>
          <MockOption selected callout="Select this">Credit reporting or other personal consumer reports</MockOption>
          <MockOption>Debt collection</MockOption>
          <MockOption>Mortgage</MockOption>
          <MockOption>Credit card or prepaid card</MockOption>
          <MockOption>Vehicle loan or lease</MockOption>
        </div>
        <MockButton>Continue →</MockButton>
      </StepShell>

      {/* Step 3 · P6.4 */}
      <StepShell
        num={3}
        page="P6.4 · Step 3 of 6"
        eyebrow="CFPB Step 3"
        title="Select the specific issue."
        sub="This is the most important screen — the CFPB routes your complaint based on what you select. Pick the option that most accurately describes the violation."
        url="https://www.consumerfinance.gov/complaint/process/issue/"
        direction={<>For most Phase 4–5 cases, choose <strong>Incorrect information on your report</strong>, then click <strong>Continue</strong>.</>}
        callout={
          <Calloutbox label="Match the issue to your situation">
            <ul className="space-y-1.5">
              <li><strong>Account inaccurate, balance wrong, status wrong</strong> → Incorrect information on your report</li>
              <li><strong>Bureau ignored your dispute · Letter 13 trigger</strong> → Problem with a credit reporting company's investigation</li>
              <li><strong>Method of verification not produced · Letter 12 follow-up</strong> → Problem with a credit reporting company's investigation</li>
              <li><strong>Unauthorized hard inquiry · Letter 19 trigger</strong> → Improper use of your report</li>
            </ul>
          </Calloutbox>
        }
      >
        <MockH>What type of problem are you having?</MockH>
        <div className="space-y-1.5">
          <MockOption selected callout="Most common">Incorrect information on your report</MockOption>
          <MockOption>Problem with a credit reporting company's investigation into an existing problem</MockOption>
          <MockOption>Improper use of your report</MockOption>
          <MockOption>Problem getting your free annual credit report</MockOption>
          <MockOption>Credit monitoring or identity theft protection services</MockOption>
        </div>
        <MockButton>Continue →</MockButton>
      </StepShell>

      {/* Step 4 · P6.5 */}
      <StepShell
        num={4}
        page="P6.5 · Step 4 of 6"
        eyebrow="CFPB Step 4"
        title="Tell your story."
        sub="Name the company. Describe what happened in your own words. Be specific. Include dates, FCRA section numbers where you know them, and what you have already done to try to resolve it."
        url="https://www.consumerfinance.gov/complaint/process/company/"
        direction={<>Type the company name (e.g. <strong>Equifax</strong>), then paste your 5-paragraph factual summary using the template at right.</>}
        callout={
          <Calloutbox label="The 5-paragraph “What happened” template">
            <ol className="space-y-1.5">
              <li><strong>1 · Setup.</strong> Date you sent your first dispute, what it concerned, certified-mail tracking number, delivery date.</li>
              <li><strong>2 · The dispute.</strong> What was inaccurate. Cite the specific FCRA section if you know it. Documentation you provided.</li>
              <li><strong>3 · The violation.</strong> What the bureau or furnisher did or did not do. Failure to respond, “verified” without method of verification, ignored follow-up letters.</li>
              <li><strong>4 · Escalation pattern.</strong> Subsequent letters, dates, tracking numbers, outcomes. The full paper trail.</li>
              <li><strong>5 · Remedy requested.</strong> Deletion, correction, written confirmation. Reference the FCRA sections that authorize the remedy.</li>
            </ol>
          </Calloutbox>
        }
      >
        <MockH>Which company is your complaint about?</MockH>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-foreground/60">Company name</p>
        <div className="rounded border border-border bg-card px-2.5 py-1.5 text-[12px] text-foreground/80">Equifax</div>
        <MockH>What happened?</MockH>
        <MockSub>Tell us in your own words. Up to 6,000 characters.</MockSub>
        <div className="rounded border border-border bg-card p-3 font-mono text-[10.5px] leading-relaxed text-foreground/70">
          On January 15, 2026, I sent a written dispute by certified mail to Equifax regarding inaccurate
          information being reported on my credit file. The certified mail was delivered on January 18, 2026 (USPS
          tracking number 9505 5000 0000 0000 0000 00). The dispute concerned account [Creditor Name, Account
          #XXXX-1234] which is being reported with an incorrect Date of First Delinquency…
        </div>
        <MockButton>Continue →</MockButton>
      </StepShell>

      {/* Step 5 · P6.6 */}
      <StepShell
        num={5}
        page="P6.6 · Step 5 of 6"
        eyebrow="CFPB Step 5"
        title="Upload your supporting documents."
        sub="This is where your paper trail becomes evidence. Every letter, every receipt, every response — clearly named, in chronological order."
        url="https://www.consumerfinance.gov/complaint/process/documents/"
        direction={<>Drag your numbered PDFs into the upload area. Confirm each shows <strong>✓ Uploaded</strong>, then click <strong>Continue</strong>.</>}
        callout={
          <Calloutbox label="Recommended upload order">
            <ol className="space-y-1">
              <li><strong>01_Letter11_Round1_dispute_[date].pdf</strong> — your initial dispute letter</li>
              <li><strong>02_certified_mail_receipt_[date].pdf</strong></li>
              <li><strong>03_bureau_verified_response_[date].pdf</strong></li>
              <li><strong>04_Letter12_MOV_demand_[date].pdf</strong></li>
              <li><strong>05_credit_report_disputed_account.pdf</strong></li>
              <li><strong>06_timeline_summary.pdf</strong> — one-page timeline you create yourself</li>
            </ol>
          </Calloutbox>
        }
      >
        <MockH>Add documents to your complaint</MockH>
        <MockSub>Up to 25 files. Each under 25 MB. PDF, JPG, PNG, DOC, DOCX, TXT.</MockSub>
        <div className="flex flex-col items-center gap-1 rounded-md border-2 border-dashed border-[#1E4A73] bg-[#F5F9FC] px-4 py-6 text-center">
          <Upload className="size-5 text-[#1E4A73]" aria-hidden />
          <p className="text-[12px] font-semibold text-[#1E4A73]">Drag files here or click to browse</p>
          <p className="text-[10px] text-foreground/60">Maximum 25 files · 25 MB each</p>
        </div>
        <ul className="space-y-1">
          {[
            "01_Letter11_Round1_dispute_2026-01-15.pdf",
            "02_certified_mail_receipt_2026-01-18.pdf",
            "03_bureau_verified_response_2026-02-15.pdf",
            "04_Letter12_MOV_demand_2026-02-22.pdf",
            "05_credit_report_disputed_account.pdf",
          ].map((f) => (
            <li
              key={f}
              className="flex items-center justify-between rounded border border-border bg-card px-2.5 py-1.5 text-[11px]"
            >
              <span className="truncate font-mono text-foreground/80">📄 {f}</span>
              <span className="ml-2 shrink-0 font-mono text-[10px] font-bold text-[color:var(--brand-sage)]">✓ Uploaded</span>
            </li>
          ))}
        </ul>
        <MockButton>Continue →</MockButton>
      </StepShell>

      {/* Step 6 · P6.7 */}
      <StepShell
        num={6}
        page="P6.7 · Step 6 of 6"
        eyebrow="CFPB Step 6"
        title="Review and submit."
        sub="Last step. The CFPB shows you everything you entered. Read it slowly. Once you submit, the complaint text cannot be edited — though you can add documents and respond to company replies later."
        url="https://www.consumerfinance.gov/complaint/process/review/"
        direction={<>Check the authorization box and click <strong>Submit complaint</strong>. Save the complaint number that appears within 24 hours to your tracker.</>}
        callout={
          <Calloutbox label="You filed. Now what.">
            Within 24 hours you receive a complaint number that looks like 26-XXXXXXX. Save it. Bookmark your CFPB
            account login page. The bureau or furnisher will respond through the CFPB portal within 15 days. Read their
            response — if you disagree, submit a follow-up directly through the portal.
          </Calloutbox>
        }
      >
        <MockH>Review your complaint</MockH>
        <MockSub>Once submitted, the complaint text cannot be edited.</MockSub>
        {[
          { label: "Product", value: "Credit reporting or other personal consumer reports" },
          { label: "Issue", value: "Incorrect information on your report" },
          { label: "Company", value: "Equifax" },
          { label: "Documents uploaded", value: "5 files" },
        ].map((row) => (
          <div key={row.label} className="rounded border border-border bg-card px-3 py-2">
            <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#1E4A73]">{row.label}</p>
            <p className="mt-0.5 text-[12px] text-foreground/85">{row.value}</p>
          </div>
        ))}
        <div className="rounded-md border-l-[3px] border-[color:var(--brand-gold-deep)] bg-[color:var(--brand-gold)]/15 px-3 py-2 text-[11px] leading-relaxed text-foreground/80">
          <strong className="text-foreground">Privacy notice:</strong> Your complaint will be sent to the company. The
          CFPB publishes a redacted version to its public database.
        </div>
        <label className="flex items-center gap-2 text-[11px] text-foreground/80">
          <input type="checkbox" defaultChecked aria-label="Authorization checkbox preview" className="size-3.5 accent-[#1E4A73]" />
          I understand and authorize the CFPB to share my complaint with the company.
        </label>
        <MockButton callout="Final step">Submit complaint</MockButton>
      </StepShell>

      {/* Outbound CTA */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border-2 border-[color:var(--brand-navy)]/30 bg-[color:var(--brand-navy)]/5 px-5 py-4">
        <p className="font-display text-base md:text-lg">Ready to file? Open consumerfinance.gov in a new tab.</p>
        <a
          href="https://www.consumerfinance.gov/complaint/"
          target="_blank"
          rel="noopener noreferrer"
          title="Open the CFPB complaint portal (opens in a new tab)"
          aria-label="Open the CFPB complaint portal (opens in a new tab, leaves the Playbook)"
          className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--brand-navy)] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[color:var(--brand-cream)] hover:bg-[color:var(--brand-violet-deep)]"
        >
          Start a CFPB complaint
          <ArrowUpRight className="size-3.5" aria-hidden />
        </a>
      </div>
    </div>
  );
}
