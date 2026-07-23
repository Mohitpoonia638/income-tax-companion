// ─── Act Interface ─────────────────────────────────────────────────────────────

export type ActYear = '1961' | '2025';
export type ActId = ActYear;

export interface ActMeta {
  id: ActId;
  title: string;
  shortTitle: string;
  year: number;
  effectiveDate?: string;
  color: 'blue' | 'violet';
  description: string;
}

export interface Act {
  id: string;
  actYear: ActYear;
  title: string;
  shortTitle: string;
  enactmentDate?: string;
  effectiveDate?: string;
  totalChapters?: number;
  totalSections?: number;
  description: string;
  color: 'blue' | 'violet';
  lastUpdated?: string;
  source?: string;
}
