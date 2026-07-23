// ─── Circular Model Class ──────────────────────────────────────────────────────

import type { Circular, CircularCategory, ActYear } from '@/types/legal';
import type { SearchableDocument } from '@/types/search';
import { tokenize } from '@/lib/search/normalizer';

export class CircularModel implements Circular {
  readonly id: string;
  readonly circularNumber: string;
  readonly number?: string;
  readonly title: string;
  readonly issueDate: string;
  readonly date?: string;
  readonly category: CircularCategory;
  readonly type?: CircularCategory;
  readonly subject: string;
  readonly relatedSections: string[];
  readonly relatedActId?: ActYear;
  readonly pdfUrl?: string;
  readonly url?: string;
  readonly summary?: string;
  readonly keyPoints?: string[];
  readonly source?: string;

  constructor(data: Circular) {
    this.id = data.id;
    this.circularNumber = data.circularNumber || data.number || '';
    this.number = this.circularNumber;
    this.title = data.title;
    this.issueDate = data.issueDate || data.date || '';
    this.date = this.issueDate;
    this.category = data.category || data.type || 'Circular';
    this.type = this.category;
    this.subject = data.subject;
    this.relatedSections = data.relatedSections || [];
    this.relatedActId = data.relatedActId;
    this.pdfUrl = data.pdfUrl || data.url;
    this.url = this.pdfUrl;
    this.summary = data.summary;
    this.keyPoints = data.keyPoints;
    this.source = data.source;
  }

  get href(): string {
    return `/circulars/${this.id}`;
  }

  get displayTitle(): string {
    return `CBDT ${this.category} No. ${this.circularNumber}: ${this.title}`;
  }

  toSearchableDocument(): SearchableDocument {
    return {
      id: this.id,
      type: 'circular',
      datasetId: 'circulars',
      title: this.displayTitle,
      searchTokens: [
        ...tokenize(this.title),
        ...tokenize(this.subject),
        ...tokenize(this.circularNumber),
      ],
      synonymTokens: this.relatedSections.map((s) => `section ${s}`.toLowerCase()),
      excerpt: this.summary || this.subject || `CBDT ${this.category} ${this.circularNumber}`,
      href: this.href,
      tags: ['cbdt', 'circular', ...this.relatedSections.map((s) => `sec-${s}`)],
      actId: this.relatedActId,
    };
  }
}
