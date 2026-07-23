// ─── Section Service ───────────────────────────────────────────────────────────

import type { ActYear, Section } from '@/types/legal';
import type { SearchableDocument } from '@/types/search';
import { SectionModel } from '@/models/SectionModel';
import { sectionRepository, SectionRepository } from '@/repositories/SectionRepository';
import { tokenize } from '@/lib/search/normalizer';

export class SectionService {
  constructor(private repo: SectionRepository = sectionRepository) {}

  async getSectionByNumber(secNum: string, actYear?: ActYear): Promise<SectionModel | null> {
    return this.repo.findBySectionNumber(secNum, actYear);
  }

  async getSectionsByAct(actYear: ActYear): Promise<SectionModel[]> {
    return this.repo.findByActYear(actYear);
  }

  async getSectionsByChapter(chapter: string, actYear?: ActYear): Promise<SectionModel[]> {
    return this.repo.findByChapter(chapter, actYear);
  }

  async getParallelSection(secNum: string, currentActYear: ActYear): Promise<SectionModel | null> {
    return this.repo.findParallelSection(secNum, currentActYear);
  }

  async getAllSections(): Promise<SectionModel[]> {
    return this.repo.findAll();
  }

  /**
   * Convert any Section or SectionModel into SearchableDocument for M2 Search Engine
   */
  toSearchableDocument(section: Section): SearchableDocument {
    const model = section instanceof SectionModel ? section : new SectionModel(section);
    return model.toSearchableDocument();
  }

  /**
   * Convert a list of sections into SearchableDocuments
   */
  toSearchableDocuments(sections: Section[]): SearchableDocument[] {
    return sections.map((s) => this.toSearchableDocument(s));
  }
}

export const sectionService = new SectionService();
