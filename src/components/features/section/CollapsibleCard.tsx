'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CollapsibleCardProps {
  id?: string;
  title: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: React.ReactNode;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
}

export function CollapsibleCard({
  id,
  title,
  icon: Icon,
  badge,
  defaultOpen = true,
  children,
  className,
  headerClassName,
}: CollapsibleCardProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section
      id={id}
      className={cn(
        'rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm overflow-hidden transition-all duration-200',
        className
      )}
    >
      {/* ── Card Header (Clickable to collapse/expand) ── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        className={cn(
          'w-full flex items-center justify-between gap-3 p-5 text-left transition-colors hover:bg-white/5',
          headerClassName
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 shrink-0">
            <Icon size={18} />
          </div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground tracking-tight truncate">
            {title}
          </h2>
          {badge && <div className="shrink-0">{badge}</div>}
        </div>

        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-muted-foreground shrink-0">
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* ── Card Body ── */}
      {isOpen && (
        <div className="px-5 pb-5 pt-1 border-t border-white/5 animate-in fade-in duration-150">
          {children}
        </div>
      )}
    </section>
  );
}
