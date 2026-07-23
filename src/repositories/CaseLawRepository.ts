// ─── Case Law Repository ──────────────────────────────────────────────────────

import type { CourtLevel } from '@/types/legal';
import { InMemoryRepository } from './base/InMemoryRepository';
import { CaseLawModel } from '@/models/CaseLawModel';

export class CaseLawRepository extends InMemoryRepository<CaseLawModel> {
  async findBySection(sectionNumber: string): Promise<CaseLawModel[]> {
    const norm = sectionNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.findWhere((c) =>
      c.relatedSections.some((s) => s.toLowerCase().replace(/[^a-z0-9]/g, '') === norm)
    );
  }

  async findByCourt(court: CourtLevel): Promise<CaseLawModel[]> {
    return this.findWhere((c) => c.court === court);
  }

  loadCaseLawModels(caseLaws: Array<ConstructorParameters<typeof CaseLawModel>[0]>): void {
    const models = caseLaws.map((c) => new CaseLawModel(c));
    this.loadAll(models);
  }
}

export const caseLawRepository = new CaseLawRepository();
