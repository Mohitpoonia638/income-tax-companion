import type { LucideIcon } from 'lucide-react';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
}

export function ComingSoon({
  title = 'Coming Soon',
  description = 'This feature is under active development. Check back soon.',
  icon: Icon = Construction,
}: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      {/* Glow ring */}
      <div className="relative mb-8">
        <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-2xl scale-150" />
        <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30">
          <Icon size={36} className="text-blue-400" strokeWidth={1.5} />
        </div>
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-3">
        {title}
      </h2>
      <p className="text-muted-foreground max-w-md text-sm md:text-base leading-relaxed">
        {description}
      </p>

      {/* Decorative dots */}
      <div className="flex items-center gap-1.5 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-pulse"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
