// ─── Hybrid Search & Legal Intelligence Types ─────────────────────────────────

import type { ActYear, BareActContent, SectionExample, CaseLaw, Amendment, Circular, Notification, RevisionNote, FAQ } from './index';

export type ConfidenceLevel =
  | 'Verified'
  | 'Verified + AI Summary'
  | 'AI Generated (Needs Verification)';

export interface Citation {
  id: string;
  sourceType: 'Act' | 'CBDT Circular' | 'CBDT Notification' | 'Case Law' | 'Finance Act' | 'Rule' | 'Form';
  title: string;
  referenceNumber?: string;
  url?: string;
  year?: number | string;
  publisher?: string;
}

export interface McqItem {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface PyqItem {
  id: string;
  year: string;
  exam: 'CA Inter' | 'CA Final' | 'Other';
  marks: number;
  question: string;
  answer: string;
}

export interface HybridSearchResult {
  id: string;
  sectionNumber: string;
  actYear: ActYear;
  title: string;

  // Specified content fields
  simpleMeaning?: string;
  detailedMeaning?: string;
  bareAct?: BareActContent | string;
  section1961?: string;
  section2025?: string;
  importantChanges?: string[];
  examples?: SectionExample[];
  relatedSections?: string[];
  caseLaws?: CaseLaw[];
  latestAmendments?: Amendment[];
  cbdtCirculars?: Circular[];
  notifications?: Notification[];
  revisionNotes?: RevisionNote[] | string[];
  faqs?: FAQ[];
  mcqs?: McqItem[];
  pyqs?: PyqItem[];

  // Verification & Metadata (Required for every result)
  source: string;
  lastUpdated: string;
  confidenceLevel: ConfidenceLevel;
  citations?: Citation[];
}

export interface CacheEntry<T> {
  key: string;
  data: T;
  timestamp: number;
  ttlMs: number;
}
