// ─── Data Adapter Interface ───────────────────────────────────────────────────
//
// All data access in the app goes through this interface.
// Swap adapters by changing DATA_SOURCE in lib/config.ts.
//
// Phase 1: localAdapter  (reads from lib/data/*.json)
// Phase 2: apiAdapter    (calls REST / GraphQL endpoint)
// Phase 3: dbAdapter     (Prisma / Supabase direct queries)

import type {
  ActId,
  Section,
  Circular,
  Notification,
  CaseLaw,
  Amendment,
  SearchQuery,
  SearchResponse,
} from '@/types';

export interface DataAdapter {
  // ── Sections ──────────────────────────────────────────────────────────────
  getSections(actId: ActId, query?: string): Promise<Section[]>;
  getSectionById(actId: ActId, sectionId: string): Promise<Section | null>;
  getSectionByNumber(actId: ActId, number: string): Promise<Section | null>;

  // ── CBDT ──────────────────────────────────────────────────────────────────
  getCirculars(query?: string): Promise<Circular[]>;
  getCircularById(id: string): Promise<Circular | null>;
  getNotifications(query?: string): Promise<Notification[]>;
  getNotificationById(id: string): Promise<Notification | null>;

  // ── Case Laws ─────────────────────────────────────────────────────────────
  getCaseLaws(query?: string): Promise<CaseLaw[]>;
  getCaseLawById(id: string): Promise<CaseLaw | null>;
  getCaseLawsBySection(sectionNumber: string): Promise<CaseLaw[]>;

  // ── Amendments ────────────────────────────────────────────────────────────
  getAmendments(sectionId?: string): Promise<Amendment[]>;
  getAmendmentById(id: string): Promise<Amendment | null>;

  // ── Full-text Search ──────────────────────────────────────────────────────
  search(query: SearchQuery): Promise<SearchResponse>;
}
