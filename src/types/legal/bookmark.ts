// ─── Bookmark Interface ────────────────────────────────────────────────────────

import type { ActYear } from './act';

export type BookmarkEntityType =
  | 'section'
  | 'caseLaw'
  | 'circular'
  | 'notification'
  | 'amendment'
  | 'rule'
  | 'form';

export interface Bookmark {
  id: string;
  entityId: string;
  entityType: BookmarkEntityType;
  title: string;
  subtitle?: string;
  actYear?: ActYear;
  sectionNumber?: string;
  createdAt: string;       // ISO date
  tags?: string[];
  userNotes?: string;
}

export interface BookmarkCollection {
  id: string;
  name: string;
  description?: string;
  bookmarkIds: string[];
  createdAt: string;
  updatedAt: string;
}
