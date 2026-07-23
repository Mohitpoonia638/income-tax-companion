// ─── Amendment Model Class ─────────────────────────────────────────────────────

import type { Amendment, AmendmentType, ActYear } from '@/types/legal';
import type { SearchableDocument } from '@/types/search';
import { tokenize } from '@/lib/search/normalizer';

export class AmendmentModel implements Amendment {
  readonly id: string;
  readonly sectionNumber: string;
  readonly sectionId?: string;
  readonly actYear: ActYear;
  readonly actId?: ActYear;
  readonly type: AmendmentType;
  readonly financeActYear: number;
  readonly effectiveFrom: string;
  readonly financeBillClause?: string;
  readonly description: string;
  readonly oldText?: string;
  readonly newText?: string;
  readonly impactAnalysis?: string;
  readonly relatedCircularIds?: string[];
  readonly source?: string;

  constructor(data: Amendment) {
    this.id = data.id;
    this.sectionNumber = data.sectionNumber;
    this.sectionId = data.sectionId;
    this.actYear = data.actYear || data.actId || '1961';
    this.actId = this.actYear;
    this.type = data.type;
    this.financeActYear = data.financeActYear;
    this.effectiveFrom = data.effectiveFrom;
    this.financeBillClause = data.financeBillClause;
    this.description = data.description;
    this.oldText = data.oldText;
    this.newText = data.newText;
    this.impactAnalysis = data.impactAnalysis;
    this.relatedCircularIds = data.relatedCircularIds;
    this.source = data.source;
  }

  get href(): string {
    return `/amendments/${this.id}`;
  }

  get title(): string {
    return `Finance Act ${this.financeActYear}: Amendment to Section ${this.sectionNumber}`;
  }

  toSearchableDocument(): SearchableDocument {
    return {
      id: this.id,
      type: 'amendment',
      datasetId: 'amendments',
      title: this.title,
      sectionNumber: this.sectionNumber,
      searchTokens: [
        ...tokenize(this.title),
        ...tokenize(this.description),
        `section ${this.sectionNumber}`.toLowerCase(),
      ],
      synonymTokens: [`finance act ${this.financeActYear}`.toLowerCase()],
      excerpt: this.description,
      href: this.href,
      tags: ['amendment', `finance-act-${this.financeActYear}`, `sec-${this.sectionNumber}`],
      actId: this.actYear,
    };
  }
}
