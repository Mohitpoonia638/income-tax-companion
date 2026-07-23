// ─── Data Parser ───────────────────────────────────────────────────────────────

import type {
  Act,
  Section,
  CaseLaw,
  Amendment,
  Circular,
  Notification,
  Rule,
  Form,
  SectionMapping,
  FAQ,
  StudyNote,
} from '@/types/legal';

/**
 * Safely parse raw JSON into typed arrays
 */
export function parseActsJson(raw: unknown): Act[] {
  if (!Array.isArray(raw)) return [];
  return raw as Act[];
}

export function parseSectionsJson(raw: unknown): Section[] {
  if (!Array.isArray(raw)) return [];
  return raw as Section[];
}

export function parseCaseLawsJson(raw: unknown): CaseLaw[] {
  if (!Array.isArray(raw)) return [];
  return raw as CaseLaw[];
}

export function parseAmendmentsJson(raw: unknown): Amendment[] {
  if (!Array.isArray(raw)) return [];
  return raw as Amendment[];
}

export function parseCircularsJson(raw: unknown): Circular[] {
  if (!Array.isArray(raw)) return [];
  return raw as Circular[];
}

export function parseNotificationsJson(raw: unknown): Notification[] {
  if (!Array.isArray(raw)) return [];
  return raw as Notification[];
}

export function parseRulesJson(raw: unknown): Rule[] {
  if (!Array.isArray(raw)) return [];
  return raw as Rule[];
}

export function parseFormsJson(raw: unknown): Form[] {
  if (!Array.isArray(raw)) return [];
  return raw as Form[];
}

export function parseSectionMappingsJson(raw: unknown): SectionMapping[] {
  if (!Array.isArray(raw)) return [];
  return raw as SectionMapping[];
}

export function parseFaqsJson(raw: unknown): FAQ[] {
  if (!Array.isArray(raw)) return [];
  return raw as FAQ[];
}

export function parseStudyNotesJson(raw: unknown): StudyNote[] {
  if (!Array.isArray(raw)) return [];
  return raw as StudyNote[];
}
