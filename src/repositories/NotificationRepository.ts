// ─── Notification Repository ──────────────────────────────────────────────────

import type { Notification } from '@/types/legal';
import { InMemoryRepository } from './base/InMemoryRepository';

export class NotificationRepository extends InMemoryRepository<Notification> {
  async findBySection(sectionNumber: string): Promise<Notification[]> {
    const norm = sectionNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.findWhere((n) =>
      n.relatedSections.some((s) => s.toLowerCase().replace(/[^a-z0-9]/g, '') === norm)
    );
  }
}

export const notificationRepository = new NotificationRepository();
