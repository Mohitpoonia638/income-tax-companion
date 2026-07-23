// ─── Section Repository ────────────────────────────────────────────────────────

import type { ActYear } from '@/types/legal';
import { InMemoryRepository } from './base/InMemoryRepository';
import { SectionModel } from '@/models/SectionModel';

export class SectionRepository extends InMemoryRepository<SectionModel> {
  async findBySectionNumber(sectionNumber: string, actYear?: ActYear): Promise<SectionModel | null> {
    const norm = sectionNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    const all = await this.findAll();
    return (
      all.find((s) => {
        const secNorm = s.sectionNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (actYear && s.actYear !== actYear) return false;
        return secNorm === norm;
      }) || null
    );
  }

  async findByActYear(actYear: ActYear): Promise<SectionModel[]> {
    return this.findWhere((s) => s.actYear === actYear);
  }

  async findByChapter(chapter: string, actYear?: ActYear): Promise<SectionModel[]> {
    return this.findWhere((s) => {
      if (actYear && s.actYear !== actYear) return false;
      return s.chapter.toLowerCase() === chapter.toLowerCase();
    });
  }

  async findParallelSection(sectionNumber: string, currentActYear: ActYear): Promise<SectionModel | null> {
    const section = await this.findBySectionNumber(sectionNumber, currentActYear);
    if (!section || !section.parallelSection) return null;
    const targetActYear: ActYear = currentActYear === '1961' ? '2025' : '1961';
    return this.findBySectionNumber(section.parallelSection, targetActYear);
  }

  loadSectionModels(sections: Array<ConstructorParameters<typeof SectionModel>[0]>): void {
    const models = sections.map((s) => new SectionModel(s));
    this.loadAll(models);
  }
}

export const sectionRepository = new SectionRepository();
