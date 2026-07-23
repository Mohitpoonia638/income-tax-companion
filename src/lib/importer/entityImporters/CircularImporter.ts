// ─── Circular Importer ─────────────────────────────────────────────────────────

import type { Circular } from '@/types/legal';
import type { ImportErrorRecord } from '../importTypes';
import { circularRepository } from '@/repositories/CircularRepository';

export interface CircularImportResult {
  validItems: Circular[];
  errors: ImportErrorRecord[];
}

export function importCirculars(
  records: Record<string, unknown>[]
): CircularImportResult {
  const validItems: Circular[] = [];
  const errors: ImportErrorRecord[] = [];

  records.forEach((raw, index) => {
    const id = String(raw.id || `circ-${index}`).trim();
    const circularNumber = String(raw.circularNumber || raw.number || '').trim();
    const title = String(raw.title || '').trim();
    const issueDate = String(raw.issueDate || raw.date || '').trim();
    const category = (raw.category || raw.type || 'Circular') as Circular['category'];
    const subject = String(raw.subject || title).trim();

    if (!circularNumber || !title) {
      errors.push({
        index,
        recordId: id,
        reason: 'Missing circularNumber or title',
        rawRecord: raw,
      });
      return;
    }

    const circular: Circular = {
      id,
      circularNumber,
      number: circularNumber,
      title,
      issueDate,
      date: issueDate,
      category,
      type: category,
      subject,
      relatedSections: Array.isArray(raw.relatedSections) ? (raw.relatedSections as string[]) : [],
      pdfUrl: String(raw.pdfUrl || raw.url || ''),
      summary: String(raw.summary || ''),
    };

    validItems.push(circular);
  });

  if (validItems.length > 0) {
    circularRepository.loadCircularModels(validItems);
  }

  return { validItems, errors };
}
