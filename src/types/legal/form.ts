// ─── Form Interface ────────────────────────────────────────────────────────────

import type { ActYear } from './act';

export type FormCategory = 'ITR' | 'TDS' | 'Audit' | 'Appeal' | 'Other';

export interface Form {
  id: string;
  formNumber: string;        // e.g. "Form 16", "Form 26AS", "ITR-1", "Form 10B"
  title: string;
  category: FormCategory;
  actYear: ActYear;
  relatedSections: string[];
  purpose: string;
  dueDateDescription?: string;
  downloadUrl?: string;
  source?: string;
}
