// ─── Amendment Repository ─────────────────────────────────────────────────────

import { InMemoryRepository } from './base/InMemoryRepository';
import { AmendmentModel } from '@/models/AmendmentModel';

export class AmendmentRepository extends InMemoryRepository<AmendmentModel> {
  async findBySection(sectionNumber: string): Promise<AmendmentModel[]> {
    const norm = sectionNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.findWhere(
      (a) => a.sectionNumber.toLowerCase().replace(/[^a-z0-9]/g, '') === norm
    );
  }

  async findByFinanceActYear(year: number): Promise<AmendmentModel[]> {
    return this.findWhere((a) => a.financeActYear === year);
  }

  loadAmendmentModels(amendments: Array<ConstructorParameters<typeof AmendmentModel>[0]>): void {
    const models = amendments.map((a) => new AmendmentModel(a));
    this.loadAll(models);
  }
}

export const amendmentRepository = new AmendmentRepository();
