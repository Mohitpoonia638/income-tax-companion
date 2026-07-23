import { Scale } from 'lucide-react';
import Link from 'next/link';
import { APP_NAME } from '@/lib/constants';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeMap = {
  sm: { icon: 18, text: 'text-base', sub: 'text-[10px]' },
  md: { icon: 24, text: 'text-lg',   sub: 'text-xs'    },
  lg: { icon: 36, text: 'text-2xl',  sub: 'text-sm'    },
};

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const s = sizeMap[size];
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 group select-none"
      aria-label={APP_NAME}
    >
      {/* Icon mark */}
      <div className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 p-2 shadow-lg shadow-blue-500/30 transition-transform duration-200 group-hover:scale-105">
        <Scale size={s.icon} className="text-white" strokeWidth={1.8} />
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span
            className={`${s.text} font-bold tracking-tight text-foreground bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent`}
          >
            {APP_NAME}
          </span>
          <span className={`${s.sub} text-muted-foreground font-medium mt-0.5`}>
            CA Study Companion
          </span>
        </div>
      )}
    </Link>
  );
}
