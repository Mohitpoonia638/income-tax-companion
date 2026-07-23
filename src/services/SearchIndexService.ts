// ─── Search Index Service ──────────────────────────────────────────────────────
//
// Automatically bridges all legal dataset repositories with the M2 Search Engine.
// Any dataset registered here automatically becomes indexed & searchable.

import type { SearchableDocument, SearchDatasetId } from '@/types/search';
import { searchService } from '@/lib/search/searchService';
import { sectionRepository } from '@/repositories/SectionRepository';
import { caseLawRepository } from '@/repositories/CaseLawRepository';
import { amendmentRepository } from '@/repositories/AmendmentRepository';
import { circularRepository } from '@/repositories/CircularRepository';
import { faqRepository } from '@/repositories/FaqRepository';
import { studyNoteRepository } from '@/repositories/StudyNoteRepository';
import { tokenize } from '@/lib/search/normalizer';

export class SearchIndexService {
  /**
   * Registers a list of SearchableDocument directly with the M2 searchService
   */
  async registerDataset(datasetId: SearchDatasetId, docs: SearchableDocument[]): Promise<void> {
    searchService.registerDataset(datasetId, docs);
  }

  /**
   * Auto-indexes all currently loaded repositories into the M2 searchService
   */
  async indexAllRepositories(): Promise<void> {
    // 1. Sections 1961
    const sections1961 = await sectionRepository.findByActYear('1961');
    if (sections1961.length > 0) {
      const docs = sections1961.map((s) => s.toSearchableDocument());
      searchService.registerDataset('sections-1961', docs);
    }

    // 2. Sections 2025
    const sections2025 = await sectionRepository.findByActYear('2025');
    if (sections2025.length > 0) {
      const docs = sections2025.map((s) => s.toSearchableDocument());
      searchService.registerDataset('sections-2025', docs);
    }

    // 3. Case Laws
    const caseLaws = await caseLawRepository.findAll();
    if (caseLaws.length > 0) {
      const docs = caseLaws.map((c) => c.toSearchableDocument());
      searchService.registerDataset('caseLaws', docs);
    }

    // 4. Amendments
    const amendments = await amendmentRepository.findAll();
    if (amendments.length > 0) {
      const docs = amendments.map((a) => a.toSearchableDocument());
      searchService.registerDataset('amendments', docs);
    }

    // 5. Circulars
    const circulars = await circularRepository.findAll();
    if (circulars.length > 0) {
      const docs = circulars.map((c) => c.toSearchableDocument());
      searchService.registerDataset('circulars', docs);
    }

    // 6. FAQs
    const faqs = await faqRepository.findAll();
    if (faqs.length > 0) {
      const docs: SearchableDocument[] = faqs.map((f) => ({
        id: f.id,
        type: 'circular',
        datasetId: 'circulars',
        title: f.question,
        searchTokens: [...tokenize(f.question), ...tokenize(f.answer)],
        synonymTokens: f.tags || [],
        excerpt: f.answer,
        href: `/search?q=${encodeURIComponent(f.question)}`,
        tags: f.tags || [],
      }));
      searchService.registerDataset('circulars', docs);
    }

    // 7. Study Notes
    const studyNotes = await studyNoteRepository.findAll();
    if (studyNotes.length > 0) {
      const docs: SearchableDocument[] = studyNotes.map((sn) => ({
        id: sn.id,
        type: 'section',
        datasetId: 'sections-1961',
        title: sn.title,
        sectionNumber: sn.sectionNumber,
        searchTokens: [...tokenize(sn.title), ...tokenize(sn.summary)],
        synonymTokens: sn.keyConcepts || [],
        excerpt: sn.summary,
        href: sn.sectionNumber ? `/acts/1961/${sn.sectionNumber.toLowerCase()}` : '/search',
        tags: sn.tags || [],
      }));
      searchService.registerDataset('sections-1961', docs);
    }
  }
}

export const searchIndexService = new SearchIndexService();
