// ─── Case Law Service ──────────────────────────────────────────────────────────

import type { CourtLevel } from '@/types/legal';
import { CaseLawModel } from '@/models/CaseLawModel';
import { caseLawRepository, CaseLawRepository } from '@/repositories/CaseLawRepository';

export class CaseLawService {
  constructor(private repo: CaseLawRepository = caseLawRepository) {}

  async getCaseLawById(id: string): Promise<CaseLawModel | null> {
    return this.repo.findById(id);
  }

  async getCaseLawsBySection(secNum: string): Promise<CaseLawModel[]> {
    return this.repo.findBySection(secNum);
  }

  async getCaseLawsByCourt(court: CourtLevel): Promise<CaseLawModel[]> {
    return this.repo.findByCourt(court);
  }

  async getAllCaseLaws(): Promise<CaseLawModel[]> {
    return this.repo.findAll();
  }
}

export const caseLawService = new CaseLawService();
