// ─── Act Types (Re-exported from legal/ for backward compatibility) ─────────────

export type { Act, ActYear, ActId, ActMeta } from './legal/act';
export type { Chapter } from './legal/chapter';
export type { Section, BareActContent, SectionStatus } from './legal/section';

export interface Subsection {
  id: string;
  sectionId: string;
  label: string;          // e.g. "(1)", "(a)", "(i)"
  text: string;
  proviso?: string;
  explanation?: string;
}
