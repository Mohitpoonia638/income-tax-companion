// ─── Search Service ────────────────────────────────────────────────────────────
//
// High-level singleton facade over SearchEngine instances.
//
// Responsibilities:
//   1. Maintain one SearchEngine per dataset
//   2. Load dataset documents via the data adapter
//   3. Merge and rank results across all enabled datasets
//   4. Provide suggest() and getPopularSearches()
//
// Usage:
//   import { searchService } from '@/lib/search';
//   const results = await searchService.search({ query: '80C' });

import { SearchEngine } from './engine';
import { POPULAR_SEARCHES } from './popularSearches';
import { normalizeQuery } from './normalizer';
import type {
  SearchableDocument,
  SearchDatasetId,
  SearchQuery,
  SearchResponse,
  SearchResult,
  Suggestion,
  PopularSearch,
  DatasetConfig,
} from '@/types/search';

// ── Dataset Registry ──────────────────────────────────────────────────────────
// Defines ALL supported datasets. enabled=false means it exists but has no data yet.

export const SEARCH_DATASETS: DatasetConfig[] = [
  {
    id: 'sections-1961',
    label: 'Income Tax Act 1961',
    shortLabel: 'ITA 1961',
    enabled: true,    // enabled but empty until data is loaded
    color: 'blue',
    description: 'Sections of the Income Tax Act, 1961',
  },
  {
    id: 'sections-2025',
    label: 'Income Tax Act 2025',
    shortLabel: 'ITA 2025',
    enabled: true,
    color: 'violet',
    description: 'Sections of the Income Tax Act, 2025',
  },
  {
    id: 'circulars',
    label: 'CBDT Circulars',
    shortLabel: 'Circulars',
    enabled: false,
    color: 'sky',
    description: 'Circulars issued by CBDT',
  },
  {
    id: 'notifications',
    label: 'CBDT Notifications',
    shortLabel: 'Notifications',
    enabled: false,
    color: 'sky',
    description: 'Notifications issued by CBDT',
  },
  {
    id: 'caseLaws',
    label: 'Case Laws',
    shortLabel: 'Case Laws',
    enabled: false,
    color: 'rose',
    description: 'Supreme Court and High Court judgments',
  },
  {
    id: 'amendments',
    label: 'Amendments',
    shortLabel: 'Amendments',
    enabled: false,
    color: 'amber',
    description: 'Finance Act amendments to Income Tax Act',
  },
  {
    id: 'rules',
    label: 'Income Tax Rules',
    shortLabel: 'Rules',
    enabled: false,
    color: 'emerald',
    description: 'Income Tax Rules, 1962',
  },
  {
    id: 'forms',
    label: 'ITR Forms',
    shortLabel: 'Forms',
    enabled: false,
    color: 'emerald',
    description: 'Income Tax Return Forms',
  },
  {
    id: 'finance-act',
    label: 'Finance Acts',
    shortLabel: 'Finance Act',
    enabled: false,
    color: 'violet',
    description: 'Annual Finance Acts',
  },
];

// ── SearchService ─────────────────────────────────────────────────────────────

class SearchService {
  private engines = new Map<SearchDatasetId, SearchEngine>();
  private initialized = new Set<SearchDatasetId>();

  /**
   * Register a dataset with the service and build its index.
   * Call this once per dataset when data becomes available.
   */
  registerDataset(datasetId: SearchDatasetId, docs: SearchableDocument[]): void {
    const engine = new SearchEngine();
    engine.buildIndex(docs);
    this.engines.set(datasetId, engine);
    this.initialized.add(datasetId);
  }

  /**
   * Perform a search across all enabled, initialized datasets.
   * Results are merged and sorted by relevanceScore descending.
   */
  async search(query: SearchQuery): Promise<SearchResponse> {
    const startMs = Date.now();
    const allResults: SearchResult[] = [];

    const enabledDatasets = SEARCH_DATASETS
      .filter((d) => d.enabled)
      .map((d) => d.id);

    // Apply dataset filter if specified
    const datasetsToSearch = query.filters?.datasetIds?.length
      ? enabledDatasets.filter((id) => query.filters!.datasetIds!.includes(id))
      : enabledDatasets;

    for (const datasetId of datasetsToSearch) {
      const engine = this.engines.get(datasetId);
      if (!engine?.isBuilt) continue;

      const datasetResults = engine.search(query.query, query.filters);
      allResults.push(...datasetResults);
    }

    // Sort by relevance score descending, then alphabetically as tiebreak
    allResults.sort((a, b) => {
      if (b.relevanceScore !== a.relevanceScore) return b.relevanceScore - a.relevanceScore;
      return a.title.localeCompare(b.title);
    });

    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 20;
    const start = (page - 1) * pageSize;
    const paginated = allResults.slice(start, start + pageSize);

    return {
      results: paginated,
      total: allResults.length,
      page,
      pageSize,
      query: query.query,
      durationMs: Date.now() - startMs,
    };
  }

  /**
   * Get autocomplete suggestions across all initialized datasets.
   */
  async suggest(text: string, limit = 8): Promise<Suggestion[]> {
    if (!text.trim()) return [];

    const seen = new Set<string>();
    const results: Suggestion[] = [];

    for (const engine of this.engines.values()) {
      if (!engine.isBuilt) continue;
      for (const sug of engine.suggest(text, limit)) {
        const key = sug.text.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          results.push(sug);
        }
        if (results.length >= limit) break;
      }
      if (results.length >= limit) break;
    }

    // If no engine results, fall back to synonym-based suggestions
    if (results.length === 0) {
      const normalized = normalizeQuery(text);
      // Return any popular search that starts with the query
      for (const ps of POPULAR_SEARCHES) {
        if (normalizeQuery(ps.query).startsWith(normalized) || normalizeQuery(ps.label).startsWith(normalized)) {
          results.push({ id: `ps-${ps.id}`, text: ps.label, type: 'topic' });
          if (results.length >= limit) break;
        }
      }
    }

    return results.slice(0, limit);
  }

  /** Get the static popular searches list. */
  getPopularSearches(): PopularSearch[] {
    return POPULAR_SEARCHES;
  }

  /** Get all registered dataset configs. */
  getDatasets(): DatasetConfig[] {
    return SEARCH_DATASETS;
  }

  /** Get enabled datasets only. */
  getEnabledDatasets(): DatasetConfig[] {
    return SEARCH_DATASETS.filter((d) => d.enabled);
  }

  /** Total number of indexed documents across all datasets. */
  get totalDocuments(): number {
    let count = 0;
    for (const engine of this.engines.values()) count += engine.documentCount;
    return count;
  }

  /** Whether any dataset has been initialized with data. */
  get hasData(): boolean {
    return this.initialized.size > 0 && this.totalDocuments > 0;
  }
}

// ── Singleton export ──────────────────────────────────────────────────────────
// Import this everywhere. One instance per browser session.

export const searchService = new SearchService();
