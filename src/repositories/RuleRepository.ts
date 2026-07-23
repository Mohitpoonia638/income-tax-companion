// ─── Rule Repository ──────────────────────────────────────────────────────────

import type { Rule } from '@/types/legal';
import { InMemoryRepository } from './base/InMemoryRepository';

export class RuleRepository extends InMemoryRepository<Rule> {
  async findBySection(sectionNumber: string): Promise<Rule[]> {
    const norm = sectionNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.findWhere((r) =>
      r.relatedSections.some((s) => s.toLowerCase().replace(/[^a-z0-9]/g, '') === norm)
    );
  }

  async findByRuleNumber(ruleNumber: string): Promise<Rule | null> {
    const norm = ruleNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    const all = await this.findAll();
    return all.find((r) => r.ruleNumber.toLowerCase().replace(/[^a-z0-9]/g, '') === norm) || null;
  }
}

export const ruleRepository = new RuleRepository();
