// ─── Bookmark Types ────────────────────────────────────────────────────────────

import type { SearchResultType } from './search';

export interface Bookmark {
  id: string;
  type: SearchResultType;
  itemId: string;           // ID of the bookmarked item
  title: string;
  subtitle?: string;
  actId?: string;
  sectionNumber?: string;
  href: string;
  addedAt: string;          // ISO date string
  note?: string;            // user's personal note
  collectionId?: string;
}

export interface BookmarkCollection {
  id: string;
  name: string;
  description?: string;
  color?: string;
  createdAt: string;
  bookmarkIds: string[];
}
