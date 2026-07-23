// ─── Class Name Utility ────────────────────────────────────────────────────────

type ClassValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | ClassValue[]
  | { [key: string]: unknown };

export function cn(...inputs: ClassValue[]): string {
  const result: string[] = [];

  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      result.push(input);
    } else if (typeof input === 'number') {
      result.push(String(input));
    } else if (Array.isArray(input)) {
      const inner = cn(...input);
      if (inner) result.push(inner);
    } else if (typeof input === 'object') {
      for (const [key, val] of Object.entries(input)) {
        if (val) result.push(key);
      }
    }
  }

  return result.join(' ');
}

// ─── Date Formatting ──────────────────────────────────────────────────────────

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

// ─── Text Utilities ───────────────────────────────────────────────────────────

/** Truncate text to N characters, appending an ellipsis */
export function truncate(text: string, length = 120): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trimEnd() + '…';
}

/** Convert a section number to a URL-safe slug — e.g. "80C" → "80c" */
export function sectionSlug(number: string): string {
  return number.toLowerCase().replace(/[^a-z0-9]/g, '-');
}

/** Capitalise the first letter of each word */
export function titleCase(str: string): string {
  return str
    .toLowerCase()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}
