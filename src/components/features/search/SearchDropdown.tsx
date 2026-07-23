'use client';

import { Clock, X, Trash2, TrendingUp, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Suggestion, PopularSearch } from '@/types/search';
import type { RecentSearch } from '@/hooks/useRecentSearches';
import { POPULAR_CATEGORY_STYLES } from '@/lib/search/popularSearches';

interface SearchDropdownProps {
  id: string;
  isOpen: boolean;
  query: string;
  suggestions: Suggestion[];
  popularSearches: PopularSearch[];
  recents: RecentSearch[];
  activeIndex: number;
  onSelectSuggestion: (text: string) => void;
  onSelectRecent: (query: string) => void;
  onSelectPopular: (query: string) => void;
  onRemoveRecent: (id: string) => void;
  onClearRecents: () => void;
}

// Total combined item count for keyboard nav indexing
// Order: suggestions → recents → popular
export function getDropdownItems(
  query: string,
  suggestions: Suggestion[],
  recents: RecentSearch[],
  popularSearches: PopularSearch[]
): { type: 'suggestion' | 'recent' | 'popular'; value: string; id: string }[] {
  if (query.trim()) {
    return suggestions.map((s) => ({ type: 'suggestion', value: s.text, id: s.id }));
  }
  return [
    ...recents.map((r) => ({ type: 'recent' as const, value: r.query, id: r.id })),
    ...popularSearches.map((p) => ({ type: 'popular' as const, value: p.query, id: p.id })),
  ];
}

export function SearchDropdown({
  id,
  isOpen,
  query,
  suggestions,
  popularSearches,
  recents,
  activeIndex,
  onSelectSuggestion,
  onSelectRecent,
  onSelectPopular,
  onRemoveRecent,
  onClearRecents,
}: SearchDropdownProps) {
  const isTyping = query.trim().length > 0;

  // Flatten items for keyboard nav index mapping
  const flatItems = getDropdownItems(query, suggestions, recents, popularSearches);

  if (!isOpen) return null;

  return (
    <div
      id={id}
      role="listbox"
      aria-label="Search suggestions"
      className={cn(
        'absolute top-full left-0 right-0 z-50 mt-2',
        'rounded-2xl border border-white/10 bg-background/95 backdrop-blur-xl',
        'shadow-2xl shadow-black/30 overflow-hidden',
        'animate-in fade-in slide-in-from-top-2 duration-200'
      )}
    >
      {/* ── While typing: Autocomplete suggestions ── */}
      {isTyping && (
        <div className="py-2">
          {suggestions.length === 0 ? (
            <div className="px-4 py-3 text-xs text-muted-foreground/60 text-center">
              No suggestions found
            </div>
          ) : (
            <>
              <div className="px-4 py-2 flex items-center gap-1.5">
                <Hash size={11} className="text-muted-foreground/50" />
                <span className="text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wider">
                  Suggestions
                </span>
              </div>
              {suggestions.map((sug, i) => (
                <SuggestionRow
                  key={sug.id}
                  id={`${id}-item-${i}`}
                  text={sug.text}
                  query={query}
                  type={sug.type}
                  isActive={activeIndex === i}
                  onClick={() => onSelectSuggestion(sug.text)}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* ── When empty: Recent + Popular ── */}
      {!isTyping && (
        <div className="py-2 max-h-[420px] overflow-y-auto">
          {/* Recent Searches */}
          {recents.length > 0 && (
            <div className="mb-1">
              <div className="px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Clock size={11} className="text-muted-foreground/50" />
                  <span className="text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wider">
                    Recent
                  </span>
                </div>
                <button
                  onClick={onClearRecents}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  <Trash2 size={10} />
                  Clear all
                </button>
              </div>
              {recents.map((r, i) => {
                const flatIdx = i;
                return (
                  <RecentRow
                    key={r.id}
                    id={`${id}-item-${flatIdx}`}
                    query={r.query}
                    isActive={activeIndex === flatIdx}
                    onSelect={() => onSelectRecent(r.query)}
                    onRemove={(e) => { e.stopPropagation(); onRemoveRecent(r.id); }}
                  />
                );
              })}
            </div>
          )}

          {/* Divider */}
          {recents.length > 0 && popularSearches.length > 0 && (
            <div className="mx-4 my-2 border-t border-white/5" />
          )}

          {/* Popular Searches */}
          {popularSearches.length > 0 && (
            <div>
              <div className="px-4 py-2 flex items-center gap-1.5">
                <TrendingUp size={11} className="text-muted-foreground/50" />
                <span className="text-[11px] text-muted-foreground/60 font-medium uppercase tracking-wider">
                  Popular Searches
                </span>
              </div>
              <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                {popularSearches.map((ps, i) => {
                  const flatIdx = recents.length + i;
                  return (
                    <PopularChip
                      key={ps.id}
                      id={`${id}-item-${flatIdx}`}
                      search={ps}
                      isActive={activeIndex === flatIdx}
                      onClick={() => onSelectPopular(ps.query)}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty state when nothing at all */}
          {recents.length === 0 && popularSearches.length === 0 && (
            <div className="px-4 py-6 text-center text-xs text-muted-foreground/60">
              Start typing to search…
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function SuggestionRow({
  id, text, query, type, isActive, onClick,
}: {
  id: string; text: string; query: string; type: string; isActive: boolean; onClick: () => void;
}) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={isActive}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-100',
        isActive ? 'bg-blue-500/15 text-foreground' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
      )}
    >
      <Hash size={13} className="shrink-0 opacity-40" />
      <span className="text-sm flex-1 truncate">
        <HighlightedText text={text} query={query} />
      </span>
      {type === 'section' && (
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/20 shrink-0">
          Section
        </span>
      )}
    </div>
  );
}

function RecentRow({
  id, query, isActive, onSelect, onRemove,
}: {
  id: string; query: string; isActive: boolean; onSelect: () => void; onRemove: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      id={id}
      role="option"
      aria-selected={isActive}
      onClick={onSelect}
      className={cn(
        'group flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors duration-100',
        isActive ? 'bg-blue-500/15 text-foreground' : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
      )}
    >
      <Clock size={13} className="shrink-0 opacity-50" />
      <span className="text-sm flex-1 truncate">{query}</span>
      <button
        onClick={onRemove}
        aria-label={`Remove "${query}" from recents`}
        className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-5 h-5 rounded-full hover:bg-white/15 transition-all shrink-0"
      >
        <X size={11} />
      </button>
    </div>
  );
}

function PopularChip({
  id, search, isActive, onClick,
}: {
  id: string; search: PopularSearch; isActive: boolean; onClick: () => void;
}) {
  const colorClass = POPULAR_CATEGORY_STYLES[search.category];
  return (
    <button
      id={id}
      role="option"
      aria-selected={isActive}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
        'bg-white/5 text-muted-foreground border border-white/10',
        'transition-all duration-150 hover:-translate-y-0.5',
        isActive && 'bg-blue-500/15 text-blue-300 border-blue-500/30',
        !isActive && colorClass
      )}
    >
      <span className="opacity-40">#</span>
      {search.label}
    </button>
  );
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase().trim();
  const idx = lowerText.indexOf(lowerQuery);
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <mark className="bg-blue-500/20 text-blue-300 rounded-sm not-italic">{text.slice(idx, idx + lowerQuery.length)}</mark>
      {text.slice(idx + lowerQuery.length)}
    </>
  );
}
