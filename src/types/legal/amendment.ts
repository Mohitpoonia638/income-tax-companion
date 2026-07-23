// ─── Amendment Interface ───────────────────────────────────────────────────────

import type { ActYear } from './act';

export type AmendmentType =
  | 'Insertion'
  | 'Substitution'
  | 'Omission'
  | 'Retrospective';

export interface Amendment {
  id: string;
  sectionNumber: string;
  sectionId?: string;
  actYear: ActYear;
  actId?: ActYear;
  type: AmendmentType;
  financeActYear: number;     // e.g. 2024
  effectiveFrom: string;      // ISO date or Assessment Year string
  financeBillClause?: string;
  description: string;
  oldText?: string;
  newText?: string;
  impactAnalysis?: string;
  relatedCircularIds?: string[];
  source?: string;
}
