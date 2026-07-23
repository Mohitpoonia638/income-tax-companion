// ─── Section Interface ─────────────────────────────────────────────────────────

import type { ActYear } from './act';
import type { RevisionNote } from './revisionNote';

export type SectionStatus = 'active' | 'amended' | 'omitted' | 'pending';
export type ExamImportance = 'high' | 'medium' | 'low';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface SectionLimit {
  title: string;
  amount?: number;
  condition?: string;
  description: string;
}

export interface SectionPenalty {
  offense: string;
  penaltyAmount?: string;
  relevantSection?: string;
  description: string;
}

export interface SectionExample {
  id: string;
  title: string;
  scenario: string;
  solution: string;
}

export interface BareActContent {
  rawText: string;
  subsections?: Array<{
    number: string; // e.g. "(1)", "(2)(a)"
    text: string;
    proviso?: string[];
    explanation?: string[];
  }>;
}

export interface Section {
  id: string;
  actYear: ActYear;
  sectionNumber: string; // e.g., "80C", "194Q"
  sectionTitle: string;
  chapter: string; // e.g., "Chapter VI-A" or chapterId
  keywords: string[];
  synonyms: string[];
  status: SectionStatus;

  // Backward compatibility aliases
  number?: string;
  title?: string;
  actId?: ActYear;
  chapterId?: string;
  tags?: string[];
  parallelSectionId?: string;

  effectiveDate?: string;
  parallelSection?: string; // mapped section number in the counterpart act
  oldSection?: string;      // 1961 section number
  newSection?: string;      // 2025 section number
  simpleMeaning?: string;   // CA student friendly summary
  detailedMeaning?: string; // In-depth explanation
  bareAct?: BareActContent | string;
  importantChanges?: string[];
  exceptions?: string[];
  limits?: SectionLimit[];
  penalties?: SectionPenalty[];
  examples?: SectionExample[];
  relatedSections?: string[];
  relatedRules?: string[];
  relatedForms?: string[];
  caseLawIds?: string[];
  amendmentIds?: string[];
  circularIds?: string[];
  notificationIds?: string[];
  revisionNotes?: RevisionNote[] | string[];
  examImportance?: ExamImportance;
  difficultyLevel?: DifficultyLevel;
  lastUpdated?: string;
  source?: string;
}
