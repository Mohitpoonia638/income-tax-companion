// ─── Cache Manager ─────────────────────────────────────────────────────────────

import type { CacheEntry } from '@/types/legal';

const DEFAULT_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

export class CacheManager {
  private inMemoryCache = new Map<string, CacheEntry<unknown>>();

  /**
   * Get cached entry if valid and not expired
   */
  get<T>(key: string): T | null {
    // 1. Check in-memory map
    const entry = this.inMemoryCache.get(key) as CacheEntry<T> | undefined;
    if (entry) {
      if (Date.now() - entry.timestamp < entry.ttlMs) {
        return entry.data;
      }
      this.inMemoryCache.delete(key);
    }

    // 2. Fallback to localStorage (client-side)
    if (typeof window !== 'undefined') {
      try {
        const raw = localStorage.getItem(`itc_cache_${key}`);
        if (raw) {
          const parsed: CacheEntry<T> = JSON.parse(raw);
          if (Date.now() - parsed.timestamp < parsed.ttlMs) {
            this.inMemoryCache.set(key, parsed as CacheEntry<unknown>);
            return parsed.data;
          }
          localStorage.removeItem(`itc_cache_${key}`);
        }
      } catch {
        /* Ignore storage errors */
      }
    }

    return null;
  }

  /**
   * Set cached entry
   */
  set<T>(key: string, data: T, ttlMs: number = DEFAULT_TTL_MS): void {
    const entry: CacheEntry<T> = {
      key,
      data,
      timestamp: Date.now(),
      ttlMs,
    };

    this.inMemoryCache.set(key, entry as CacheEntry<unknown>);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(`itc_cache_${key}`, JSON.stringify(entry));
      } catch {
        /* Ignore quota exceeded */
      }
    }
  }

  /**
   * Clear cache by key prefix or clear all
   */
  clear(prefix?: string): void {
    if (!prefix) {
      this.inMemoryCache.clear();
      if (typeof window !== 'undefined') {
        try {
          const keysToRemove: string[] = [];
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && k.startsWith('itc_cache_')) keysToRemove.push(k);
          }
          keysToRemove.forEach((k) => localStorage.removeItem(k));
        } catch {
          /* Ignore storage errors */
        }
      }
      return;
    }

    for (const k of this.inMemoryCache.keys()) {
      if (k.startsWith(prefix)) this.inMemoryCache.delete(k);
    }
  }
}

export const cacheManager = new CacheManager();
