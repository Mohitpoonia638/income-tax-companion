// ─── Chapter Interface ─────────────────────────────────────────────────────────

import type { ActYear } from './act';

export interface Chapter {
  id: string;
  actId: ActYear;
  chapterNumber: string; // e.g. "IV", "VI-A"
  title: string;
  sectionRange: string;  // e.g. "14-59", "80C-80U"
  description?: string;
  order?: number;
}
