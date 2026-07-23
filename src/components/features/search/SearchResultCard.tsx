'use client';

import Link from 'next/link';
import { FileText, Bell, Gavel, GitBranch, FileCode2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { stripHighlight } from '@/lib/search/normalizer';
import type { SearchResult, SearchResultType } from '@/types/search';

// ── Type config ────────────────────────────────────────────────────────────────

const TYPE_CONFIG: Record<SearchResultType, {
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  badgeVariant: 'primary' | 'success' | 'warning' | 'danger' | 'default';
  color: string;
}> = {
  section:    { label: 'Section',     icon: FileText,  badgeVariant: 'primary',  color: 'text-blue-400'    },
  circular:   { label: 'Circular',    icon: Bell,      badgeVariant: 'default',  color: 'text-sky-400'     },
  notification:{ label: 'Notification',icon: Bell,     badgeVariant: 'default',  color: 'text-sky-400'     },
  caseLaw:    { label: 'Case Law',    icon: Gavel,     badgeVariant: 'danger',   color: 'text-rose-400'    },
  amendment:  { label: 'Amendment',   icon: GitBranch, badgeVariant: 'warning',  color: 'text-amber-400'   },
  rule:       { label: 'Rule',        icon: FileCode2, badgeVariant: 'success',  color: 'text-emerald-400' },
  form:       { label: 'Form',        icon: FileCode2, badgeVariant: 'success',  color: 'text-emerald-400' },
  financeAct: { label: 'Finance Act', icon: FileText,  badgeVariant: 'primary',  color: 'text-violet-400'  },
};

const ACT_LABEL: Record<string, string> = {
  '1961': 'ITA 1961',
  '2025': 'ITA 2025',
};

// ── SearchResultCard ───────────────────────────────────────────────────────────

interface SearchResultCardProps {
  result: SearchResult;
  index: number;
}

export function SearchResultCard({ result, index }: SearchResultCardProps) {
  const config = TYPE_CONFIG[result.type] ?? TYPE_CONFIG.section;
  const TypeIcon = config.icon;

  // Titles/excerpts may contain <mark> tags from the engine's highlightText()
  // We render them safely with dangerouslySetInnerHTML only for these trusted strings.
  const plainTitle = stripHighlight(result.title);

  return (
    <Link
      href={result.href}
      className={cn(
        'group flex items-start gap-4 p-4 md:p-5 rounded-2xl',
        'border border-white/10 bg-white/3 backdrop-blur-sm',
        'transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20',
        'hover:bg-white/6 hover:shadow-lg hover:shadow-black/20'
      )}
      aria-label={`${config.label}: ${plainTitle}`}
    >
      {/* Index number */}
      <div className="hidden sm:flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-xs font-mono text-muted-foreground/50 shrink-0 mt-0.5">
        {index + 1}
      </div>

      {/* Type icon */}
      <div className={cn('flex items-center justify-center w-9 h-9 rounded-xl shrink-0 mt-0.5', 'bg-white/5 border border-white/10')}>
        <TypeIcon size={16} strokeWidth={1.8} className={config.color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Badges row */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={config.badgeVariant} className="text-[10px]">
            {config.label}
          </Badge>
          {result.actId && ACT_LABEL[result.actId] && (
            <Badge variant="outline" className="text-[10px]">
              {ACT_LABEL[result.actId]}
            </Badge>
          )}
          {result.sectionNumber && (
            <Badge variant="default" className="text-[10px] font-mono">
              § {result.sectionNumber}
            </Badge>
          )}
        </div>

        {/* Title with highlights */}
        <h3
          className="text-sm font-semibold text-foreground leading-snug group-hover:text-blue-400 transition-colors"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: result.title }}
          aria-label={plainTitle}
        />

        {/* Excerpt with highlights */}
        {result.excerpt && (
          <p
            className="text-xs text-muted-foreground leading-relaxed line-clamp-2"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: result.excerpt }}
          />
        )}

        {/* Tags */}
        {result.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-0.5">
            {result.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-white/5 text-muted-foreground border border-white/8"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Arrow */}
      <ArrowRight
        size={14}
        className="shrink-0 text-muted-foreground/30 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all duration-200 mt-1"
      />
    </Link>
  );
}
