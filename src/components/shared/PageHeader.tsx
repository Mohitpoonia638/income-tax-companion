import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  badge?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ title, description, badge, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      {badge && (
        <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25 uppercase tracking-wider">
          {badge}
        </span>
      )}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-1.5 text-muted-foreground text-sm md:text-base max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
