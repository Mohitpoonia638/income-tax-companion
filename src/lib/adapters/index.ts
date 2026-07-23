// ─── Adapter Factory ──────────────────────────────────────────────────────────
//
// Returns the correct DataAdapter based on DATA_SOURCE in lib/config.ts.
// This is the ONLY import you need in server components and hooks.
//
// Usage:
//   import { getAdapter } from '@/lib/adapters';
//   const adapter = getAdapter();
//   const sections = await adapter.getSections('1961');

import { DATA_SOURCE } from '@/lib/config';
import { localAdapter } from './localAdapter';
import { apiAdapter } from './apiAdapter';
import type { DataAdapter } from './types';

export function getAdapter(): DataAdapter {
  switch (DATA_SOURCE) {
    case 'api':
      return apiAdapter;
    case 'local':
    default:
      return localAdapter;
  }
}

export type { DataAdapter } from './types';
