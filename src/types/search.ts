// ─── Search Types ──────────────────────────────────────────────────────────────

import type { ActId } from './acts';

// ── Dataset Identifiers ────────────────────────────────────────────────────────
// Every future content source gets a unique dataset ID.
// Add new datasets here — the engine and service handle them automatically.

export type SearchDatasetId =
  | 'sections-1961'
  | 'sections-2025'
  | 'circulars'
  | 'notifications'
  | 'caseLaws'
  | 'amendments'
  | 'rules'
  | 'forms'
  | 'finance-act';

// ── Result Type ────────────────────────────────────────────────────────────────

export type SearchResultType =
  | 'section'
  | 'circular'
  | 'notification'
  | 'caseLaw'
  | 'amendment'
  | 'rule'
  | 'form'
  | 'financeAct';

// ── Search Status ──────────────────────────────────────────────────────────────

export type SearchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

// ── Suggestion Types ───────────────────────────────────────────────────────────

export type SuggestionType = 'autocomplete' | 'section' | 'topic' | 'synonym';

export interface Suggestion {
  id: string;
  text: string;
  type: SuggestionType;
  sectionNumber?: string;
  datasetId?: SearchDatasetId;
}

export interface PopularSearch {
  id: string;
  query: string;
  label: string;
  category: 'deduction' | 'section' | 'head' | 'penalty' | 'tds' | 'exemption' | 'appeal' | 'misc';
}

// ── Searchable Document ─────────────────────────────────────────────────────────
// The normalized internal format every dataset gets converted into.
// This is what the SearchEngine indexes — never displayed directly.

export interface SearchableDocument {
  id: string;
  type: SearchResultType;
  datasetId: SearchDatasetId;
  // Searchable fields
  title: string;
  sectionNumber?: string;   // e.g. "80C", "194Q"
  chapterId?: string;        // e.g. "VI-A"
  tags: string[];
  searchTokens: string[];    // pre-computed, normalized tokens
  synonymTokens: string[];   // additional synonym tokens
  // Display fields (pass-through to SearchResult)
  subtitle?: string;
  excerpt: string;           // short plain-text description (≤ 200 chars)
  actId?: string;
  href: string;              // navigation URL
}

// ── Filter ─────────────────────────────────────────────────────────────────────

export interface SearchFilter {
  actIds?: ActId[];
  datasetIds?: SearchDatasetId[];
  types?: SearchResultType[];
  tags?: string[];
  yearFrom?: number;
  yearTo?: number;
}

// ── Query ──────────────────────────────────────────────────────────────────────

export interface SearchQuery {
  query: string;
  filters?: SearchFilter;
  page?: number;
  pageSize?: number;
}

// ── Result ─────────────────────────────────────────────────────────────────────

export interface SearchResult {
  id: string;
  type: SearchResultType;
  datasetId: SearchDatasetId;
  title: string;             // may contain <mark> tags for highlighting
  subtitle?: string;
  excerpt: string;           // may contain <mark> tags
  actId?: ActId;
  sectionNumber?: string;
  tags: string[];
  href: string;
  relevanceScore: number;    // 0–100, for sort ranking
}

// ── Response ───────────────────────────────────────────────────────────────────

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
  query: string;
  durationMs?: number;
}

// ── Dataset Config ─────────────────────────────────────────────────────────────

export interface DatasetConfig {
  id: SearchDatasetId;
  label: string;
  shortLabel: string;
  enabled: boolean;
  color: 'blue' | 'violet' | 'sky' | 'rose' | 'amber' | 'emerald';
  description: string;
}
