import { PARENT_DRIVE_FOLDER } from "./letters";

export type ResourceCategory = "report" | "monitoring" | "complaint" | "kit" | "academy";

/** Dispute round in the 5-round cycle. Resources can apply to multiple rounds. */
export type DisputeRound = 1 | 2 | 3 | 4 | 5;

export interface Resource {
  id: string;
  label: string;
  description: string;
  url: string;
  category: ResourceCategory;
  /** Short, action-oriented title (verb + noun) shown as the tile eyebrow and dialog heading. */
  actionLabel: string;
  /** One-paragraph "what to pull" summary shown on the Resources page. */
  usage?: string;
  /** Which dispute rounds this resource is used in. */
  rounds?: DisputeRound[];
  /** "Before you file" checklist items, used in printable checklist. */
  checklist?: string[];
  /** Numbered, do-this-now step-by-step instructions opened from the action title. */
  steps?: string[];
  /** Optional pointer back to the section of the Playbook that teaches this in depth. */
  playbookRef?: { label: string; href: string };
  /** Show in sidebar quick-access list */
  pinned?: boolean;
}

export const RESOURCES: Resource[] = [
  {
    id: "annualcreditreport",
    label: "Official Credit Reports",
    description: "AnnualCreditReport.com, the only federally authorized source for your free Equifax, Experian, and TransUnion reports.",
    url: "https://www.annualcreditreport.com",
    category: "report",
    actionLabel: "Pull Your Official Credit Reports",
    pinned: true,
    rounds: [1],
    playbookRef: { label: "Phase 1 · Validate", href: "/playbook/phase/validate" },
    steps: [
      "Go to AnnualCreditReport.com (this is the only federally authorized site, do not use copycats).",
      "Choose 'Request your free credit reports' and pick all three bureaus in one session.",
      "Verify identity: full legal name, current address, SSN, date of birth, and a few prior-address questions.",
      "Download each PDF as soon as it loads. Do not just screenshot the on-screen view.",
      "Save each file to Drive named: BUREAU_YYYY-MM-DD_Report.pdf (Equifax_2025-01-12_Report.pdf).",
      "On page 1 of every PDF, highlight the official Report Number. You'll cite this verbatim in every dispute letter.",
      "Highlight every disputable account: name, partial account number, date of last activity, balance, status.",
      "List the personal info errors (wrong addresses, wrong employers, name spellings) on a separate page.",
    ],
    usage:
      "Pull all three bureau reports (Equifax, Experian, TransUnion) the day you start a dispute round. What you need from this site: the official report number printed on each PDF, the exact account names and partial account numbers as the bureau lists them, and the dates of last activity. These are the identifiers you cite verbatim in every letter, so save each PDF to your Drive folder labeled with the bureau and date.",
    checklist: [
      "Verify your full legal name, current address, SSN, and date of birth before entering them.",
      "Pull all three reports in one sitting (Equifax, Experian, TransUnion) so the data is from the same day.",
      "Save each PDF to Drive named: BUREAU_YYYY-MM-DD_Report.pdf",
      "Highlight the official report number on each PDF (top of page 1).",
      "Highlight every disputable account: name, partial account number, date of last activity, balance, status.",
      "List the personal info errors (wrong addresses, wrong employers, wrong name spellings).",
      "Cross-check what you see here against your SmartCredit dashboard for any discrepancies.",
      "Decide which Route from the Strategy each account belongs to before you draft a single letter.",
    ],
  },
  {
    id: "smartcredit",
    label: "Credit Report, Monitoring and Building Tools",
    description: "SmartCredit gives you daily 3-bureau monitoring, the easier-to-read report format we use throughout the Playbook, plus credit-building tools.",
    url: "https://www.smartcredit.com",
    category: "report",
    actionLabel: "Set Up Daily Monitoring & Best Pay Date",
    pinned: true,
    rounds: [1, 2, 3, 4, 5],
    playbookRef: { label: "Phase 2 · Clean identity & Best Pay Date", href: "/playbook/phase/clean-identity" },
    steps: [
      "Sign up at SmartCredit.com (use the same legal name and address as your AnnualCreditReport pull).",
      "Open Settings → Alerts. Turn on daily 3-bureau alerts via email AND SMS for new accounts, inquiries, and status changes.",
      "Open Money Manager. For each active credit card, write down the Best Pay Date it shows.",
      "Add a calendar reminder 2 days BEFORE each Best Pay Date so utilization is reported under 10%.",
      "Snapshot all three current scores and save to Drive as Baseline_YYYY-MM-DD.png — this is your before picture.",
      "Run the Score Simulator before paying off, closing, or disputing any account to predict the impact.",
      "After mailing each dispute round, log in weekly to confirm deletions actually post.",
      "Screenshot every confirmed deletion to your Drive evidence folder, named: Deletion_BUREAU_AccountName_YYYY-MM-DD.png.",
    ],
    usage:
      "Log in weekly to check three things: (1) the daily change alerts that flag any new account, inquiry, balance jump, or status flip on any bureau, (2) the Money Manager Best Pay Date for every credit card so you pay before the statement closes and your reported utilization stays under 10%, and (3) the score simulator before you pay down a card or close an account. SmartCredit is also where you confirm a deletion actually posted after a dispute round.",
    checklist: [
      "Turn on daily 3-bureau alerts (email and SMS) for new accounts, inquiries, and status changes.",
      "Open Money Manager and write down the Best Pay Date for every active credit card.",
      "Set a calendar reminder 2 days before each Best Pay Date.",
      "Snapshot your current scores from all three bureaus and save to Drive (baseline before disputes).",
      "Note your current utilization on every revolving account.",
      "Run the score simulator for any account you're about to pay off, close, or dispute.",
      "After mailing a dispute round, log in weekly to watch for the deletion or status change.",
      "Save a screenshot of every confirmed deletion to your Drive evidence folder.",
    ],
  },
  {
    id: "identitytheft",
    label: "IdentityTheft.gov",
    description: "FTC recovery plan and official identity-theft affidavit.",
    url: "https://www.identitytheft.gov",
    category: "complaint",
    actionLabel: "File an FTC Identity Theft Report",
    pinned: true,
    rounds: [1],
    playbookRef: { label: "Phase 2 · Clean identity", href: "/playbook/phase/clean-identity" },
    steps: [
      "Confirm the account is genuinely not yours or was opened by fraud (not just inaccurate). For inaccurate accounts use the bureau dispute, not this site.",
      "Go to IdentityTheft.gov and click 'Get started'.",
      "Choose the category that matches your situation (e.g. someone opened a credit account in my name).",
      "Enter every fraudulent account in one session: company name, account number, opening date, bureau where it appears.",
      "Upload your government ID when prompted.",
      "Download the FTC Identity Theft Report PDF (the official affidavit) when intake completes.",
      "Download the personalized recovery plan PDF as well.",
      "Save both to Drive named: FTC_IdentityTheftReport_YYYY-MM-DD.pdf and FTC_RecoveryPlan_YYYY-MM-DD.pdf.",
      "Attach the affidavit to your bureau dispute letter and to your CFPB complaint.",
    ],
    usage:
      "Use this only when an account is genuinely not yours or was opened through fraud. Generate the FTC Identity Theft Report (the official affidavit) and download the personalized recovery plan. Attach the affidavit to your bureau dispute and to a CFPB complaint, and keep a copy in your Drive folder. Do not file here for accounts that are simply inaccurate; that is what the bureau dispute and CFPB are for.",
    checklist: [
      "Confirm the account is not yours (or was opened by fraud), not just inaccurate.",
      "Gather the account name, partial account number, opening date, and bureau where it appears.",
      "Have your government ID ready to upload.",
      "List every fraudulent account in one session so the affidavit covers them all.",
      "Download the FTC Identity Theft Report PDF when you finish the intake.",
      "Save the report to Drive named: FTC_IdentityTheftReport_YYYY-MM-DD.pdf",
      "Save the personalized recovery plan PDF to the same folder.",
      "Attach the FTC report to your bureau dispute letter and to your CFPB complaint.",
    ],
  },
  {
    id: "cfpb",
    label: "CFPB Complaint Portal",
    description: "Federal complaint that forces a 15-day company response.",
    url: "https://www.consumerfinance.gov/complaint/",
    category: "complaint",
    actionLabel: "File a CFPB Complaint",
    pinned: true,
    rounds: [3, 4, 5],
    playbookRef: { label: "Phase 6 · Escalate", href: "/playbook/phase/escalate" },
    steps: [
      "Confirm you have already mailed at least one prior dispute round. CFPB requires a paper trail; you cannot lead here.",
      "Go to consumerfinance.gov/complaint and click 'Submit a complaint'.",
      "Select the product (Credit reporting / Debt collection / Credit card) that matches the issue.",
      "Pick the exact company to complain about: bureau, original creditor, or collector — pick only one.",
      "In 'What happened?' write 3 to 5 factual sentences: what you sent, when you mailed it, what they failed to do.",
      "Cite the specific law violated when applicable: FCRA §611 (bureau), FCRA §623 (furnisher), FDCPA §1692g (collector).",
      "Combine your prior dispute letter, certified mail receipts, and any company response into one PDF.",
      "Upload that PDF as the supporting attachment.",
      "Submit. Save the CFPB case number to your tracker the moment it is issued — the company has 15 days to respond.",
    ],
    usage:
      "File here after the bureau or furnisher has stalled a Round 2 or Round 3 dispute. Pick the company you are complaining about, attach your prior dispute letter and any response, and write a short factual summary with the account number and the specific FCRA or FDCPA violation. The company is required to respond in 15 days, and that pressure resolves a large share of stuck items. Save the case number and the public response.",
    checklist: [
      "Confirm you have already mailed at least one prior dispute round (you cannot lead with CFPB).",
      "Identify the exact company to complain about (bureau, original creditor, or collector).",
      "Have the account name, account number, and dates ready.",
      "Draft a 3 to 5 sentence factual summary: what you sent, when, and what they failed to do.",
      "Cite the specific law violated (FCRA 611, FCRA 623, FDCPA 1692g) where it applies.",
      "Scan your prior dispute letter, certified mail receipts, and any company response into one PDF.",
      "Upload the PDF as the supporting attachment.",
      "Save the CFPB case number to your tracker the moment it is issued.",
    ],
  },
  {
    id: "ftc",
    label: "FTC Report Fraud",
    description: "Federal Trade Commission complaint intake.",
    url: "https://reportfraud.ftc.gov/",
    category: "complaint",
    actionLabel: "Report Collector Misconduct to the FTC",
    rounds: [4, 5],
    playbookRef: { label: "Phase 6 · Escalate", href: "/playbook/phase/escalate" },
    steps: [
      "Document every collector call: date, time, phone number, what was said. A spreadsheet works.",
      "Save every voicemail, text, and email from the collector to your Drive evidence folder.",
      "Identify the specific FDCPA violation (calls before 8am or after 9pm, third-party disclosure, threats, false amount).",
      "Go to reportfraud.ftc.gov and click 'Report Now'.",
      "Choose 'Debt collection' as the category.",
      "Enter the collector's company name, address, and phone number.",
      "Paste your factual summary and reference your CFPB case number if you already filed one.",
      "Submit and save the FTC confirmation page screenshot to Drive — you'll attach this to your State AG complaint next.",
    ],
    usage:
      "File here for collector misconduct that is not strictly identity theft: harassment, calling outside legal hours, refusing to validate a debt, or misrepresenting the amount owed. The FTC does not resolve your individual case, but the report becomes evidence and supports any state Attorney General complaint you file in parallel.",
    checklist: [
      "Document every call: date, time, phone number, and what was said.",
      "Save every voicemail and any text or email from the collector.",
      "Note any FDCPA violation you witnessed (calls before 8am or after 9pm, third-party disclosure, threats).",
      "Have the collector's company name and address ready.",
      "Reference your CFPB case number if you have one.",
      "Save the FTC confirmation page to Drive after submitting.",
    ],
  },
  {
    id: "naag",
    label: "State Attorneys General",
    description: "Directory to file a parallel complaint with your state AG.",
    url: "https://www.naag.org/find-my-ag/",
    category: "complaint",
    actionLabel: "File a State Attorney General Complaint",
    rounds: [4, 5],
    playbookRef: { label: "Phase 6 · Escalate", href: "/playbook/phase/escalate" },
    steps: [
      "Open the NAAG directory and click your state to land on the AG's consumer protection page.",
      "Find the consumer complaint form (sometimes labeled 'File a complaint' or 'Consumer assistance').",
      "Have your CFPB case number ready — you'll reference it for continuity.",
      "Reuse the exact same factual summary you submitted to the CFPB.",
      "Identify whether the violation is FCRA, FDCPA, or your state's consumer protection statute.",
      "Attach the same evidence PDF: prior dispute letter, certified receipts, company response.",
      "Submit. Save the AG confirmation number alongside your CFPB case number in your tracker.",
      "Expect a state response within 30–60 days; it often arrives faster than the CFPB final response.",
    ],
    usage:
      "Use the directory to find your state's Attorney General consumer protection page, then file the same complaint you sent to the CFPB. State AGs respond to violations of state debt collection and credit reporting law and often get a faster reply from local creditors and collectors than a federal complaint alone. Reference your CFPB case number when you file.",
    checklist: [
      "Find your state's AG consumer protection complaint form using the directory.",
      "Have your CFPB case number on hand to reference for continuity.",
      "Reuse the same factual summary you submitted to the CFPB.",
      "Attach your prior dispute letter, certified receipts, and any company response.",
      "Note the state-specific consumer protection statute if you know it.",
      "Save the AG confirmation number alongside your CFPB case number in your tracker.",
    ],
  },
  {
    id: "drive-folder",
    label: "All 19 Letter Templates",
    description: "Parent Google Drive folder containing every letter, organized by phase.",
    url: PARENT_DRIVE_FOLDER,
    category: "kit",
    pinned: true,
    rounds: [1, 2, 3, 4, 5],
    usage:
      "Open the folder, find the letter for the phase you are in, and use File > Make a copy into your own Drive before editing so the master template stays clean. Replace every bracketed placeholder with the exact data from your AnnualCreditReport PDF (report number, account name, account number, dates), then export to PDF and mail certified with return receipt. Keep the green return-receipt card and the certified tracking number in the same folder.",
    checklist: [
      "Create your own Drive folder named: Disputes_YourName, with subfolders for each Round.",
      "Open the parent template folder, find the letter for the round you're sending.",
      "Use File > Make a copy into your own Drive folder. Never edit the master template.",
      "Fill in every bracketed field using your AnnualCreditReport PDF as the source of truth.",
      "Proofread: report number, account name, partial account number, date of last activity.",
      "Export to PDF and print on plain white paper.",
      "Sign in blue or black ink. Mail certified with return receipt.",
      "Save the certified tracking number and a scan of the green return receipt to the round subfolder.",
    ],
  },
  {
    id: "academy",
    label: "Join Credit Academy",
    description: "Cohort coaching, monthly Q&A, and the deeper curriculum.",
    url: "https://shondamartin.com",
    category: "academy",
    pinned: true,
    usage:
      "Join when you want me to look at your actual file, walk through your specific accounts on a live call, and stay accountable through a full 5-round cycle. Inside you get the deeper curriculum on rebuilding after deletions, the monthly Q&A where I review member files, and a community of people running the same playbook so you can compare strategies and timelines.",
  },
];

export const PINNED_RESOURCES = RESOURCES.filter((r) => r.pinned);

/** Static metadata for the dispute round timeline on the Resources page. */
export const DISPUTE_ROUNDS: { round: DisputeRound; name: string; focus: string }[] = [
  {
    round: 1,
    name: "Round 1 · Open the dispute",
    focus: "Pull official reports, lock in your baseline, and mail the first dispute by certified mail.",
  },
  {
    round: 2,
    name: "Round 2 · Cite the law",
    focus: "Send the second letter referencing FCRA 611 / 623 timing and accuracy requirements.",
  },
  {
    round: 3,
    name: "Round 3 · Direct demand",
    focus: "Escalate to the furnisher and open a CFPB complaint if the bureau or creditor stalls.",
  },
];
