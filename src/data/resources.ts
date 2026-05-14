import { PARENT_DRIVE_FOLDER } from "./letters";

export type ResourceCategory = "report" | "monitoring" | "complaint" | "kit" | "academy";

export interface Resource {
  id: string;
  label: string;
  description: string;
  url: string;
  category: ResourceCategory;
  /** Show in sidebar quick-access list */
  pinned?: boolean;
}

export const RESOURCES: Resource[] = [
  {
    id: "annualcreditreport",
    label: "AnnualCreditReport.com",
    description: "Official source for your free Equifax, Experian, and TransUnion reports.",
    url: "https://www.annualcreditreport.com",
    category: "report",
    pinned: true,
  },
  {
    id: "smartcredit",
    label: "SmartCredit",
    description: "Daily 3-bureau monitoring with the easier-to-read report format we use throughout the Playbook.",
    url: "https://www.smartcredit.com",
    category: "report",
    pinned: true,
  },
  {
    id: "identitytheft",
    label: "IdentityTheft.gov",
    description: "FTC recovery plan and official identity-theft affidavit.",
    url: "https://www.identitytheft.gov",
    category: "complaint",
    pinned: true,
  },
  {
    id: "cfpb",
    label: "CFPB Complaint Portal",
    description: "Federal complaint that forces a 15-day company response.",
    url: "https://www.consumerfinance.gov/complaint/",
    category: "complaint",
    pinned: true,
  },
  {
    id: "ftc",
    label: "FTC Report Fraud",
    description: "Federal Trade Commission complaint intake.",
    url: "https://reportfraud.ftc.gov/",
    category: "complaint",
  },
  {
    id: "naag",
    label: "State Attorneys General",
    description: "Directory to file a parallel complaint with your state AG.",
    url: "https://www.naag.org/find-my-ag/",
    category: "complaint",
  },
  {
    id: "drive-folder",
    label: "All 19 Letter Templates",
    description: "Parent Google Drive folder containing every letter, organized by phase.",
    url: PARENT_DRIVE_FOLDER,
    category: "kit",
    pinned: true,
  },
  {
    id: "academy",
    label: "Join Credit Academy",
    description: "Cohort coaching, monthly Q&A, and the deeper curriculum.",
    url: "https://shondamartin.com",
    category: "academy",
    pinned: true,
  },
];

export const PINNED_RESOURCES = RESOURCES.filter((r) => r.pinned);
