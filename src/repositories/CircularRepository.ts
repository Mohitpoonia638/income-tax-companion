// ─── Circular Repository ──────────────────────────────────────────────────────

import { InMemoryRepository } from './base/InMemoryRepository';
import { CircularModel } from '@/models/CircularModel';

export class CircularRepository extends InMemoryRepository<CircularModel> {
  async findBySection(sectionNumber: string): Promise<CircularModel[]> {
    const norm = sectionNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.findWhere((c) =>
      c.relatedSections.some((s) => s.toLowerCase().replace(/[^a-z0-9]/g, '') === norm)
    );
  }

  loadCircularModels(circulars: Array<ConstructorParameters<typeof CircularModel>[0]>): void {
    const models = circulars.map((c) => new CircularModel(c));
    this.loadAll(models);
  }
}

export const circularRepository = new CircularRepository();
