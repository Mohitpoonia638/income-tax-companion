'use client';

import { SearchX } from 'lucide-react';
import { SearchResultCard } from './SearchResultCard';
import { Skeleton } from '@/components/ui/Skeleton';
import type { SearchResult, SearchStatus } from '@/types/search';

// ─── SearchResults ─────────────────────────────────────────────────────────────

interface SearchResultsProps {
  results: SearchResult[];
  status: SearchStatus;
  total: number;
  query: string;
}

export function SearchResults({ results, status, total, query }: SearchResultsProps) {
  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (status === 'loading') {
    return (
      <div className="space-y-3" aria-live="polite" aria-busy="true" aria-label="Loading results">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex items-start gap-4 p-4 md:p-5 rounded-2xl border border-white/10 bg-white/3">
            <Skeleton className="w-7 h-7 rounded-lg hidden sm:block shrink-0" />
            <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-2/5" />
              <Skeleton className="h-3 w-4/5" />
              <Skeleton className="h-3 w-3/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── Empty state ───────────────────────────────────────────────────────────
  if (status === 'empty') {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 px-4 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-muted/20 blur-2xl scale-150" />
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10">
            <SearchX size={28} className="text-muted-foreground/50" strokeWidth={1.5} />
          </div>
        </div>
        <h3 className="text-base font-semibold text-foreground mb-2">
          No results for &ldquo;{query}&rdquo;
        </h3>
        {/* Required exact message per specification */}
        <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
          No matching results found in the current legal dataset.
        </p>
        <div className="mt-6 text-xs text-muted-foreground/50 space-y-1">
          <p>Try:</p>
          <ul className="list-disc list-inside text-left space-y-0.5">
            <li>A section number (e.g. <code className="font-mono">80C</code>, <code className="font-mono">194Q</code>)</li>
            <li>A keyword (e.g. <code className="font-mono">Salary</code>, <code className="font-mono">Capital Gain</code>)</li>
            <li>A chapter topic (e.g. <code className="font-mono">Deductions</code>)</li>
          </ul>
        </div>
      </div>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center py-12 text-center" role="alert">
        <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (status === 'success' && results.length > 0) {
    return (
      <div aria-live="polite">
        {/* Result count */}
        <div className="mb-4 flex items-center justify-between flex-wrap gap-2">
          <p className="text-sm text-muted-foreground">
            Found{' '}
            <span className="font-semibold text-foreground">{total.toLocaleString()}</span>
            {' '}result{total !== 1 ? 's' : ''} for{' '}
            <span className="font-semibold text-blue-400">&ldquo;{query}&rdquo;</span>
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-3">
          {results.map((result, i) => (
            <SearchResultCard key={result.id} result={result} index={i} />
          ))}
        </div>

        {/* Pagination placeholder */}
        {total > results.length && (
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground/60">
              Showing {results.length} of {total} results · Pagination coming soon
            </p>
          </div>
        )}
      </div>
    );
  }

  return null;
}
