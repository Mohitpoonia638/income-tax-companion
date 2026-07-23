// ─── Notification Importer ───────────────────────────────────────────────────

import type { Notification } from '@/types/legal';
import type { ImportErrorRecord } from '../importTypes';
import { notificationRepository } from '@/repositories/NotificationRepository';

export interface NotificationImportResult {
  validItems: Notification[];
  errors: ImportErrorRecord[];
}

export function importNotifications(
  records: Record<string, unknown>[]
): NotificationImportResult {
  const validItems: Notification[] = [];
  const errors: ImportErrorRecord[] = [];

  records.forEach((raw, index) => {
    const id = String(raw.id || `notif-${index}`).trim();
    const notificationNumber = String(raw.notificationNumber || raw.number || '').trim();
    const title = String(raw.title || '').trim();
    const issueDate = String(raw.issueDate || raw.date || '').trim();
    const category = (raw.category || raw.type || 'GSO') as Notification['category'];
    const subject = String(raw.subject || title).trim();

    if (!notificationNumber || !title) {
      errors.push({
        index,
        recordId: id,
        reason: 'Missing notificationNumber or title',
        rawRecord: raw,
      });
      return;
    }

    const notification: Notification = {
      id,
      notificationNumber,
      number: notificationNumber,
      title,
      issueDate,
      date: issueDate,
      category,
      type: category,
      subject,
      relatedSections: Array.isArray(raw.relatedSections) ? (raw.relatedSections as string[]) : [],
      pdfUrl: String(raw.pdfUrl || raw.url || ''),
      summary: String(raw.summary || ''),
    };

    validItems.push(notification);
  });

  if (validItems.length > 0) {
    notificationRepository.loadAll(validItems);
  }

  return { validItems, errors };
}
