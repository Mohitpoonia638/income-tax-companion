'use client';

import { GitCommit, FileSpreadsheet } from 'lucide-react';
import type { Amendment } from '@/types/legal';
import { Badge } from '@/components/ui/Badge';

interface AmendmentsTimelineProps {
  amendments?: Amendment[];
  sectionNumber: string;
}

export function AmendmentsTimeline({ amendments = [], sectionNumber }: AmendmentsTimelineProps) {
  const hasAmendments = amendments && amendments.length > 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <FileSpreadsheet size={18} />
        </div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          Latest Finance Act Amendments
        </h2>
      </div>

      {hasAmendments ? (
        <div className="space-y-3">
          {amendments.map((a) => (
            <div
              key={a.id}
              className="p-5 rounded-2xl border border-white/10 bg-white/3 space-y-2"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-amber-400">
                  Finance Act {a.financeActYear}
                </span>
                <Badge variant="warning" className="text-[10px]">
                  {a.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {a.description}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl border border-white/10 bg-white/3 text-center space-y-2">
          <div className="flex justify-center text-muted-foreground/40">
            <GitCommit size={24} />
          </div>
          <p className="text-sm font-medium text-foreground/80">No Specific Amendments Loaded</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Finance Act statutory changes and effective assessment year notes for Section {sectionNumber} will be displayed here.
          </p>
        </div>
      )}
    </section>
  );
}
