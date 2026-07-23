'use client';

import { useState, useRef, type FormEvent } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  size?: 'md' | 'lg';
  onSearch?: (query: string) => void;
  className?: string;
  autoFocus?: boolean;
  defaultValue?: string;
}

export function SearchBar({
  placeholder = 'Search sections, keywords, topics…',
  size = 'lg',
  onSearch,
  className,
  autoFocus,
  defaultValue = '',
}: SearchBarProps) {
  const [value, setValue] = useState(defaultValue);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSearch?.(value.trim());
  };

  const isLarge = size === 'lg';

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      <div
        className={cn(
          'relative flex items-center gap-3 rounded-2xl border transition-all duration-300',
          'bg-white/5 backdrop-blur-sm',
          focused
            ? 'border-blue-500/60 shadow-xl shadow-blue-500/15 ring-4 ring-blue-500/10'
            : 'border-white/15 hover:border-white/25 shadow-lg shadow-black/20',
          isLarge ? 'px-5 py-4' : 'px-4 py-3'
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Search icon */}
        <Search
          size={isLarge ? 22 : 18}
          className={cn(
            'shrink-0 transition-colors duration-200',
            focused ? 'text-blue-400' : 'text-muted-foreground'
          )}
          strokeWidth={2}
        />

        {/* Input */}
        <input
          ref={inputRef}
          type="search"
          id="main-search-bar"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={cn(
            'flex-1 bg-transparent outline-none placeholder:text-muted-foreground/60 text-foreground',
            isLarge ? 'text-base md:text-lg' : 'text-sm'
          )}
          aria-label="Search"
        />

        {/* Submit button */}
        {value.trim() && (
          <button
            type="submit"
            aria-label="Search"
            className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium shadow-lg shadow-blue-500/30 hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 hover:shadow-blue-500/50"
          >
            Search
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </form>
  );
}
