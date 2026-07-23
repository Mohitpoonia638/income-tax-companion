'use client';

import { useState, useCallback } from 'react';

// ─── useKeyboardNav ────────────────────────────────────────────────────────────
//
// Manages keyboard navigation within a list (dropdown, suggestions, results).
//
// Keys handled:
//   ArrowDown  — move selection down (wraps)
//   ArrowUp    — move selection up (wraps)
//   Enter      — select the currently active item
//   Escape     — close the list
//   Tab        — close the list (let focus move naturally)

interface UseKeyboardNavOptions {
  itemCount: number;
  onSelect: (index: number) => void;
  onClose: () => void;
  /** If true, ArrowDown on the last item does NOT wrap to index 0. Default: false */
  noWrap?: boolean;
}

export function useKeyboardNav({
  itemCount,
  onSelect,
  onClose,
  noWrap = false,
}: UseKeyboardNavOptions) {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (itemCount === 0) {
        if (e.key === 'Escape') { e.preventDefault(); onClose(); }
        return;
      }

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => {
            if (prev >= itemCount - 1) return noWrap ? prev : 0;
            return prev + 1;
          });
          break;

        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => {
            if (prev <= 0) return noWrap ? 0 : itemCount - 1;
            return prev - 1;
          });
          break;

        case 'Enter':
          if (activeIndex >= 0) {
            e.preventDefault();
            onSelect(activeIndex);
          }
          break;

        case 'Escape':
          e.preventDefault();
          setActiveIndex(-1);
          onClose();
          break;

        case 'Tab':
          setActiveIndex(-1);
          onClose();
          break;

        default:
          break;
      }
    },
    [itemCount, activeIndex, onSelect, onClose, noWrap]
  );

  const reset = useCallback(() => setActiveIndex(-1), []);

  return { activeIndex, handleKeyDown, reset, setActiveIndex };
}
