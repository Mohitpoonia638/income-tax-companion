'use client';

import { BookOpen } from 'lucide-react';

interface SimpleExplanationProps {
  content?: string;
  sectionNumber: string;
}

export function SimpleExplanation({ content, sectionNumber }: SimpleExplanationProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-white/10 bg-white/3 p-6 md:p-8 backdrop-blur-sm">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <BookOpen size={18} />
        </div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          Simple Explanation
        </h2>
      </div>

      <div className="prose prose-invert max-w-none text-base md:text-lg leading-relaxed text-muted-foreground space-y-4">
        {content ? (
          <p>{content}</p>
        ) : (
          <>
            <p>
              Section {sectionNumber} provides detailed provisions regarding eligible deductions, limits, and compliance conditions under the Income Tax law.
            </p>
            <p>
              For CA exam preparation, focus on the eligible category of assessees, statutory caps, and deadline prerequisites to solve practical computation problems effortlessly.
            </p>
          </>
        )}
      </div>
    </section>
  );
}
