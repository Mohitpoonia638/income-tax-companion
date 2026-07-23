// ─── Dataset Import Module Types ────────────────────────────────────────────────

export type ImportFormat = 'json' | 'csv';

export type EntityType =
  | 'sections-1961'
  | 'sections-2025'
  | 'section-mappings'
  | 'case-laws'
  | 'circulars'
  | 'notifications';

export interface ImportErrorRecord {
  index: number;
  recordId?: string;
  reason: string;
  rawRecord?: Record<string, unknown>;
}

export interface ImportStats {
  entityType: EntityType;
  format: ImportFormat;
  totalRecords: number;
  validRecords: number;
  rejectedRecords: number;
  errors: ImportErrorRecord[];
  indexedDocumentsCount: number;
  durationMs: number;
}
