// ─── Central Knowledge Service ──────────────────────────────────────────────────
//
// Central orchestrator that:
//   1. Loads all legal datasets
//   2. Resolves relationships between entities (Section ↔ Mapping ↔ Case Laws ↔ Circulars ↔ FAQs ↔ Study Notes)
//   3. Provides fast lookups by Section Number and Keyword

import type {
  ActYear,
  Section,
  SectionKnowledgeGraph,
  KnowledgeLookupOptions,
  FAQ,
  StudyNote,
  CaseLaw,
  Circular,
  Notification,
  Amendment,
} from '@/types/legal';

import { legalDataLoader } from '@/lib/data/loader';
import { sectionRepository } from '@/repositories/SectionRepository';
import { caseLawRepository } from '@/repositories/CaseLawRepository';
import { circularRepository } from '@/repositories/CircularRepository';
import { notificationRepository } from '@/repositories/NotificationRepository';
import { amendmentRepository } from '@/repositories/AmendmentRepository';
import { faqRepository } from '@/repositories/FaqRepository';
import { studyNoteRepository } from '@/repositories/StudyNoteRepository';

export class KnowledgeService {
  /**
   * Ensure data is initialized before performing lookups
   */
  private async ensureInitialized(): Promise<void> {
    const status = legalDataLoader.getStatus();
    if (!status.loaded) {
      await legalDataLoader.loadAll();
    }
  }

  /**
   * Resolve full Relationship Graph for a Section
   */
  async getSectionKnowledgeGraph(
    sectionNumber: string,
    actYear: ActYear = '1961'
  ): Promise<SectionKnowledgeGraph> {
    await this.ensureInitialized();

    // 1. Fetch Primary Section Model
    const sectionModel = await sectionRepository.findBySectionNumber(sectionNumber, actYear);
    const section: Section | null = sectionModel ? sectionModel : null;

    // 2. Resolve Parallel Section (1961 ↔ 2025)
    let parallelSection: Section | null = null;
    if (sectionModel) {
      const parallelModel = await sectionRepository.findParallelSection(sectionNumber, actYear);
      parallelSection = parallelModel ? parallelModel : null;
    }

    // 3. Resolve Related Entities via Repository Section Lookups
    const caseLaws: CaseLaw[] = await caseLawRepository.findBySection(sectionNumber);
    const circulars: Circular[] = await circularRepository.findBySection(sectionNumber);
    const notifications: Notification[] = await notificationRepository.findBySection(sectionNumber);
    const amendments: Amendment[] = await amendmentRepository.findBySection(sectionNumber);
    const faqs: FAQ[] = await faqRepository.findBySection(sectionNumber);
    const studyNotes: StudyNote[] = await studyNoteRepository.findBySection(sectionNumber);

    // Placeholders for future dataset fields — remain empty until data is provided
    const placeholders = {
      studentExplanationPlaceholder: undefined,
      practicalExamplePlaceholder: undefined,
      revisionNotePlaceholder: undefined,
      aiExplanationPlaceholder: undefined,
    };

    return {
      section,
      parallelSection,
      mapping: null,
      amendments,
      circulars,
      notifications,
      caseLaws,
      faqs,
      studyNotes,
      placeholders,
    };
  }

  /**
   * Fast keyword lookup across unified knowledge entities
   */
  async searchKnowledgeByKeyword(options: KnowledgeLookupOptions): Promise<{
    sections: Section[];
    caseLaws: CaseLaw[];
    circulars: Circular[];
    faqs: FAQ[];
    studyNotes: StudyNote[];
  }> {
    await this.ensureInitialized();
    const keyword = options.keyword || options.sectionNumber || '';
    if (!keyword.trim()) {
      return { sections: [], caseLaws: [], circulars: [], faqs: [], studyNotes: [] };
    }

    const q = keyword.toLowerCase();

    // Fast lookups across repositories
    const sections = (await sectionRepository.findAll()).filter(
      (s) =>
        s.sectionNumber.toLowerCase().includes(q) ||
        s.sectionTitle.toLowerCase().includes(q) ||
        s.keywords.some((k) => k.toLowerCase().includes(q))
    );

    const caseLaws = await caseLawRepository.findBySection(keyword);
    const circulars = await circularRepository.findBySection(keyword);
    const faqs = await faqRepository.findByKeyword(keyword);
    const studyNotes = await studyNoteRepository.findByKeyword(keyword);

    return {
      sections,
      caseLaws,
      circulars,
      faqs,
      studyNotes,
    };
  }
}

export const knowledgeService = new KnowledgeService();
