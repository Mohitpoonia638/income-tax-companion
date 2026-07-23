// ─── Case Law Interface ────────────────────────────────────────────────────────

import type { ActYear } from './act';

export type CourtLevel =
  | 'Supreme Court'
  | 'High Court'
  | 'ITAT'
  | 'AAR'
  | 'CESTAT'
  | 'Other';

export interface CaseLaw {
  id: string;
  title: string;             // e.g. "CIT v. ABC Ltd."
  citation: string;          // e.g. "[2024] 168 ITD 101 (SC)"
  court: CourtLevel;
  bench?: string;            // e.g. "Delhi", "Mumbai"
  judgmentDate?: string;
  year: number;
  relatedSections: string[];
  relatedActId?: ActYear;
  headnote: string;
  keyHoldings?: string[];
  summary?: string;
  url?: string;
  tags: string[];
  isFavorable?: boolean;     // assessee-favorable ruling
  source?: string;
}
