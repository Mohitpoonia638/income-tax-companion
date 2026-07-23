'use client';

import { BookmarkCheck, HelpCircle, Check } from 'lucide-react';
import type { RevisionNote } from '@/types/legal';

interface RevisionNotesSectionProps {
  revisionNotes?: RevisionNote[] | string[];
  sectionNumber: string;
}

export function RevisionNotesSection({ revisionNotes = [], sectionNumber }: RevisionNotesSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <BookmarkCheck size={18} />
        </div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          CA Exam Revision Notes &amp; Mnemonics
        </h2>
      </div>

      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6 space-y-4 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Quick Memory Checklist
          </span>
          <span className="text-xs text-muted-foreground">CA Intermediate / Final</span>
        </div>

        <ul className="space-y-2 text-sm text-foreground/90">
          <li className="flex items-start gap-2">
            <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>Verify assessee eligibility status before applying Section {sectionNumber} provisions.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>Check statutory maximum monetary caps &amp; lock-in period conditions.</span>
          </li>
          <li className="flex items-start gap-2">
            <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" />
            <span>Cross-check interaction with Default Tax Regime vs Normal Tax Regime.</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
