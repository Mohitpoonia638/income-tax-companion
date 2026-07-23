// ─── Text Normalizer ───────────────────────────────────────────────────────────
//
// All search input and document content passes through these functions
// before indexing or matching. This ensures:
//   - Case-insensitive matching
//   - Space-tolerant section numbers ("80 C" = "80c")
//   - Symbol-stripped matching ("S. 80C" = "80c")

/**
 * Normalize a raw search query:
 *   - Lowercase
 *   - Replace non-alphanumeric chars (except spaces) with a space
 *   - Collapse multiple spaces to one
 *   - Trim
 *
 * @example normalizeQuery("  80C!  ") → "80c"
 * @example normalizeQuery("Capital Gain (LTCG)") → "capital gain ltcg"
 */
export function normalizeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalize a section number for exact matching.
 * Strips ALL whitespace and non-alphanumeric chars.
 *
 * @example normalizeSectionNumber("80 C")   → "80c"
 * @example normalizeSectionNumber("194 Q")  → "194q"
 * @example normalizeSectionNumber("S. 80-C")→ "80c"
 */
export function normalizeSectionNumber(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Tokenize normalized text into searchable tokens.
 * Filters out single-character tokens and common stop words.
 *
 * @example tokenize("income from salary") → ["income", "from", "salary"]
 */
export function tokenize(text: string): string[] {
  const STOP_WORDS = new Set(['a', 'an', 'the', 'of', 'in', 'on', 'at', 'to', 'is', 'it', 'or', 'and', 'for', 'by', 'as', 'be', 'has', 'had', 'have']);
  return normalizeQuery(text)
    .split(' ')
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

/**
 * Generate prefix tokens for autocomplete.
 * Returns all prefixes of length >= 2 for a given token.
 *
 * @example prefixesOf("salary") → ["sa", "sal", "sala", "salar", "salary"]
 */
export function prefixesOf(token: string): string[] {
  const result: string[] = [];
  for (let i = 2; i <= token.length; i++) {
    result.push(token.slice(0, i));
  }
  return result;
}

/**
 * Escape a string for safe use in a RegExp.
 */
export function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Wrap query-matching substrings in <mark> tags for highlighting.
 * Used in SearchResult title/excerpt display.
 *
 * @example highlight("Income from Salary", "salary") → "Income from <mark>Salary</mark>"
 */
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const tokens = tokenize(query);
  if (!tokens.length) return text;

  // Build a regex that matches any of the tokens (case-insensitive)
  const pattern = tokens.map(escapeRegex).join('|');
  try {
    const regex = new RegExp(`(${pattern})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  } catch {
    return text;
  }
}

/**
 * Strip <mark> tags from a previously highlighted string.
 * Useful for aria-labels and plain-text contexts.
 */
export function stripHighlight(text: string): string {
  return text.replace(/<\/?mark>/g, '');
}
