'use client';

import { cn } from '@/lib/utils';
import { SEARCH_DATASETS } from '@/lib/search';
import type { SearchFilter, SearchDatasetId } from '@/types/search';

interface SearchFiltersProps {
  filters: SearchFilter;
  onChange: (filters: SearchFilter) => void;
  className?: string;
}

const DATASET_COLOR_MAP: Record<string, string> = {
  blue:    'data-[active=true]:bg-blue-500/20   data-[active=true]:text-blue-300   data-[active=true]:border-blue-500/40',
  violet:  'data-[active=true]:bg-violet-500/20 data-[active=true]:text-violet-300 data-[active=true]:border-violet-500/40',
  sky:     'data-[active=true]:bg-sky-500/20    data-[active=true]:text-sky-300    data-[active=true]:border-sky-500/40',
  rose:    'data-[active=true]:bg-rose-500/20   data-[active=true]:text-rose-300   data-[active=true]:border-rose-500/40',
  amber:   'data-[active=true]:bg-amber-500/20  data-[active=true]:text-amber-300  data-[active=true]:border-amber-500/40',
  emerald: 'data-[active=true]:bg-emerald-500/20 data-[active=true]:text-emerald-300 data-[active=true]:border-emerald-500/40',
};

export function SearchFilters({ filters, onChange, className }: SearchFiltersProps) {
  const activeDatasets = filters.datasetIds ?? [];

  const toggleDataset = (id: SearchDatasetId) => {
    const current = new Set(activeDatasets);
    if (current.has(id)) {
      current.delete(id);
    } else {
      current.add(id);
    }
    onChange({ ...filters, datasetIds: current.size > 0 ? Array.from(current) : undefined });
  };

  const clearAll = () => onChange({ ...filters, datasetIds: undefined });

  const enabledDatasets = SEARCH_DATASETS.filter((d) => d.enabled);

  // Only show filters if there are multiple enabled datasets
  if (enabledDatasets.length < 2) return null;

  return (
    <div className={cn('flex items-center gap-2 flex-wrap', className)} role="group" aria-label="Filter by dataset">
      {/* "All" chip */}
      <button
        onClick={clearAll}
        data-active={activeDatasets.length === 0}
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150',
          'bg-white/5 text-muted-foreground border-white/10',
          'hover:bg-white/10 hover:text-foreground',
          'data-[active=true]:bg-blue-500/20 data-[active=true]:text-blue-300 data-[active=true]:border-blue-500/40'
        )}
      >
        All
      </button>

      {/* Dataset chips */}
      {enabledDatasets.map((ds) => {
        const isActive = activeDatasets.includes(ds.id);
        const colorClass = DATASET_COLOR_MAP[ds.color] ?? DATASET_COLOR_MAP.blue;
        return (
          <button
            key={ds.id}
            onClick={() => toggleDataset(ds.id)}
            data-active={isActive}
            title={ds.description}
            className={cn(
              'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150',
              'bg-white/5 text-muted-foreground border-white/10',
              'hover:bg-white/10 hover:text-foreground',
              colorClass
            )}
          >
            {ds.shortLabel}
            {!ds.enabled && (
              <span className="opacity-40 text-[9px]">soon</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
