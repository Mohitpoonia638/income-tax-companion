'use client';

import { HelpCircle } from 'lucide-react';

interface McqPlaceholderProps {
  sectionNumber: string;
}

export function McqPlaceholder({ sectionNumber }: McqPlaceholderProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
          <HelpCircle size={18} />
        </div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          Practice MCQs
        </h2>
      </div>

      <div className="p-6 rounded-2xl border border-white/10 bg-white/3 text-center space-y-2">
        <p className="text-sm font-medium text-foreground">Interactive MCQ Quiz Bank</p>
        <p className="text-xs text-muted-foreground max-w-md mx-auto">
          Practice multiple choice questions specifically tagged to Section {sectionNumber} with instant explanations and ICAI question patterns.
        </p>
        <div className="pt-2">
          <span className="inline-flex items-center text-xs px-3 py-1 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 font-medium">
            Coming Soon in Milestone 5
          </span>
        </div>
      </div>
    </section>
  );
}
