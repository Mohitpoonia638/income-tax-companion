// ─── Act Section Importer ───────────────────────────────────────────────────────

import type { Section, ActYear } from '@/types/legal';
import type { ImportErrorRecord } from '../importTypes';
import { validateSectionSchema } from '@/lib/data/validator';
import { sectionRepository } from '@/repositories/SectionRepository';
import { generateSectionId } from '@/lib/data/helpers';

export interface ImportResult<T> {
  validItems: T[];
  errors: ImportErrorRecord[];
}

export function importActSections(
  records: Record<string, unknown>[],
  targetActYear: ActYear
): ImportResult<Section> {
  const validItems: Section[] = [];
  const errors: ImportErrorRecord[] = [];

  records.forEach((raw, index) => {
    const sectionNumber = String(raw.sectionNumber || raw.number || raw.secNum || '').trim();
    const sectionTitle = String(raw.sectionTitle || raw.title || '').trim();
    const chapter = String(raw.chapter || raw.chapterId || 'Chapter VI-A').trim();
    const id = String(raw.id || (sectionNumber ? generateSectionId(targetActYear, sectionNumber) : '')).trim();

    const candidate: Partial<Section> = {
      id,
      actYear: targetActYear,
      sectionNumber,
      sectionTitle,
      chapter,
      keywords: Array.isArray(raw.keywords) ? (raw.keywords as string[]) : Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
      synonyms: Array.isArray(raw.synonyms) ? (raw.synonyms as string[]) : [],
      status: (raw.status as Section['status']) || 'active',
      simpleMeaning: String(raw.simpleMeaning || raw.summary || ''),
      detailedMeaning: String(raw.detailedMeaning || raw.description || ''),
      bareAct: (raw.bareAct as Section['bareAct']) || String(raw.rawBareAct || ''),
      parallelSection: String(raw.parallelSection || raw.parallelSectionId || ''),
    };

    const validation = validateSectionSchema(candidate);

    if (validation.isValid) {
      validItems.push(candidate as Section);
    } else {
      errors.push({
        index,
        recordId: id || undefined,
        reason: validation.errors.join('; '),
        rawRecord: raw,
      });
    }
  });

  if (validItems.length > 0) {
    sectionRepository.loadSectionModels(validItems);
  }

  return { validItems, errors };
}
