'use client';

import { ShieldCheck, Sparkles, AlertTriangle } from 'lucide-react';
import type { ConfidenceLevel } from '@/types/legal';
import { cn } from '@/lib/utils';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  className?: string;
}

export function ConfidenceBadge({ level, className }: ConfidenceBadgeProps) {
  switch (level) {
    case 'Verified':
      return (
        <span
          title="Curated directly from verified Income Tax statutory database"
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
            'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
            className
          )}
        >
          <ShieldCheck size={13} />
          Verified
        </span>
      );

    case 'Verified + AI Summary':
      return (
        <span
          title="Statutory data verified from local database, enhanced with AI summary"
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
            'bg-blue-500/15 text-blue-300 border border-blue-500/30',
            className
          )}
        >
          <Sparkles size={13} className="text-yellow-400" />
          Verified + AI Summary
        </span>
      );

    case 'AI Generated (Needs Verification)':
      return (
        <span
          title="Retrieved via AI engine; pending formal manual statutory verification"
          className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold',
            'bg-amber-500/15 text-amber-300 border border-amber-500/30',
            className
          )}
        >
          <AlertTriangle size={13} />
          AI Generated (Needs Verification)
        </span>
      );
  }
}
