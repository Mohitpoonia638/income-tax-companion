// ─── Search Direct Routing Utility ──────────────────────────────────────────────

/**
 * Format any user search query into target Section Result Page URL.
 * Handles section numbers (80C, 194Q, 54, Section 72) and topic keywords (House Property, Capital Gain, Residential Status).
 */
export function getSearchTargetUrl(query: string, actYear: string = '1961'): string {
  const trimmed = query.trim();
  if (!trimmed) return '/search';

  // Normalize query string (remove "Section", extra spaces, special chars for slug)
  const cleanSection = trimmed
    .replace(/^section\s+/i, '')
    .trim();

  // If query is an alphanumeric section number (e.g. 80C, 194Q, 54, 72, 80D, 115BAC)
  const slug = encodeURIComponent(cleanSection.toLowerCase().replace(/\s+/g, '-'));

  return `/acts/${actYear}/${slug}`;
}
