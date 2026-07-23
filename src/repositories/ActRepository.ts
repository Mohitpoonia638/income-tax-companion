// ─── Act Repository ────────────────────────────────────────────────────────────

import type { Act, ActYear } from '@/types/legal';
import { InMemoryRepository } from './base/InMemoryRepository';
import { ActModel } from '@/models/ActModel';

export class ActRepository extends InMemoryRepository<Act> {
  async findByYear(actYear: ActYear): Promise<Act | null> {
    const all = await this.findAll();
    return all.find((a) => a.actYear === actYear) || null;
  }

  loadActModels(acts: Act[]): void {
    const models = acts.map((a) => new ActModel(a));
    this.loadAll(models);
  }
}

export const actRepository = new ActRepository();
