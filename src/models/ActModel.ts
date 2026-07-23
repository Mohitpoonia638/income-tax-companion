// ─── Act Model Class ───────────────────────────────────────────────────────────

import type { Act, ActYear } from '@/types/legal';

export class ActModel implements Act {
  readonly id: string;
  readonly actYear: ActYear;
  readonly title: string;
  readonly shortTitle: string;
  readonly enactmentDate?: string;
  readonly effectiveDate?: string;
  readonly totalChapters?: number;
  readonly totalSections?: number;
  readonly description: string;
  readonly color: 'blue' | 'violet';
  readonly lastUpdated?: string;
  readonly source?: string;

  constructor(data: Act) {
    this.id = data.id;
    this.actYear = data.actYear;
    this.title = data.title;
    this.shortTitle = data.shortTitle;
    this.enactmentDate = data.enactmentDate;
    this.effectiveDate = data.effectiveDate;
    this.totalChapters = data.totalChapters;
    this.totalSections = data.totalSections;
    this.description = data.description;
    this.color = data.color;
    this.lastUpdated = data.lastUpdated;
    this.source = data.source;
  }

  get is1961(): boolean {
    return this.actYear === '1961';
  }

  get is2025(): boolean {
    return this.actYear === '2025';
  }

  get badgeLabel(): string {
    return `ITA ${this.actYear}`;
  }
}
