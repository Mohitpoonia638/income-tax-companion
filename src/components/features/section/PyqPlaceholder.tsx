'use client';

import { FileQuestion } from 'lucide-react';

interface PyqPlaceholderProps {
  sectionNumber: string;
}

export function PyqPlaceholder({ sectionNumber }: PyqPlaceholderProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <FileQuestion size={18} />
        </div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          Previous Year Questions (PYQs)
        </h2>
      </div>

      <div className="p-6 rounded-2xl border border-white/10 bg-white/3 text-center space-y-2">
        <p className="text-sm font-medium text-foreground">ICAI Past Exam Questions &amp; Suggested Answers</p>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Past 10 years CA Intermediate &amp; Final examination questions covering Section {sectionNumber} with step-by-step marking schemes.
        </p>
        <div className="pt-2">
          <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
            Coming Soon in Milestone 5
          </span>
        </div>
      </div>
    </section>
  );
}
