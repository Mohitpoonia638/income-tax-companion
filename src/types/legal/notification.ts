// ─── Notification Interface ───────────────────────────────────────────────────

import type { ActYear } from './act';

export type NotificationCategory = 'GSO' | 'SO' | 'Other';

export interface Notification {
  id: string;
  notificationNumber: string; // e.g. "12/2025"
  number?: string;             // Alias
  title: string;
  issueDate: string;           // ISO date
  date?: string;               // Alias
  category: NotificationCategory;
  type?: NotificationCategory; // Alias
  subject: string;
  relatedSections: string[];
  relatedActId?: ActYear;
  pdfUrl?: string;
  url?: string;
  summary?: string;
  source?: string;
}
