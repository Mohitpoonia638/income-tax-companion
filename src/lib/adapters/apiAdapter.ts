// ─── API Adapter (Stub) ───────────────────────────────────────────────────────
//
// Phase 2 implementation — connects to a REST or GraphQL API.
// Uncomment and implement each method when the API is ready.
// Switch to this adapter by setting DATA_SOURCE = 'api' in lib/config.ts.

import type { DataAdapter } from './types';
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
import { API_BASE_URL } from '@/lib/config';

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    next: { revalidate: 3600 }, // ISR: revalidate every hour
  });
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const apiAdapter: DataAdapter = {
  getSections: (actId: ActId, query?: string) =>
    apiFetch<Section[]>(`/sections?actId=${actId}${query ? `&q=${encodeURIComponent(query)}` : ''}`),

  getSectionById: (actId: ActId, id: string) =>
    apiFetch<Section | null>(`/sections/${id}?actId=${actId}`),

  getSectionByNumber: (actId: ActId, number: string) =>
    apiFetch<Section | null>(`/sections/by-number/${encodeURIComponent(number)}?actId=${actId}`),

  getCirculars: (query?: string) =>
    apiFetch<Circular[]>(`/circulars${query ? `?q=${encodeURIComponent(query)}` : ''}`),

  getCircularById: (id: string) =>
    apiFetch<Circular | null>(`/circulars/${id}`),

  getNotifications: (query?: string) =>
    apiFetch<Notification[]>(`/notifications${query ? `?q=${encodeURIComponent(query)}` : ''}`),

  getNotificationById: (id: string) =>
    apiFetch<Notification | null>(`/notifications/${id}`),

  getCaseLaws: (query?: string) =>
    apiFetch<CaseLaw[]>(`/case-laws${query ? `?q=${encodeURIComponent(query)}` : ''}`),

  getCaseLawById: (id: string) =>
    apiFetch<CaseLaw | null>(`/case-laws/${id}`),

  getCaseLawsBySection: (sectionNumber: string) =>
    apiFetch<CaseLaw[]>(`/case-laws?section=${encodeURIComponent(sectionNumber)}`),

  getAmendments: (sectionId?: string) =>
    apiFetch<Amendment[]>(`/amendments${sectionId ? `?sectionId=${sectionId}` : ''}`),

  getAmendmentById: (id: string) =>
    apiFetch<Amendment | null>(`/amendments/${id}`),

  search: (query: SearchQuery) =>
    apiFetch<SearchResponse>(
      `/search?q=${encodeURIComponent(query.query)}&page=${query.page ?? 1}&pageSize=${query.pageSize ?? 20}`
    ),
};
