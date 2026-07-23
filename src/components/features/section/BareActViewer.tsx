'use client';

import { FileText, ShieldAlert } from 'lucide-react';
import type { BareActContent } from '@/types/legal';

interface BareActViewerProps {
  bareAct?: BareActContent | string;
  sectionNumber: string;
}

export function BareActViewer({ bareAct, sectionNumber }: BareActViewerProps) {
  const rawText =
    typeof bareAct === 'string'
      ? bareAct
      : bareAct?.rawText || '';

  const hasContent = rawText.trim().length > 0;

  return (
    <section className="space-y-4 rounded-2xl border border-violet-500/30 bg-violet-950/10 p-6 md:p-8 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30">
            <FileText size={18} />
          </div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            Bare Act Text — Section {sectionNumber}
          </h2>
        </div>
        <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
          Professional Mode
        </span>
      </div>

      {hasContent ? (
        <div className="p-5 rounded-xl bg-black/40 border border-white/10 font-mono text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
          {rawText}
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-black/20 border border-white/5 text-center space-y-2">
          <div className="flex justify-center text-violet-400/60">
            <ShieldAlert size={28} />
          </div>
          <p className="text-sm font-medium text-foreground">Official Statutory Bare Act Text</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            The verbatim legal text of Section {sectionNumber} (including provisos, explanations, and statutory clauses) will be displayed here in Professional Mode.
          </p>
        </div>
      )}
    </section>
  );
}
