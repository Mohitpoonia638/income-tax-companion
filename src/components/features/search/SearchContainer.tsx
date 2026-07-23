'use client';

import {
  useRef,
  useCallback,
  useId,
  useState,
  Suspense,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SearchInput } from './SearchInput';
import { SearchDropdown, getDropdownItems } from './SearchDropdown';
import { SearchResults } from './SearchResults';
import { SearchFilters } from './SearchFilters';
import { useSearch } from '@/hooks/useSearch';
import { useKeyboardNav } from '@/hooks/useKeyboardNav';
import { getSearchTargetUrl } from '@/lib/search/routing';
import type { PopularSearch } from '@/types/search';
import type { ExampleSearch } from '@/lib/constants';
import { ExampleChip } from '@/components/ui/Chip';
import { cn } from '@/lib/utils';

export type SearchContainerMode = 'hero' | 'page';

interface SearchContainerBaseProps {
  mode: SearchContainerMode;
  examples?: ExampleSearch[];
  className?: string;
}

function SearchContainerInner({
  mode,
  examples = [],
  className,
}: SearchContainerBaseProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get('q') ?? '';

  const dropdownId = `search-dropdown-${useId().replace(/:/g, '')}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    query,
    setQuery,
    clearQuery,
    dropdownOpen,
    openDropdown,
    closeDropdown,
    suggestions,
    results,
    status,
    total,
    filters,
    setFilters,
    recents,
    removeRecent,
    clearRecents,
  } = useSearch(mode === 'page' ? urlQuery : '');

  // Authentic tax domain popular searches
  const authenticPopular: PopularSearch[] = [
    { id: 'pop-1',  label: '80C',                query: '80C',                category: 'deduction' },
    { id: 'pop-2',  label: '80D',                query: '80D',                category: 'deduction' },
    { id: 'pop-3',  label: '80CCD',              query: '80CCD',              category: 'deduction' },
    { id: 'pop-4',  label: '80G',                query: '80G',                category: 'deduction' },
    { id: 'pop-5',  label: 'House Property',     query: 'House Property',     category: 'head'      },
    { id: 'pop-6',  label: 'Salary',             query: 'Salary',             category: 'head'      },
    { id: 'pop-7',  label: 'Capital Gain',       query: 'Capital Gain',       category: 'head'      },
    { id: 'pop-8',  label: 'Residential Status', query: 'Residential Status', category: 'section'   },
    { id: 'pop-9',  label: 'TDS',                query: 'TDS',                category: 'tds'       },
    { id: 'pop-10', label: 'Clubbing of Income', query: 'Clubbing of Income', category: 'section'   },
  ];

  const flatItems = getDropdownItems(query, suggestions, recents, authenticPopular);

  const handleSelect = useCallback(
    (index: number) => {
      const item = flatItems[index];
      if (!item) return;
      closeDropdown();
      setQuery(item.value);
      handleSubmit(item.value);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flatItems, closeDropdown, setQuery]
  );

  const { activeIndex, handleKeyDown, reset: resetNav } = useKeyboardNav({
    itemCount: flatItems.length,
    onSelect: handleSelect,
    onClose: closeDropdown,
  });

  // ── Submit Search Handler ──────────────────────────────────────────────────

  const handleSubmit = useCallback(
    (q?: string) => {
      const finalQuery = (q ?? query).trim();
      if (!finalQuery || isSubmitting) return;

      setIsSubmitting(true);
      closeDropdown();
      resetNav();

      const targetUrl = getSearchTargetUrl(finalQuery);
      router.push(targetUrl);
    },
    [query, isSubmitting, router, closeDropdown, resetNav]
  );

  const handleFocus = () => openDropdown();

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      if (!containerRef.current?.contains(document.activeElement)) {
        closeDropdown();
        resetNav();
      }
    }, 150);
  }, [closeDropdown, resetNav]);

  const handleChipClick = (q: string) => {
    setQuery(q);
    handleSubmit(q);
  };

  const isHero = mode === 'hero';

  return (
    <div
      ref={containerRef}
      className={cn('w-full', isHero ? 'max-w-2xl mx-auto' : '', className)}
    >
      <div className="relative">
        <SearchInput
          id="main-search-input"
          value={query}
          onChange={(val) => {
            setQuery(val);
            if (!dropdownOpen) openDropdown();
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onClear={() => {
            clearQuery();
            resetNav();
            openDropdown();
          }}
          onSubmit={handleSubmit}
          onKeyDown={handleKeyDown}
          placeholder={
            isHero
              ? "Search '80C', 'House Property', 'Capital Gain', 'Residential Status'…"
              : 'Search sections, keywords, topics…'
          }
          size={isHero ? 'lg' : 'md'}
          isLoading={isSubmitting || status === 'loading'}
          isFocused={dropdownOpen}
          aria-expanded={dropdownOpen}
          aria-controls={dropdownId}
          aria-activedescendant={
            activeIndex >= 0 ? `${dropdownId}-item-${activeIndex}` : undefined
          }
        />

        {/* Dropdown */}
        <SearchDropdown
          id={dropdownId}
          isOpen={dropdownOpen}
          query={query}
          suggestions={suggestions}
          popularSearches={authenticPopular}
          recents={recents}
          activeIndex={activeIndex}
          onSelectSuggestion={handleChipClick}
          onSelectRecent={handleChipClick}
          onSelectPopular={handleChipClick}
          onRemoveRecent={removeRecent}
          onClearRecents={clearRecents}
        />
      </div>

      {/* Example chips below input */}
      {isHero && examples.length > 0 && (
        <div className="mt-5 flex flex-col items-center gap-3">
          <span className="text-xs text-muted-foreground/70 font-medium uppercase tracking-wider">
            Popular Topics
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {examples.map((s) => (
              <ExampleChip
                key={s.label}
                search={s}
                onClick={handleChipClick}
              />
            ))}
          </div>
        </div>
      )}

      {/* Page mode: filters + results */}
      {!isHero && (
        <div className="mt-6 space-y-4">
          <SearchFilters filters={filters} onChange={setFilters} />
          <SearchResults
            results={results}
            status={status}
            total={total}
            query={query || urlQuery}
          />
        </div>
      )}
    </div>
  );
}

export function SearchContainer(props: SearchContainerBaseProps) {
  return (
    <Suspense fallback={<SearchContainerFallback mode={props.mode} />}>
      <SearchContainerInner {...props} />
    </Suspense>
  );
}

function SearchContainerFallback({ mode }: { mode: SearchContainerMode }) {
  const isHero = mode === 'hero';
  return (
    <div className={cn('w-full', isHero ? 'max-w-2xl mx-auto' : '')}>
      <div
        className={cn(
          'flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm shadow-lg',
          isHero ? 'px-5 py-4' : 'px-4 py-3'
        )}
      >
        <div className="w-5 h-5 rounded bg-white/10 animate-pulse shrink-0" />
        <div className="flex-1 h-4 rounded bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}
