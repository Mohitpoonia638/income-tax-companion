'use client';

import { Tag } from 'lucide-react';

interface KeywordsTagListProps {
  keywords?: string[];
  synonyms?: string[];
  sectionNumber: string;
}

export function KeywordsTagList({ keywords = [], synonyms = [], sectionNumber }: KeywordsTagListProps) {
  const defaultKeywords = ['Deductions', 'Computation', 'Assessment', `Section ${sectionNumber}`, 'Tax Saving'];
  const allTags = Array.from(new Set([...(keywords.length ? keywords : defaultKeywords), ...synonyms]));

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Tag size={18} />
        </div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          Important Keywords
        </h2>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/3 p-5 backdrop-blur-sm">
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white/5 text-foreground/90 border border-white/10 hover:border-blue-500/30 hover:bg-blue-500/10 hover:text-blue-300 transition-all duration-150 cursor-pointer"
            >
              <span className="text-muted-foreground/40">#</span>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
