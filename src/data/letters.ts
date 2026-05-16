export type LetterId =
  | "L01"
  | "L02"
  | "L03"
  | "L04"
  | "L05"
  | "L06"
  | "L07"
  | "L08"
  | "L09"
  | "L10"
  | "L11"
  | "L12"
  | "L13"
  | "L14"
  | "L15A"
  | "L15B"
  | "L15C"
  | "L16"
  | "L17"
  | "L18"
  | "L19";

export type PhaseId =
  | "prepare"
  | "validate"
  | "clean-identity"
  | "dispute-bureaus"
  | "challenge-furnishers"
  | "escalate";

export interface Letter {
  id: LetterId;
  phaseId: PhaseId;
  phaseNumber: 2 | 3 | 4 | 5;
  title: string;
  lede: string;
  /** Force-copy URL — opens "Make a copy" prompt */
  copyUrl: string;
  /** View/edit URL — opens read-only preview */
  viewUrl: string;
}

const docId = (id: string) => ({
  copyUrl: `https://docs.google.com/document/d/${id}/copy`,
  viewUrl: `https://docs.google.com/document/d/${id}/edit`,
});

export const PARENT_DRIVE_FOLDER =
  "https://drive.google.com/drive/folders/1T9Hpc7VFSNxHxJBqhV8ZvYKkBqT-RJs1?usp=sharing";

export const LETTERS: Letter[] = [
  {
    id: "L01",
    phaseId: "validate",
    phaseNumber: 2,
    title: "Initial Debt Validation Request",
    lede: "Open the validation window. Force the collector to prove the debt before it goes further.",
    ...docId("1Oo5tc55LcmU0e4MS3aBO2mRyI36BNFCvyURQ_GtU--8"),
  },
  {
    id: "L02",
    phaseId: "validate",
    phaseNumber: 2,
    title: "Validation Follow-Up · No Response",
    lede: "Thirty days have passed. Cite the silence and demand removal.",
    ...docId("19mzRKeL96yR-Jg7rQEr_x_y6mZFzvJAwpILyWFVxwWM"),
  },
  {
    id: "L03",
    phaseId: "validate",
    phaseNumber: 2,
    title: "Dispute of Inadequate Validation",
    lede: "They sent paper. Paper isn't validation. Reject it on the record.",
    ...docId("14wkWclRBXrrjIDHbgr98qJ4Cyzw_J1YMwVUx4oHgOOc"),
  },
  {
    id: "L04",
    phaseId: "validate",
    phaseNumber: 2,
    title: "Validation Bridge · Errors Identified",
    lede: "Their response exposed errors. Pivot from validation to dispute.",
    ...docId("1B3qsSiMAzEq_cc_WD9SuqTz9lKXXzXMlMc3cbGubpM8"),
  },

  {
    id: "L05",
    phaseId: "clean-identity",
    phaseNumber: 3,
    title: "Creditor Personal Information Update",
    lede: "Correct the source. Stop wrong addresses and aliases at the creditor.",
    ...docId("1YV9iu0tc0mww89S6X3NUW6kIB9YTNInTvTUXmxisKsQ"),
  },
  {
    id: "L06",
    phaseId: "clean-identity",
    phaseNumber: 3,
    title: "Bureau Personal Information Dispute",
    lede: "Strip outdated names, addresses, and employers from your bureau file.",
    ...docId("1rD8csz5TZSs-mADCSv6tXawkEiM3SMWLTE33t8Qe5b0"),
  },
  {
    id: "L07",
    phaseId: "clean-identity",
    phaseNumber: 3,
    title: "Bureau PI Follow-Up · Failure to Investigate",
    lede: "They ignored you. Cite §1681i and demand a real investigation.",
    ...docId("1hhdEgqATac-yhQQTqXeBaRSmdUKpfltxr5jRqogywpU"),
  },
  {
    id: "L08",
    phaseId: "clean-identity",
    phaseNumber: 3,
    title: "Mixed File / Identity Theft",
    lede: "Another person's data is on your file. Separate the two — fast.",
    ...docId("1YF6taAcRCNUeDH4vdRTQjlE6fS8XzNbGhfSOcpnnQHI"),
  },
  {
    id: "L09",
    phaseId: "clean-identity",
    phaseNumber: 3,
    title: "PI Method of Verification Demand",
    lede: "Ask exactly how they verified each piece of personal data.",
    ...docId("1q2vfCbMwa88DopJ_89ovaK3PKZLxwmU0qlCoCm2uidU"),
  },
  {
    id: "L10",
    phaseId: "clean-identity",
    phaseNumber: 3,
    title: "SSN / Date of Birth Correction",
    lede: "Anchor your file with the right SSN and DOB. Foundational accuracy.",
    ...docId("1QbX4PlUKAGcHf4iotJtzd16lN1Gb-LuNM2Bgrz9bXec"),
  },

  {
    id: "L11",
    phaseId: "dispute-bureaus",
    phaseNumber: 4,
    title: "Bureau Accuracy Dispute",
    lede: "Round 1 to the bureaus. Open the dispute on each inaccurate item.",
    ...docId("1qKxOj09Y6qoYobNwTdwD90lDtjv-2lGMl2VsbVvg9aQ"),
  },
  {
    id: "L12",
    phaseId: "dispute-bureaus",
    phaseNumber: 4,
    title: "Procedure Exposure · MOV Demand",
    lede: "Round 2. Demand the method of verification. Expose lazy investigations.",
    ...docId("1AGGDLXmv_6FZbqZaBZLZgri6e_er28v5QHpmnsOxqFQ"),
  },
  {
    id: "L13",
    phaseId: "dispute-bureaus",
    phaseNumber: 4,
    title: "Notice of Intent to File Complaint",
    lede: "Round 3. Put them on formal notice that CFPB and AG complaints are next.",
    ...docId("1xJ-JreUFPo3SxypAdh_t_5P2iF2p4bnX8vKh1sevVco"),
  },
  {
    id: "L14",
    phaseId: "dispute-bureaus",
    phaseNumber: 4,
    title: "Final Violation Notice",
    lede: "Last warning before escalation. Document everything for Phase 6.",
    ...docId("1o-j-q7PaGkISYllurkymjUTNf_wD5uHtegc5F1A02-o"),
  },

  {
    id: "L15A",
    phaseId: "challenge-furnishers",
    phaseNumber: 5,
    title: "Direct Furnisher Dispute · Collection Agency",
    lede: "Bypass the bureaus. Hit the collector directly with the §1681s-2 obligation.",
    ...docId("1sWxk8wOFqpiGTZOH0XA6d76iiY8iybFON5YBWx1WMqk"),
  },
  {
    id: "L15B",
    phaseId: "challenge-furnishers",
    phaseNumber: 5,
    title: "Direct Furnisher Dispute · Original Creditor",
    lede: "Same play, original-creditor variant. Force re-investigation at the source.",
    ...docId("1_oGzY1c0qN3UUsc8_4PF18f9JaXufCHuPJ2UHOUYOMo"),
  },
  {
    id: "L15C",
    phaseId: "challenge-furnishers",
    phaseNumber: 5,
    title: "Bureau Companion · Concurrent Investigation",
    lede: "Mirror letter to the bureau so both ends are accountable on the same clock.",
    ...docId("1LJbOXX2kQa8jJBw73OTG3Bygb2gNLr0BbnfrwHluGzI"),
  },
  {
    id: "L16",
    phaseId: "challenge-furnishers",
    phaseNumber: 5,
    title: "Inconsistency Attack",
    lede: "Three bureaus, three versions of the same account. Use the gaps.",
    ...docId("1A8RwnT6necNIYUioCFy8Tp4zeeFL9LVuSOC0a5DdRXc"),
  },
  {
    id: "L17",
    phaseId: "challenge-furnishers",
    phaseNumber: 5,
    title: "Advanced Charge-Off Violation Dispute",
    lede: "Re-aging, balance updates, status flips — pin the violations on charge-offs.",
    ...docId("10xUs8FLwTvKtU5T9Mtw3vjZ5JCkk0GB45F4cJvJFQrs"),
  },
  {
    id: "L18",
    phaseId: "challenge-furnishers",
    phaseNumber: 5,
    title: "Pay for Delete Offer",
    lede: "When validation and dispute haven't moved it, propose the trade in writing.",
    ...docId("10OE3CfVa_XCFKCP85wHwB1q9VxxaSo1uXWDo5mVb4iA"),
  },
  {
    id: "L19",
    phaseId: "challenge-furnishers",
    phaseNumber: 5,
    title: "Unauthorized Hard Inquiry Removal",
    lede: "Inquiries you didn't authorize are §1681b violations. Get them off.",
    ...docId("1nHuvDO-525JTnYk1CLU2uhq9rAeVjsbmjBj4OJfIemg"),
  },
];

export const LETTERS_BY_ID: Record<LetterId, Letter> = LETTERS.reduce(
  (acc, l) => {
    acc[l.id] = l;
    return acc;
  },
  {} as Record<LetterId, Letter>,
);

export function lettersForPhase(phaseId: PhaseId): Letter[] {
  return LETTERS.filter((l) => l.phaseId === phaseId);
}
