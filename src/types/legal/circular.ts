// ─── Circular Interface ────────────────────────────────────────────────────────

import type { ActYear } from './act';

export type CircularCategory = 'Circular' | 'Instruction' | 'Order';

export interface Circular {
  id: string;
  circularNumber: string;    // e.g. "1/2025"
  title: string;
  issueDate: string;          // ISO date
  category: CircularCategory;
  subject: string;
  relatedSections: string[];

  // Backward compatibility aliases
  number?: string;
  date?: string;
  type?: CircularCategory;

  relatedActId?: ActYear;
  pdfUrl?: string;
  url?: string;
  summary?: string;
  keyPoints?: string[];
  source?: string;
}
