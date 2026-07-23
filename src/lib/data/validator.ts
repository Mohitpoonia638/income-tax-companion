// ─── Data Validator ───────────────────────────────────────────────────────────

import type { Section, Act, CaseLaw } from '@/types/legal';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates a Section object schema integrity
 */
export function validateSectionSchema(section: Partial<Section>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!section.id) errors.push('Missing required field: "id"');
  if (!section.actYear) errors.push('Missing required field: "actYear"');
  if (!section.sectionNumber) errors.push('Missing required field: "sectionNumber"');
  if (!section.sectionTitle) errors.push('Missing required field: "sectionTitle"');
  if (!section.chapter) errors.push('Missing required field: "chapter"');

  if (section.actYear && !['1961', '2025'].includes(section.actYear)) {
    errors.push(`Invalid actYear: "${section.actYear}". Expected "1961" or "2025".`);
  }

  if (!section.keywords || section.keywords.length === 0) {
    warnings.push('Section has no keywords defined (imparts search quality).');
  }

  if (!section.simpleMeaning && !section.detailedMeaning && !section.bareAct) {
    warnings.push('Section has no content (simpleMeaning, detailedMeaning, or bareAct).');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates an Act object schema integrity
 */
export function validateActSchema(act: Partial<Act>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!act.id) errors.push('Missing required field: "id"');
  if (!act.actYear) errors.push('Missing required field: "actYear"');
  if (!act.title) errors.push('Missing required field: "title"');

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates a CaseLaw object schema integrity
 */
export function validateCaseLawSchema(caseLaw: Partial<CaseLaw>): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!caseLaw.id) errors.push('Missing required field: "id"');
  if (!caseLaw.title) errors.push('Missing required field: "title"');
  if (!caseLaw.citation) errors.push('Missing required field: "citation"');
  if (!caseLaw.court) errors.push('Missing required field: "court"');

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}
