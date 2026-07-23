'use client';

import { useState } from 'react';
import { Bookmark, Share2, Download, GraduationCap, Briefcase, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ConfidenceBadge } from './ConfidenceBadge';
import { cn } from '@/lib/utils';
import type { ActYear, SectionStatus, ConfidenceLevel } from '@/types/legal';

export type ViewMode = 'student' | 'professional';

interface SectionHeaderProps {
  sectionNumber: string;
  sectionTitle: string;
  actYear: ActYear;
  chapter: string;
  status: SectionStatus;
  lastUpdated?: string;
  confidenceLevel?: ConfidenceLevel;
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  onShare?: () => void;
  onExportPdf?: () => void;
}

export function SectionHeader({
  sectionNumber,
  sectionTitle,
  actYear,
  chapter,
  status,
  lastUpdated,
  confidenceLevel = 'Verified',
  mode,
  onModeChange,
  isBookmarked = false,
  onToggleBookmark,
  onShare,
  onExportPdf,
}: SectionHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShareClick = () => {
    if (onShare) {
      onShare();
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const statusVariantMap: Record<SectionStatus, 'success' | 'warning' | 'danger' | 'default'> = {
    active: 'success',
    amended: 'warning',
    omitted: 'danger',
    pending: 'default',
  };

  return (
    <div className="space-y-6 pb-6 border-b border-white/10">
      {/* ── Top Bar: Navigation / Actions & Mode Switcher ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Mode Switcher: Student Mode (Default) vs Professional Mode */}
        <div className="inline-flex items-center p-1 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <button
            onClick={() => onModeChange('student')}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
              mode === 'student'
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <GraduationCap size={15} />
            Student Mode
          </button>
          <button
            onClick={() => onModeChange('professional')}
            className={cn(
              'flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200',
              mode === 'professional'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-600/25'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <Briefcase size={14} />
            Professional Mode
          </button>
        </div>

        {/* Action Buttons: Bookmark, Share, Export PDF */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <Button
            variant={isBookmarked ? 'primary' : 'outline'}
            size="sm"
            onClick={onToggleBookmark}
            className="gap-1.5 text-xs rounded-xl"
            aria-label="Bookmark this section"
          >
            <Bookmark size={14} className={isBookmarked ? 'fill-current' : ''} />
            {isBookmarked ? 'Bookmarked' : 'Bookmark'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShareClick}
            className="gap-1.5 text-xs rounded-xl"
            aria-label="Share URL"
          >
            <Share2 size={14} />
            {copied ? 'Copied!' : 'Share'}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onExportPdf}
            className="gap-1.5 text-xs rounded-xl hidden md:inline-flex"
            aria-label="Export section as PDF"
          >
            <Download size={14} />
            PDF
          </Button>
        </div>
      </div>

      {/* ── Section Title & Metadata Badges ── */}
      <div className="space-y-3">
        {/* Badges strip */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            variant={actYear === '1961' ? 'primary' : 'violet'}
            className="text-xs font-semibold px-2.5 py-0.5"
          >
            Income Tax Act {actYear}
          </Badge>

          <Badge variant="outline" className="text-xs">
            {chapter}
          </Badge>

          <Badge variant={statusVariantMap[status]} className="text-xs capitalize">
            {status}
          </Badge>

          {/* Confidence Level Badge */}
          <ConfidenceBadge level={confidenceLevel} />

          {lastUpdated && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground/60 ml-auto">
              <Clock size={12} />
              Updated: {lastUpdated}
            </span>
          )}
        </div>

        {/* Section Heading */}
        <div>
          <span className="text-sm font-mono font-semibold text-blue-400 block mb-1">
            SECTION {sectionNumber}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-snug">
            {sectionTitle}
          </h1>
        </div>
      </div>
    </div>
  );
}
