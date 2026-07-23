// ─── Case Law Importer ─────────────────────────────────────────────────────────

import type { CaseLaw } from '@/types/legal';
import type { ImportErrorRecord } from '../importTypes';
import { validateCaseLawSchema } from '@/lib/data/validator';
import { caseLawRepository } from '@/repositories/CaseLawRepository';

export interface CaseLawImportResult {
  validItems: CaseLaw[];
  errors: ImportErrorRecord[];
}

export function importCaseLaws(
  records: Record<string, unknown>[]
): CaseLawImportResult {
  const validItems: CaseLaw[] = [];
  const errors: ImportErrorRecord[] = [];

  records.forEach((raw, index) => {
    const id = String(raw.id || `case-${Date.now()}-${index}`).trim();
    const title = String(raw.title || raw.caseName || '').trim();
    const citation = String(raw.citation || '').trim();
    const court = (raw.court as CaseLaw['court']) || 'Supreme Court';

    const candidate: Partial<CaseLaw> = {
      id,
      title,
      citation,
      court,
      bench: String(raw.bench || raw.highCourtBench || ''),
      year: Number(raw.year) || new Date().getFullYear(),
      relatedSections: Array.isArray(raw.relatedSections) ? (raw.relatedSections as string[]) : [],
      headnote: String(raw.headnote || raw.summary || ''),
      summary: String(raw.summary || ''),
      tags: Array.isArray(raw.tags) ? (raw.tags as string[]) : [],
      isFavorable: Boolean(raw.isFavorable),
    };

    const validation = validateCaseLawSchema(candidate);

    if (validation.isValid) {
      validItems.push(candidate as CaseLaw);
    } else {
      errors.push({
        index,
        recordId: id,
        reason: validation.errors.join('; '),
        rawRecord: raw,
      });
    }
  });

  if (validItems.length > 0) {
    caseLawRepository.loadCaseLawModels(validItems);
  }

  return { validItems, errors };
}
