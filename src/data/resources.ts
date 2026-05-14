import { PARENT_DRIVE_FOLDER } from "./letters";

export type ResourceCategory = "report" | "monitoring" | "complaint" | "kit" | "academy";

export interface Resource {
  id: string;
  label: string;
  description: string;
  url: string;
  category: ResourceCategory;
  /** One-paragraph "what to pull" summary shown on the Resources page. */
  usage?: string;
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
    pinned: true,
    usage:
      "Pull all three bureau reports (Equifax, Experian, TransUnion) the day you start a dispute round. What you need from this site: the official report number printed on each PDF, the exact account names and partial account numbers as the bureau lists them, and the dates of last activity. These are the identifiers you cite verbatim in every letter, so save each PDF to your Drive folder labeled with the bureau and date.",
  },
  {
    id: "smartcredit",
    label: "Credit Report, Monitoring and Building Tools",
    description: "SmartCredit gives you daily 3-bureau monitoring, the easier-to-read report format we use throughout the Playbook, plus credit-building tools.",
    url: "https://www.smartcredit.com",
    category: "report",
    pinned: true,
    usage:
      "Log in weekly to check three things: (1) the daily change alerts that flag any new account, inquiry, balance jump, or status flip on any bureau, (2) the Money Manager Best Pay Date for every credit card so you pay before the statement closes and your reported utilization stays under 10%, and (3) the score simulator before you pay down a card or close an account. SmartCredit is also where you confirm a deletion actually posted after a dispute round.",
  },
  {
    id: "identitytheft",
    label: "IdentityTheft.gov",
    description: "FTC recovery plan and official identity-theft affidavit.",
    url: "https://www.identitytheft.gov",
    category: "complaint",
    pinned: true,
    usage:
      "Use this only when an account is genuinely not yours or was opened through fraud. Generate the FTC Identity Theft Report (the official affidavit) and download the personalized recovery plan. Attach the affidavit to your bureau dispute and to a CFPB complaint, and keep a copy in your Drive folder. Do not file here for accounts that are simply inaccurate; that is what the bureau dispute and CFPB are for.",
  },
  {
    id: "cfpb",
    label: "CFPB Complaint Portal",
    description: "Federal complaint that forces a 15-day company response.",
    url: "https://www.consumerfinance.gov/complaint/",
    category: "complaint",
    pinned: true,
    usage:
      "File here after the bureau or furnisher has stalled a Round 2 or Round 3 dispute. Pick the company you are complaining about, attach your prior dispute letter and any response, and write a short factual summary with the account number and the specific FCRA or FDCPA violation. The company is required to respond in 15 days, and that pressure resolves a large share of stuck items. Save the case number and the public response.",
  },
  {
    id: "ftc",
    label: "FTC Report Fraud",
    description: "Federal Trade Commission complaint intake.",
    url: "https://reportfraud.ftc.gov/",
    category: "complaint",
    usage:
      "File here for collector misconduct that is not strictly identity theft: harassment, calling outside legal hours, refusing to validate a debt, or misrepresenting the amount owed. The FTC does not resolve your individual case, but the report becomes evidence and supports any state Attorney General complaint you file in parallel.",
  },
  {
    id: "naag",
    label: "State Attorneys General",
    description: "Directory to file a parallel complaint with your state AG.",
    url: "https://www.naag.org/find-my-ag/",
    category: "complaint",
    usage:
      "Use the directory to find your state's Attorney General consumer protection page, then file the same complaint you sent to the CFPB. State AGs respond to violations of state debt collection and credit reporting law and often get a faster reply from local creditors and collectors than a federal complaint alone. Reference your CFPB case number when you file.",
  },
  {
    id: "drive-folder",
    label: "All 19 Letter Templates",
    description: "Parent Google Drive folder containing every letter, organized by phase.",
    url: PARENT_DRIVE_FOLDER,
    category: "kit",
    pinned: true,
    usage:
      "Open the folder, find the letter for the phase you are in, and use File > Make a copy into your own Drive before editing so the master template stays clean. Replace every bracketed placeholder with the exact data from your AnnualCreditReport PDF (report number, account name, account number, dates), then export to PDF and mail certified with return receipt. Keep the green return-receipt card and the certified tracking number in the same folder.",
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
