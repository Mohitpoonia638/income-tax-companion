// ─── Act Service ───────────────────────────────────────────────────────────────

import type { Act, ActYear } from '@/types/legal';
import { actRepository, ActRepository } from '@/repositories/ActRepository';

export class ActService {
  constructor(private repo: ActRepository = actRepository) {}

  async getAllActs(): Promise<Act[]> {
    return this.repo.findAll();
  }

  async getActByYear(year: ActYear): Promise<Act | null> {
    return this.repo.findByYear(year);
  }
}

export const actService = new ActService();
