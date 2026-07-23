// ─── Local JSON Adapter ───────────────────────────────────────────────────────
//
// Phase 1 implementation — connects DataAdapter interface to Repositories & Services.
// All data is loaded via legalDataLoader from src/data/*.json.

import type { DataAdapter } from './types';
import type {
  ActId,
  Section,
  Circular,
  Notification,
  CaseLaw,
  Amendment,
  SearchQuery,
  SearchResponse,
} from '@/types';
import { legalDataLoader } from '@/lib/data/loader';
import { sectionRepository } from '@/repositories/SectionRepository';
import { caseLawRepository } from '@/repositories/CaseLawRepository';
import { circularRepository } from '@/repositories/CircularRepository';
import { notificationRepository } from '@/repositories/NotificationRepository';
import { amendmentRepository } from '@/repositories/AmendmentRepository';
import { searchService } from '@/lib/search/searchService';

async function ensureDataLoaded() {
  const status = legalDataLoader.getStatus();
  if (!status.loaded) {
    await legalDataLoader.loadAll();
  }
}

export const localAdapter: DataAdapter = {
  async getSections(actId: ActId, query?: string): Promise<Section[]> {
    await ensureDataLoaded();
    const models = await sectionRepository.findByActYear(actId);
    let sections: Section[] = models.map((m) => ({
      id: m.id,
      actYear: m.actYear,
      actId: m.actYear,
      sectionNumber: m.sectionNumber,
      number: m.sectionNumber,
      sectionTitle: m.sectionTitle,
      title: m.sectionTitle,
      chapter: m.chapter,
      chapterId: m.chapter,
      keywords: m.keywords,
      tags: m.keywords,
      synonyms: m.synonyms,
      status: m.status,
      parallelSection: m.parallelSection,
      parallelSectionId: m.parallelSection,
    }));

    if (!query) return sections;
    const q = query.toLowerCase();
    return sections.filter(
      (s) =>
        s.sectionNumber.toLowerCase().includes(q) ||
        s.sectionTitle.toLowerCase().includes(q) ||
        s.keywords.some((t) => t.toLowerCase().includes(q))
    );
  },

  async getSectionById(actId: ActId, sectionId: string): Promise<Section | null> {
    await ensureDataLoaded();
    const model = await sectionRepository.findById(sectionId);
    if (!model || model.actYear !== actId) return null;
    return {
      id: model.id,
      actYear: model.actYear,
      actId: model.actYear,
      sectionNumber: model.sectionNumber,
      number: model.sectionNumber,
      sectionTitle: model.sectionTitle,
      title: model.sectionTitle,
      chapter: model.chapter,
      chapterId: model.chapter,
      keywords: model.keywords,
      tags: model.keywords,
      synonyms: model.synonyms,
      status: model.status,
      parallelSection: model.parallelSection,
      parallelSectionId: model.parallelSection,
    };
  },

  async getSectionByNumber(actId: ActId, number: string): Promise<Section | null> {
    await ensureDataLoaded();
    const model = await sectionRepository.findBySectionNumber(number, actId);
    if (!model) return null;
    return {
      id: model.id,
      actYear: model.actYear,
      actId: model.actYear,
      sectionNumber: model.sectionNumber,
      number: model.sectionNumber,
      sectionTitle: model.sectionTitle,
      title: model.sectionTitle,
      chapter: model.chapter,
      chapterId: model.chapter,
      keywords: model.keywords,
      tags: model.keywords,
      synonyms: model.synonyms,
      status: model.status,
      parallelSection: model.parallelSection,
      parallelSectionId: model.parallelSection,
    };
  },

  async getCirculars(query?: string): Promise<Circular[]> {
    await ensureDataLoaded();
    const models = await circularRepository.findAll();
    let circulars: Circular[] = models.map((m) => ({
      id: m.id,
      circularNumber: m.circularNumber,
      number: m.circularNumber,
      title: m.title,
      issueDate: m.issueDate,
      date: m.issueDate,
      category: m.category,
      type: m.category,
      subject: m.subject,
      relatedSections: m.relatedSections,
      relatedActId: m.relatedActId || '1961',
      pdfUrl: m.pdfUrl,
      url: m.pdfUrl,
      summary: m.summary,
    }));
    if (!query) return circulars;
    const q = query.toLowerCase();
    return circulars.filter(
      (c) =>
        (c.circularNumber || '').toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.subject.toLowerCase().includes(q)
    );
  },

  async getCircularById(id: string): Promise<Circular | null> {
    await ensureDataLoaded();
    const model = await circularRepository.findById(id);
    if (!model) return null;
    return {
      id: model.id,
      circularNumber: model.circularNumber,
      number: model.circularNumber,
      title: model.title,
      issueDate: model.issueDate,
      date: model.issueDate,
      category: model.category,
      type: model.category,
      subject: model.subject,
      relatedSections: model.relatedSections,
      relatedActId: model.relatedActId || '1961',
      pdfUrl: model.pdfUrl,
      url: model.pdfUrl,
      summary: model.summary,
    };
  },

  async getNotifications(query?: string): Promise<Notification[]> {
    await ensureDataLoaded();
    const items = await notificationRepository.findAll();
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter(
      (n) =>
        (n.notificationNumber || n.number || '').toLowerCase().includes(q) ||
        n.title.toLowerCase().includes(q)
    );
  },

  async getNotificationById(id: string): Promise<Notification | null> {
    await ensureDataLoaded();
    return notificationRepository.findById(id);
  },

  async getCaseLaws(query?: string): Promise<CaseLaw[]> {
    await ensureDataLoaded();
    const models = await caseLawRepository.findAll();
    let caseLaws: CaseLaw[] = models.map((m) => ({
      id: m.id,
      title: m.title,
      citation: m.citation,
      court: m.court,
      bench: m.bench,
      year: m.year,
      relatedSections: m.relatedSections,
      relatedActId: m.relatedActId || '1961',
      headnote: m.headnote,
      summary: m.summary,
      url: m.url,
      tags: m.tags,
      isFavorable: m.isFavorable,
    }));
    if (!query) return caseLaws;
    const q = query.toLowerCase();
    return caseLaws.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.citation.toLowerCase().includes(q) ||
        c.headnote.toLowerCase().includes(q)
    );
  },

  async getCaseLawById(id: string): Promise<CaseLaw | null> {
    await ensureDataLoaded();
    const model = await caseLawRepository.findById(id);
    if (!model) return null;
    return {
      id: model.id,
      title: model.title,
      citation: model.citation,
      court: model.court,
      bench: model.bench,
      year: model.year,
      relatedSections: model.relatedSections,
      relatedActId: model.relatedActId || '1961',
      headnote: model.headnote,
      summary: model.summary,
      url: model.url,
      tags: model.tags,
      isFavorable: model.isFavorable,
    };
  },

  async getCaseLawsBySection(sectionNumber: string): Promise<CaseLaw[]> {
    await ensureDataLoaded();
    const models = await caseLawRepository.findBySection(sectionNumber);
    return models.map((m) => ({
      id: m.id,
      title: m.title,
      citation: m.citation,
      court: m.court,
      bench: m.bench,
      year: m.year,
      relatedSections: m.relatedSections,
      relatedActId: m.relatedActId || '1961',
      headnote: m.headnote,
      summary: m.summary,
      url: m.url,
      tags: m.tags,
      isFavorable: m.isFavorable,
    }));
  },

  async getAmendments(sectionId?: string): Promise<Amendment[]> {
    await ensureDataLoaded();
    const models = await amendmentRepository.findAll();
    let amendments: Amendment[] = models.map((m) => ({
      id: m.id,
      sectionNumber: m.sectionNumber,
      sectionId: m.sectionId || m.sectionNumber,
      actYear: m.actYear,
      actId: m.actYear,
      type: m.type,
      financeActYear: m.financeActYear,
      effectiveFrom: m.effectiveFrom,
      description: m.description,
      oldText: m.oldText,
      newText: m.newText,
    }));
    if (!sectionId) return amendments;
    return amendments.filter((a) => a.sectionId === sectionId || a.sectionNumber === sectionId);
  },

  async getAmendmentById(id: string): Promise<Amendment | null> {
    await ensureDataLoaded();
    const model = await amendmentRepository.findById(id);
    if (!model) return null;
    return {
      id: model.id,
      sectionNumber: model.sectionNumber,
      sectionId: model.sectionId || model.sectionNumber,
      actYear: model.actYear,
      actId: model.actYear,
      type: model.type,
      financeActYear: model.financeActYear,
      effectiveFrom: model.effectiveFrom,
      description: model.description,
      oldText: model.oldText,
      newText: model.newText,
    };
  },

  async search(query: SearchQuery): Promise<SearchResponse> {
    await ensureDataLoaded();
    return searchService.search(query);
  },
};
