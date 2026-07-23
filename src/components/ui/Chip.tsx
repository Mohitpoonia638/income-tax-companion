'use client';

import { cn } from '@/lib/utils';
import type { ExampleSearch } from '@/lib/constants';

interface ChipProps {
  search: ExampleSearch;
  onClick?: (query: string) => void;
}

const categoryStyles: Record<ExampleSearch['category'], string> = {
  deduction: 'hover:bg-emerald-500/15 hover:text-emerald-300 hover:border-emerald-500/30',
  section:   'hover:bg-blue-500/15 hover:text-blue-300 hover:border-blue-500/30',
  head:      'hover:bg-violet-500/15 hover:text-violet-300 hover:border-violet-500/30',
  penalty:   'hover:bg-red-500/15 hover:text-red-300 hover:border-red-500/30',
  tds:       'hover:bg-amber-500/15 hover:text-amber-300 hover:border-amber-500/30',
};

export function ExampleChip({ search, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(search.query)}
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium',
        'bg-white/5 text-muted-foreground border border-white/10',
        'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer',
        categoryStyles[search.category]
      )}
    >
      <span className="opacity-60">#</span>
      {search.label}
    </button>
  );
}
