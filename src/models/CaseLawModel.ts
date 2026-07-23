// ─── Case Law Model Class ──────────────────────────────────────────────────────

import type { CaseLaw, CourtLevel, ActYear } from '@/types/legal';
import type { SearchableDocument } from '@/types/search';
import { tokenize } from '@/lib/search/normalizer';

export class CaseLawModel implements CaseLaw {
  readonly id: string;
  readonly title: string;
  readonly citation: string;
  readonly court: CourtLevel;
  readonly bench?: string;
  readonly judgmentDate?: string;
  readonly year: number;
  readonly relatedSections: string[];
  readonly relatedActId?: ActYear;
  readonly headnote: string;
  readonly keyHoldings?: string[];
  readonly summary?: string;
  readonly url?: string;
  readonly tags: string[];
  readonly isFavorable?: boolean;
  readonly source?: string;

  constructor(data: CaseLaw) {
    this.id = data.id;
    this.title = data.title;
    this.citation = data.citation;
    this.court = data.court;
    this.bench = data.bench;
    this.judgmentDate = data.judgmentDate;
    this.year = data.year;
    this.relatedSections = data.relatedSections || [];
    this.relatedActId = data.relatedActId;
    this.headnote = data.headnote;
    this.keyHoldings = data.keyHoldings;
    this.summary = data.summary;
    this.url = data.url;
    this.tags = data.tags || [];
    this.isFavorable = data.isFavorable;
    this.source = data.source;
  }

  get href(): string {
    return `/case-laws/${this.id}`;
  }

  get displayTitle(): string {
    return `${this.title} (${this.citation})`;
  }

  toSearchableDocument(): SearchableDocument {
    return {
      id: this.id,
      type: 'caseLaw',
      datasetId: 'caseLaws',
      title: this.displayTitle,
      searchTokens: [
        ...tokenize(this.title),
        ...tokenize(this.citation),
        ...this.tags.map((t) => t.toLowerCase()),
      ],
      synonymTokens: this.relatedSections.map((s) => `section ${s}`.toLowerCase()),
      excerpt: this.headnote || this.summary || `Case Law from ${this.court}`,
      href: this.href,
      tags: this.tags,
      actId: this.relatedActId,
    };
  }
}
