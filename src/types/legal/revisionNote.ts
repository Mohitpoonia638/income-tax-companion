// ─── Revision Note Interface ──────────────────────────────────────────────────

export interface RevisionNote {
  id: string;
  sectionNumber?: string;
  title: string;
  keyTakeaways: string[];
  mnemonic?: string;
  formula?: string;
  examTips?: string[];
  lastRevised?: string;
  author?: string;
}
