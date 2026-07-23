import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'primary' | 'violet' | 'success' | 'warning' | 'danger' | 'outline';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variants: Record<BadgeVariant, string> = {
  default:  'bg-white/10 text-muted-foreground border border-white/10',
  primary:  'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  violet:   'bg-violet-500/15 text-violet-400 border border-violet-500/25',
  success:  'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
  warning:  'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  danger:   'bg-red-500/15 text-red-400 border border-red-500/25',
  outline:  'bg-transparent text-foreground border border-border',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
