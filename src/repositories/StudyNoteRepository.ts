// ─── Study Note Repository ─────────────────────────────────────────────────────

import type { StudyNote } from '@/types/legal';
import { InMemoryRepository } from './base/InMemoryRepository';

export class StudyNoteRepository extends InMemoryRepository<StudyNote> {
  async findBySection(sectionNumber: string): Promise<StudyNote[]> {
    const norm = sectionNumber.toLowerCase().replace(/[^a-z0-9]/g, '');
    return this.findWhere((sn) =>
      sn.sectionNumber
        ? sn.sectionNumber.toLowerCase().replace(/[^a-z0-9]/g, '') === norm
        : false
    );
  }

  async findByKeyword(keyword: string): Promise<StudyNote[]> {
    const q = keyword.toLowerCase();
    return this.findWhere(
      (sn) =>
        sn.title.toLowerCase().includes(q) ||
        sn.summary.toLowerCase().includes(q) ||
        sn.keyConcepts.some((kc) => kc.toLowerCase().includes(q)) ||
        sn.tags?.some((t) => t.toLowerCase().includes(q)) || false
    );
  }
}

export const studyNoteRepository = new StudyNoteRepository();
