import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: 'blue' | 'violet' | 'amber' | 'emerald' | 'rose' | 'sky';
  badge?: string;
}

const colorMap: Record<QuickActionCardProps['color'], {
  icon: string;
  glow: string;
  border: string;
  hover: string;
  arrow: string;
}> = {
  blue:    { icon: 'from-blue-500 to-blue-600',    glow: 'shadow-blue-500/20',   border: 'hover:border-blue-500/40',    hover: 'hover:shadow-blue-500/10',  arrow: 'text-blue-400'    },
  violet:  { icon: 'from-violet-500 to-violet-600', glow: 'shadow-violet-500/20', border: 'hover:border-violet-500/40',  hover: 'hover:shadow-violet-500/10',arrow: 'text-violet-400'  },
  amber:   { icon: 'from-amber-500 to-orange-500',  glow: 'shadow-amber-500/20',  border: 'hover:border-amber-500/40',   hover: 'hover:shadow-amber-500/10', arrow: 'text-amber-400'   },
  emerald: { icon: 'from-emerald-500 to-teal-500',  glow: 'shadow-emerald-500/20',border: 'hover:border-emerald-500/40', hover: 'hover:shadow-emerald-500/10',arrow: 'text-emerald-400'},
  rose:    { icon: 'from-rose-500 to-pink-500',     glow: 'shadow-rose-500/20',   border: 'hover:border-rose-500/40',    hover: 'hover:shadow-rose-500/10',  arrow: 'text-rose-400'    },
  sky:     { icon: 'from-sky-500 to-cyan-500',      glow: 'shadow-sky-500/20',    border: 'hover:border-sky-500/40',     hover: 'hover:shadow-sky-500/10',   arrow: 'text-sky-400'     },
};

export function QuickActionCard({
  title, description, href, icon: Icon, color, badge,
}: QuickActionCardProps) {
  const c = colorMap[color];

  return (
    <Link
      href={href}
      className={cn(
        'group relative flex flex-col gap-4 p-5 rounded-2xl',
        'border border-white/10 bg-white/3 backdrop-blur-sm',
        'transition-all duration-300 hover:-translate-y-1',
        'hover:bg-white/6 hover:shadow-xl',
        c.border, c.hover
      )}
    >
      {/* Icon */}
      <div className={cn(
        'flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br shadow-lg',
        c.icon, c.glow
      )}>
        <Icon size={20} className="text-white" strokeWidth={1.8} />
      </div>

      {/* Text */}
      <div className="space-y-1 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {badge && (
            <Badge variant={badge === 'New' ? 'primary' : 'default'} className="text-[10px]">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {/* Arrow */}
      <div className={cn(
        'flex items-center gap-1 text-xs font-medium transition-all duration-200',
        'opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1',
        c.arrow
      )}>
        Explore <ArrowRight size={12} />
      </div>
    </Link>
  );
}
