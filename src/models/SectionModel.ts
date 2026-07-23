// ─── Section Model Class ───────────────────────────────────────────────────────

import type {
  Section,
  ActYear,
  SectionStatus,
  ExamImportance,
  DifficultyLevel,
  SectionLimit,
  SectionPenalty,
  SectionExample,
  BareActContent,
} from '@/types/legal';
import type { SearchableDocument } from '@/types/search';
import { tokenize } from '@/lib/search/normalizer';

export class SectionModel implements Section {
  readonly id: string;
  readonly actYear: ActYear;
  readonly sectionNumber: string;
  readonly sectionTitle: string;
  readonly chapter: string;
  readonly keywords: string[];
  readonly synonyms: string[];
  readonly status: SectionStatus;
  readonly effectiveDate?: string;
  readonly parallelSection?: string;
  readonly oldSection?: string;
  readonly newSection?: string;
  readonly simpleMeaning?: string;
  readonly detailedMeaning?: string;
  readonly bareAct?: BareActContent | string;
  readonly importantChanges?: string[];
  readonly exceptions?: string[];
  readonly limits?: SectionLimit[];
  readonly penalties?: SectionPenalty[];
  readonly examples?: SectionExample[];
  readonly relatedSections?: string[];
  readonly relatedRules?: string[];
  readonly relatedForms?: string[];
  readonly caseLawIds?: string[];
  readonly amendmentIds?: string[];
  readonly circularIds?: string[];
  readonly notificationIds?: string[];
  readonly revisionNotes?: string[];
  readonly examImportance?: ExamImportance;
  readonly difficultyLevel?: DifficultyLevel;
  readonly lastUpdated?: string;
  readonly source?: string;

  constructor(data: Section) {
    this.id = data.id;
    this.actYear = data.actYear;
    this.sectionNumber = data.sectionNumber;
    this.sectionTitle = data.sectionTitle;
    this.chapter = data.chapter;
    this.keywords = data.keywords || [];
    this.synonyms = data.synonyms || [];
    this.status = data.status || 'active';
    this.effectiveDate = data.effectiveDate;
    this.parallelSection = data.parallelSection;
    this.oldSection = data.oldSection;
    this.newSection = data.newSection;
    this.simpleMeaning = data.simpleMeaning;
    this.detailedMeaning = data.detailedMeaning;
    this.bareAct = data.bareAct;
    this.importantChanges = data.importantChanges;
    this.exceptions = data.exceptions;
    this.limits = data.limits;
    this.penalties = data.penalties;
    this.examples = data.examples;
    this.relatedSections = data.relatedSections;
    this.relatedRules = data.relatedRules;
    this.relatedForms = data.relatedForms;
    this.caseLawIds = data.caseLawIds;
    this.amendmentIds = data.amendmentIds;
    this.circularIds = data.circularIds;
    this.notificationIds = data.notificationIds;
    this.revisionNotes = data.revisionNotes as string[] | undefined;
    this.examImportance = data.examImportance;
    this.difficultyLevel = data.difficultyLevel;
    this.lastUpdated = data.lastUpdated;
    this.source = data.source;
  }

  // Computed Properties

  get formattedNumber(): string {
    return `Section ${this.sectionNumber}`;
  }

  get displayName(): string {
    return `${this.formattedNumber}: ${this.sectionTitle}`;
  }

  get href(): string {
    return `/acts/${this.actYear}/${this.sectionNumber.toLowerCase()}`;
  }

  get hasBareAct(): boolean {
    if (!this.bareAct) return false;
    if (typeof this.bareAct === 'string') return this.bareAct.trim().length > 0;
    return Boolean(this.bareAct.rawText?.trim());
  }

  get isExamHighPriority(): boolean {
    return this.examImportance === 'high';
  }

  get rawBareActText(): string {
    if (!this.bareAct) return '';
    if (typeof this.bareAct === 'string') return this.bareAct;
    return this.bareAct.rawText || '';
  }

  /**
   * Convert SectionModel into SearchableDocument for the Search Engine
   */
  toSearchableDocument(): SearchableDocument {
    return {
      id: this.id,
      type: 'section',
      datasetId: this.actYear === '1961' ? 'sections-1961' : 'sections-2025',
      title: `${this.formattedNumber} — ${this.sectionTitle}`,
      sectionNumber: this.sectionNumber,
      searchTokens: [
        ...tokenize(this.sectionTitle),
        ...this.keywords.map((k) => k.toLowerCase()),
        this.sectionNumber.toLowerCase(),
      ],
      synonymTokens: this.synonyms.map((s) => s.toLowerCase()),
      excerpt:
        this.simpleMeaning ||
        `${this.formattedNumber} of Income Tax Act, ${this.actYear}. ${this.chapter}`,
      href: this.href,
      tags: this.keywords,
      actId: this.actYear,
    };
  }
}
