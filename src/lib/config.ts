import type { ActMeta } from '@/types';

// ─── Act Registry ──────────────────────────────────────────────────────────────
// Add new Acts here — UI auto-adapts.

export const ACT_REGISTRY: Record<string, ActMeta> = {
  '1961': {
    id: '1961',
    title: 'Income Tax Act, 1961',
    shortTitle: 'ITA 1961',
    year: 1961,
    color: 'blue',
    description:
      'The primary legislation governing income tax in India, in force since 1 April 1962.',
  },
  '2025': {
    id: '2025',
    title: 'Income Tax Act, 2025',
    shortTitle: 'ITA 2025',
    year: 2025,
    color: 'violet',
    description:
      'The new comprehensive re-codification of Indian income tax law, proposed to replace the 1961 Act.',
  },
} as const;

// ─── Feature Flags ─────────────────────────────────────────────────────────────
// Set to true only when the feature is fully implemented and data is ready.

export const FEATURES = {
  search: false,        // Full-text search
  compare: false,       // Parallel section compare
  aiTutor: false,       // AI-powered Q&A
  caseLaws: false,      // Supreme Court / High Court judgments
  circulars: false,     // CBDT circulars
  notifications: false, // CBDT notifications
  amendments: false,    // Amendment timeline
  bareAct: false,       // Full bare act viewer
} as const satisfies Record<string, boolean>;

// ─── Data Source Config ────────────────────────────────────────────────────────
// Swap 'local' → 'api' → 'db' by changing this one value.

export type DataSourceType = 'local' | 'api' | 'db';

export const DATA_SOURCE: DataSourceType = 'local';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001/api';
