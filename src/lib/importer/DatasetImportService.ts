// ─── Dataset Import Service ───────────────────────────────────────────────────
//
// Unified importer service that:
//   1. Parses raw JSON or CSV inputs
//   2. Validates records per entity type
//   3. Rejects invalid records and collects statistics
//   4. Loads valid records into Repositories
//   5. Automatically triggers search re-indexing via searchIndexService

import type { ImportFormat, EntityType, ImportStats, ImportErrorRecord } from './importTypes';
import { parseJsonContent } from './jsonParser';
import { parseCsvContent } from './csvParser';

import { importActSections } from './entityImporters/ActSectionImporter';
import { importSectionMappings } from './entityImporters/SectionMappingImporter';
import { importCaseLaws } from './entityImporters/CaseLawImporter';
import { importCirculars } from './entityImporters/CircularImporter';
import { importNotifications } from './entityImporters/NotificationImporter';

import { searchIndexService } from '@/services/SearchIndexService';
import { searchService } from '@/lib/search/searchService';

export class DatasetImportService {
  /**
   * Main dataset import method
   */
  async importDataset(
    format: ImportFormat,
    entityType: EntityType,
    rawContent: string | unknown
  ): Promise<ImportStats> {
    const startMs = Date.now();

    // 1. Parse content based on format
    const records =
      format === 'csv'
        ? parseCsvContent(typeof rawContent === 'string' ? rawContent : '')
        : parseJsonContent(rawContent);

    const totalRecords = records.length;
    let validRecords = 0;
    let rejectedRecords = 0;
    let errors: ImportErrorRecord[] = [];

    // 2. Delegate to Entity Importer
    switch (entityType) {
      case 'sections-1961': {
        const res = importActSections(records, '1961');
        validRecords = res.validItems.length;
        errors = res.errors;
        break;
      }
      case 'sections-2025': {
        const res = importActSections(records, '2025');
        validRecords = res.validItems.length;
        errors = res.errors;
        break;
      }
      case 'section-mappings': {
        const res = importSectionMappings(records);
        validRecords = res.validItems.length;
        errors = res.errors;
        break;
      }
      case 'case-laws': {
        const res = importCaseLaws(records);
        validRecords = res.validItems.length;
        errors = res.errors;
        break;
      }
      case 'circulars': {
        const res = importCirculars(records);
        validRecords = res.validItems.length;
        errors = res.errors;
        break;
      }
      case 'notifications': {
        const res = importNotifications(records);
        validRecords = res.validItems.length;
        errors = res.errors;
        break;
      }
    }

    rejectedRecords = errors.length;

    // 3. Auto Search Indexing Trigger
    if (validRecords > 0) {
      await searchIndexService.indexAllRepositories();
    }

    return {
      entityType,
      format,
      totalRecords,
      validRecords,
      rejectedRecords,
      errors,
      indexedDocumentsCount: searchService.totalDocuments,
      durationMs: Date.now() - startMs,
    };
  }
}

export const datasetImportService = new DatasetImportService();
