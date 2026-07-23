// ─── FAQ Repository ────────────────────────────────────────────────────────────

import type { FAQ } from '@/types/legal';
import { InMemoryRepository } from './base/InMemoryRepository';

export class FaqRepository extends InMemoryRepository<FAQ> {
  async findBySection(sectionNumber: string): Promise<FAQ[]> {
    const norm = sectionNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.findWhere((faq) =>
      faq.relatedSections.some((s) => s.toLowerCase().replace(/[^a-z0-9]/g, '') === norm)
    );
  }

  async findByKeyword(keyword: string): Promise<FAQ[]> {
    const q = keyword.toLowerCase();
    return this.findWhere(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.tags?.some((t) => t.toLowerCase().includes(q)) || false
    );
  }
}

export const faqRepository = new FaqRepository();
