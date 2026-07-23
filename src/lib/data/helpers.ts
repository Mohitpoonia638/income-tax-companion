// ─── Legal Data Helpers ────────────────────────────────────────────────────────

import type { ActYear } from '@/types/legal';

/**
 * Generate standard section identifier
 * @example generateSectionId('1961', '80C') -> 'sec-1961-80c'
 */
export function generateSectionId(actYear: ActYear, sectionNumber: string): string {
  const normSec = sectionNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
  return `sec-${actYear}-${normSec}`;
}

/**
 * Format section number nicely
 * @example formatSectionNumber('80c') -> '80C'
 */
export function formatSectionNumber(sectionNumber: string): string {
  return sectionNumber.toUpperCase().trim();
}

/**
 * Compare two section numbers for numerical / alphabetical sorting
 */
export function compareSectionNumbers(a: string, b: string): number {
  const numA = parseInt(a.replace(/[^0-9]/g, ''), 10) || 0;
  const numB = parseInt(b.replace(/[^0-9]/g, ''), 10) || 0;

  if (numA !== numB) {
    return numA - numB;
  }
  return a.localeCompare(b);
}

/**
 * Check if a date string is in valid ISO format (YYYY-MM-DD)
 */
export function isValidIsoDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const timestamp = Date.parse(dateStr);
  return !isNaN(timestamp);
}
