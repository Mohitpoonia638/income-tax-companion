// ─── Search Library — Barrel Export ───────────────────────────────────────────

// Core engine
export { SearchEngine } from './engine';

// Service singleton
export { searchService, SEARCH_DATASETS } from './searchService';

// Utilities
export {
  normalizeQuery,
  normalizeSectionNumber,
  tokenize,
  prefixesOf,
  highlightText,
  stripHighlight,
  escapeRegex,
} from './normalizer';

// Synonyms
export { expandQuery, getSynonyms, SYNONYM_MAP } from './synonyms';

// Popular searches
export { POPULAR_SEARCHES, POPULAR_CATEGORY_STYLES } from './popularSearches';
