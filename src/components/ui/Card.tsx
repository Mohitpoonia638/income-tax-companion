import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  glass?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, glass, hover, onClick }: CardProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
      className={cn(
        'rounded-2xl border border-white/10 bg-card text-card-foreground shadow-sm',
        glass && 'bg-white/5 backdrop-blur-md border-white/10',
        hover &&
          'transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 hover:border-white/20 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

export function CardHeader({ children, className }: CardContentProps) {
  return <div className={cn('px-5 pt-5 pb-3', className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardContentProps) {
  return (
    <div className={cn('px-5 pb-5 pt-3 border-t border-white/5', className)}>
      {children}
    </div>
  );
}
