// ─── Circular Service ──────────────────────────────────────────────────────────

import { CircularModel } from '@/models/CircularModel';
import { circularRepository, CircularRepository } from '@/repositories/CircularRepository';

export class CircularService {
  constructor(private repo: CircularRepository = circularRepository) {}

  async getCircularById(id: string): Promise<CircularModel | null> {
    return this.repo.findById(id);
  }

  async getCircularsBySection(secNum: string): Promise<CircularModel[]> {
    return this.repo.findBySection(secNum);
  }

  async getAllCirculars(): Promise<CircularModel[]> {
    return this.repo.findAll();
  }
}

export const circularService = new CircularService();
