'use client';

import { useRef, type FormEvent, type ReactNode } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  onSubmit?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
  size?: 'md' | 'lg';
  isLoading?: boolean;
  isFocused?: boolean;
  autoFocus?: boolean;
  // ARIA
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'aria-activedescendant'?: string;
  className?: string;
  rightSlot?: ReactNode;
}

export function SearchInput({
  id = 'search-input',
  value,
  onChange,
  onFocus,
  onBlur,
  onClear,
  onSubmit,
  onKeyDown,
  placeholder = 'Search sections, keywords, topics…',
  size = 'lg',
  isLoading = false,
  isFocused = false,
  autoFocus,
  className,
  rightSlot,
  ...ariaProps
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isLarge = size === 'lg';

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) onSubmit?.(value.trim());
  };

  const handleClear = () => {
    onClear?.();
    inputRef.current?.focus();
  };

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)} role="search">
      <div
        className={cn(
          'relative flex items-center gap-3 rounded-2xl border transition-all duration-300',
          'bg-white/5 backdrop-blur-sm',
          isFocused
            ? 'border-blue-500/60 shadow-xl shadow-blue-500/15 ring-4 ring-blue-500/10'
            : 'border-white/15 hover:border-white/25 shadow-lg shadow-black/20',
          isLarge ? 'px-5 py-3.5' : 'px-4 py-3'
        )}
      >
        {/* Left: Clickable search icon button */}
        <button
          type="submit"
          aria-label="Submit Search"
          disabled={isLoading || !value.trim()}
          className="shrink-0 text-muted-foreground hover:text-blue-400 disabled:opacity-40 transition-colors p-1 -ml-1 rounded-lg"
        >
          <Search
            size={isLarge ? 22 : 18}
            className={cn(
              'transition-colors duration-200',
              isFocused ? 'text-blue-400' : 'text-muted-foreground'
            )}
            aria-hidden="true"
          />
        </button>

        {/* Input field */}
        <input
          ref={inputRef}
          id={id}
          type="search"
          role="combobox"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          aria-label="Search"
          aria-autocomplete="list"
          {...ariaProps}
          className={cn(
            'flex-1 min-w-0 bg-transparent outline-none',
            'placeholder:text-muted-foreground/50 text-foreground',
            '[&::-webkit-search-cancel-button]:hidden', // hide native clear
            isLarge ? 'text-base md:text-lg' : 'text-sm'
          )}
        />

        {/* Right: loading spinner, clear button, or submit action */}
        <div className="shrink-0 flex items-center gap-2">
          {isLoading && (
            <Loader2
              size={18}
              className="text-blue-400 animate-spin"
              aria-label="Searching…"
            />
          )}

          {value && !isLoading && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="flex items-center justify-center w-5 h-5 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/15 transition-all duration-150"
            >
              <X size={13} />
            </button>
          )}

          {/* Search Button for quick visual submission */}
          <button
            type="submit"
            disabled={isLoading || !value.trim()}
            aria-label="Search button"
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-xs md:text-sm font-semibold transition-all shadow-md shadow-blue-500/20"
          >
            Search
          </button>

          {rightSlot}
        </div>
      </div>
    </form>
  );
}
