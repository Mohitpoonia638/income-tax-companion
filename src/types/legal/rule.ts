// ─── Rule Interface ────────────────────────────────────────────────────────────

import type { ActYear } from './act';

export interface Rule {
  id: string;
  ruleNumber: string;        // e.g. "Rule 2BB", "Rule 3"
  title: string;
  actYear: ActYear;
  relatedSections: string[]; // section numbers
  description: string;
  fullText?: string;
  lastAmended?: string;
  source?: string;
}
