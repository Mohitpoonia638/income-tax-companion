'use client';

import { Sparkles, Star } from 'lucide-react';

interface OneLineMeaningProps {
  text?: string;
  sectionNumber: string;
}

export function OneLineMeaning({ text, sectionNumber }: OneLineMeaningProps) {
  const defaultText = `Allows eligible assessees to claim tax deductions and exemptions under Section ${sectionNumber} of the Income Tax Act.`;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 p-6 md:p-8 shadow-xl shadow-blue-500/5">
      {/* Decorative star background badge */}
      <div className="absolute top-3 right-4 opacity-15 pointer-events-none">
        <Star size={72} className="text-blue-400" />
      </div>

      <div className="relative space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold uppercase tracking-wider border border-blue-500/30">
          <Sparkles size={13} className="text-yellow-400 animate-pulse" />
          One Line Summary
        </div>

        <p className="text-lg sm:text-xl md:text-2xl font-medium text-foreground leading-relaxed pt-1">
          &ldquo;{text || defaultText}&rdquo;
        </p>
      </div>
    </section>
  );
}
