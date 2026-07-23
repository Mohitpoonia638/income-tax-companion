// ─── Search Index Interface ───────────────────────────────────────────────────

import type { SearchDatasetId, SearchResultType } from '../search';

export interface SearchIndexEntry {
  id: string;
  type: SearchResultType;
  datasetId: SearchDatasetId;
  title: string;
  sectionNumber?: string;
  chapterId?: string;
  tags: string[];
  searchTokens: string[];
  synonymTokens: string[];
  excerpt: string;
  actId?: string;
  href: string;
}

export interface SearchIndexMetadata {
  version: string;
  generatedAt: string;
  totalDocuments: number;
  datasetsIndexed: SearchDatasetId[];
}

export interface SearchIndex {
  metadata: SearchIndexMetadata;
  entries: SearchIndexEntry[];
}
