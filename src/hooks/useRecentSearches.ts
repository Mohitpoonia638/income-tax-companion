'use client';

import { useState, useEffect, useCallback } from 'react';

// ─── Recent Search Entry ────────────────────────────────────────────────────────

export interface RecentSearch {
  id: string;
  query: string;
  timestamp: number;
}

const STORAGE_KEY = 'itc_recent_searches';
const MAX_RECENT   = 8;

// ─── useRecentSearches ─────────────────────────────────────────────────────────

export function useRecentSearches() {
  const [recents, setRecents] = useState<RecentSearch[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage on mount (client only)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: RecentSearch[] = JSON.parse(raw);
        if (Array.isArray(parsed)) setRecents(parsed);
      }
    } catch {
      /* ignore malformed data */
    }
    setHydrated(true);
  }, []);

  const persist = useCallback((searches: RecentSearch[]) => {
    setRecents(searches);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
    } catch {
      /* ignore quota exceeded */
    }
  }, []);

  /** Add a new recent search. Deduplicates by query (case-insensitive). */
  const add = useCallback(
    (query: string) => {
      const trimmed = query.trim();
      if (!trimmed) return;
      const deduped = recents.filter(
        (r) => r.query.toLowerCase() !== trimmed.toLowerCase()
      );
      const entry: RecentSearch = {
        id: `r-${Date.now()}`,
        query: trimmed,
        timestamp: Date.now(),
      };
      persist([entry, ...deduped].slice(0, MAX_RECENT));
    },
    [recents, persist]
  );

  /** Remove a specific recent search by ID. */
  const remove = useCallback(
    (id: string) => {
      persist(recents.filter((r) => r.id !== id));
    },
    [recents, persist]
  );

  /** Clear all recent searches. */
  const clear = useCallback(() => persist([]), [persist]);

  return {
    recents: hydrated ? recents : [], // avoid SSR mismatch
    add,
    remove,
    clear,
    hydrated,
  };
}
