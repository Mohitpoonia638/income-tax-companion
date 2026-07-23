// ─── Unified Knowledge Layer Types ──────────────────────────────────────────────

import type {
  Act,
  Section,
  SectionMapping,
  Amendment,
  Circular,
  Notification,
  CaseLaw,
  ActYear,
} from './index';

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  relatedSections: string[];
  actYear?: ActYear;
  category?: 'General' | 'Computation' | 'Compliance' | 'Exemption';
  tags?: string[];
  source?: string;
}

export interface StudyNote {
  id: string;
  title: string;
  sectionNumber?: string;
  actYear?: ActYear;
  keyConcepts: string[];
  summary: string;
  mnemonics?: string[];
  examTips?: string[];
  tags?: string[];
  author?: string;
  source?: string;
}

export interface KnowledgePlaceholders {
  studentExplanationPlaceholder?: string;
  practicalExamplePlaceholder?: string;
  revisionNotePlaceholder?: string;
  aiExplanationPlaceholder?: string;
}

export interface SectionKnowledgeGraph {
  section: Section | null;
  parallelSection?: Section | null;
  mapping?: SectionMapping | null;
  amendments: Amendment[];
  circulars: Circular[];
  notifications: Notification[];
  caseLaws: CaseLaw[];
  faqs: FAQ[];
  studyNotes: StudyNote[];
  placeholders: KnowledgePlaceholders;
}

export interface KnowledgeLookupOptions {
  sectionNumber?: string;
  actYear?: ActYear;
  keyword?: string;
  limit?: number;
}

export type KnowledgeEntityType =
  | 'act'
  | 'section'
  | 'sectionMapping'
  | 'amendment'
  | 'circular'
  | 'notification'
  | 'caseLaw'
  | 'faq'
  | 'studyNote';
