// ─── Citation Manager ─────────────────────────────────────────────────────────

import type { Citation, Section } from '@/types/legal';

export class CitationManager {
  /**
   * Generate canonical citation for a section
   */
  createSectionCitation(sectionNumber: string, actYear: string): Citation {
    return {
      id: `cite-sec-${actYear}-${sectionNumber.toLowerCase()}`,
      sourceType: 'Act',
      title: `Section ${sectionNumber}, Income Tax Act, ${actYear}`,
      referenceNumber: `Section ${sectionNumber}`,
      year: actYear,
      publisher: 'Central Board of Direct Taxes (CBDT)',
    };
  }

  /**
   * Generate citation for a CBDT Circular
   */
  createCircularCitation(circularNumber: string, title: string, year?: string): Citation {
    return {
      id: `cite-circ-${circularNumber.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      sourceType: 'CBDT Circular',
      title: `CBDT Circular No. ${circularNumber}: ${title}`,
      referenceNumber: circularNumber,
      year: year || 'CBDT',
      publisher: 'Central Board of Direct Taxes',
    };
  }

  /**
   * Format citation list as Markdown / Plain text references
   */
  formatCitations(citations: Citation[]): string[] {
    return citations.map((c) => {
      let text = `[${c.sourceType}] ${c.title}`;
      if (c.referenceNumber) text += ` (${c.referenceNumber})`;
      if (c.publisher) text += ` — ${c.publisher}`;
      return text;
    });
  }
}

export const citationManager = new CitationManager();
