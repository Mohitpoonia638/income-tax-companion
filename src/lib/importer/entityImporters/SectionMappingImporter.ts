// ─── Section Mapping Importer ───────────────────────────────────────────────────

import type { SectionMapping } from '@/types/legal';
import type { ImportErrorRecord } from '../importTypes';

export interface SectionMappingImportResult {
  validItems: SectionMapping[];
  errors: ImportErrorRecord[];
}

export function importSectionMappings(
  records: Record<string, unknown>[]
): SectionMappingImportResult {
  const validItems: SectionMapping[] = [];
  const errors: ImportErrorRecord[] = [];

  records.forEach((raw, index) => {
    const sec1961 = String(raw.section1961 || raw.sec1961 || '').trim();
    const sec2025 = String(raw.section2025 || raw.sec2025 || '').trim();
    const id = String(raw.id || `map-${sec1961}-${sec2025}`).trim();

    if (!sec1961 || !sec2025) {
      errors.push({
        index,
        recordId: id,
        reason: 'Missing section1961 or section2025 reference',
        rawRecord: raw,
      });
      return;
    }

    const mapping: SectionMapping = {
      id,
      section1961: sec1961,
      section2025: sec2025,
      title1961: String(raw.title1961 || ''),
      title2025: String(raw.title2025 || ''),
      mappingType: (raw.mappingType as SectionMapping['mappingType']) || 'direct',
      changeSummary: String(raw.changeSummary || raw.description || ''),
    };

    validItems.push(mapping);
  });

  return { validItems, errors };
}
