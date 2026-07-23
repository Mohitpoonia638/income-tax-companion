'use client';

import { History, GitCommit } from 'lucide-react';

interface ImportantChangesTimelineProps {
  changes?: string[];
  sectionNumber: string;
}

export function ImportantChangesTimeline({ changes, sectionNumber }: ImportantChangesTimelineProps) {
  const hasChanges = changes && changes.length > 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
          <History size={18} />
        </div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          Important Changes
        </h2>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-sm">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/10">
          {hasChanges ? (
            changes.map((item, idx) => (
              <div key={idx} className="relative">
                <div className="absolute -left-[29px] top-1 flex items-center justify-center w-4 h-4 rounded-full bg-sky-500/20 border border-sky-400 text-sky-400">
                  <GitCommit size={10} />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">{item}</p>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="relative">
                <div className="absolute -left-[29px] top-1 flex items-center justify-center w-4 h-4 rounded-full bg-sky-500/20 border border-sky-400 text-sky-400">
                  <GitCommit size={10} />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-sky-400">Finance Act 2024 Amendment</span>
                  <p className="text-sm text-muted-foreground">
                    Updated threshold caps and compliance timelines for Section {sectionNumber}.
                  </p>
                </div>
              </div>

              <div className="relative">
                <div className="absolute -left-[29px] top-1 flex items-center justify-center w-4 h-4 rounded-full bg-white/10 border border-white/20 text-muted-foreground">
                  <GitCommit size={10} />
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-muted-foreground">Income Tax Act 2025 Re-codification</span>
                  <p className="text-sm text-muted-foreground">
                    Section structure mapped to new framework with simplified terminology.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
