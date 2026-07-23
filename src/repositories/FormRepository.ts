// ─── Form Repository ──────────────────────────────────────────────────────────

import type { Form, FormCategory } from '@/types/legal';
import { InMemoryRepository } from './base/InMemoryRepository';

export class FormRepository extends InMemoryRepository<Form> {
  async findBySection(sectionNumber: string): Promise<Form[]> {
    const norm = sectionNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.findWhere((f) =>
      f.relatedSections.some((s) => s.toLowerCase().replace(/[^a-z0-9]/g, '') === norm)
    );
  }

  async findByCategory(category: FormCategory): Promise<Form[]> {
    return this.findWhere((f) => f.category === category);
  }
}

export const formRepository = new FormRepository();
