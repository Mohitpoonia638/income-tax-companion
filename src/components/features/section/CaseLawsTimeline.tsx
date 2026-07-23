'use client';

import { Gavel, Scale, AlertCircle } from 'lucide-react';
import type { CaseLaw } from '@/types/legal';
import { Badge } from '@/components/ui/Badge';

interface CaseLawsTimelineProps {
  caseLaws?: CaseLaw[];
  sectionNumber: string;
}

export function CaseLawsTimeline({ caseLaws = [], sectionNumber }: CaseLawsTimelineProps) {
  const hasCaseLaws = caseLaws && caseLaws.length > 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <Scale size={18} />
        </div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          Case Laws &amp; Judgments
        </h2>
      </div>

      {hasCaseLaws ? (
        <div className="space-y-3">
          {caseLaws.map((cl) => (
            <div
              key={cl.id}
              className="p-5 rounded-2xl border border-white/10 bg-white/3 space-y-2 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h3 className="text-base font-semibold text-foreground">{cl.title}</h3>
                  <p className="text-xs font-mono text-muted-foreground">{cl.citation}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="danger" className="text-[10px]">
                    {cl.court}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{cl.year}</span>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed pt-1">
                {cl.headnote || cl.summary}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl border border-white/10 bg-white/3 text-center space-y-2">
          <div className="flex justify-center text-muted-foreground/40">
            <Gavel size={24} />
          </div>
          <p className="text-sm font-medium text-foreground/80">No Case Laws Indexed Yet</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Supreme Court, High Court, and ITAT judgments related to Section {sectionNumber} will appear here when loaded from the dataset.
          </p>
        </div>
      )}
    </section>
  );
}
