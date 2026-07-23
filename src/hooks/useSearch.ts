'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { searchService } from '@/lib/search';
import { useRecentSearches } from './useRecentSearches';
import type { SearchResult, SearchFilter, Suggestion, SearchStatus } from '@/types/search';

// ─── useSearch ────────────────────────────────────────────────────────────────
//
// Central search state hook. Manages:
//   - query input value
//   - debounced autocomplete suggestions (300ms)
//   - full search results (on submit)
//   - loading / error / empty states
//   - recent searches integration

const DEBOUNCE_MS = 300;

export interface UseSearchReturn {
  // Input state
  query: string;
  setQuery: (q: string) => void;
  clearQuery: () => void;

  // Dropdown state
  dropdownOpen: boolean;
  openDropdown: () => void;
  closeDropdown: () => void;

  // Suggestions (autocomplete, shown while typing)
  suggestions: Suggestion[];
  suggestionsLoading: boolean;

  // Search results (shown after submit)
  results: SearchResult[];
  status: SearchStatus;
  total: number;

  // Filters
  filters: SearchFilter;
  setFilters: (f: SearchFilter) => void;

  // Actions
  submitSearch: (q?: string) => Promise<void>;

  // Recent searches
  recents: ReturnType<typeof useRecentSearches>['recents'];
  addRecent: (q: string) => void;
  removeRecent: (id: string) => void;
  clearRecents: () => void;
}

export function useSearch(initialQuery = ''): UseSearchReturn {
  const [query, setQueryState] = useState(initialQuery);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<SearchFilter>({});

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { recents, add: addRecent, remove: removeRecent, clear: clearRecents } = useRecentSearches();

  // ── Sync initialQuery (e.g. from URL param) ──────────────────────────────
  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQueryState(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  // ── Debounced suggestions ─────────────────────────────────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSuggestions([]);
      setSuggestionsLoading(false);
      return;
    }

    setSuggestionsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const sugs = await searchService.suggest(query);
        setSuggestions(sugs);
      } catch {
        setSuggestions([]);
      } finally {
        setSuggestionsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  // ── Auto-run search when initialQuery is set (page mode) ─────────────────
  useEffect(() => {
    if (initialQuery.trim()) {
      submitSearch(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // ── Actions ───────────────────────────────────────────────────────────────

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    if (q.trim()) setDropdownOpen(true);
  }, []);

  const clearQuery = useCallback(() => {
    setQueryState('');
    setSuggestions([]);
    setResults([]);
    setStatus('idle');
    setTotal(0);
  }, []);

  const openDropdown  = useCallback(() => setDropdownOpen(true),  []);
  const closeDropdown = useCallback(() => setDropdownOpen(false), []);

  const submitSearch = useCallback(async (q?: string) => {
    const searchQuery = (q ?? query).trim();
    if (!searchQuery) return;

    setQueryState(searchQuery);
    setDropdownOpen(false);
    setStatus('loading');

    try {
      const response = await searchService.search({ query: searchQuery, filters });
      setResults(response.results);
      setTotal(response.total);
      setStatus(response.total === 0 ? 'empty' : 'success');
      addRecent(searchQuery);
    } catch {
      setResults([]);
      setTotal(0);
      setStatus('error');
    }
  }, [query, filters, addRecent]);

  return {
    query,
    setQuery,
    clearQuery,
    dropdownOpen,
    openDropdown,
    closeDropdown,
    suggestions,
    suggestionsLoading,
    results,
    status,
    total,
    filters,
    setFilters,
    submitSearch,
    recents,
    addRecent,
    removeRecent,
    clearRecents,
  };
}
