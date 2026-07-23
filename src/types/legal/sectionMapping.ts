// ─── Section Mapping Interface ──────────────────────────────────────────────────

export interface SectionMapping {
  id: string;
  section1961: string;      // e.g. "80C"
  section2025: string;      // e.g. "72"
  title1961: string;
  title2025: string;
  mappingType: 'direct' | 'merged' | 'split' | 'new' | 'omitted';
  changeSummary: string;
  keyDifferences?: string[];
  effectiveAssessmentYear?: string;
}
