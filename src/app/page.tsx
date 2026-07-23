import type { Metadata } from 'next';
import { SearchContainer } from '@/components/features/search/SearchContainer';
import { QuickActionCard } from '@/components/features/home/QuickActionCard';
import { Logo } from '@/components/shared/Logo';
import { EXAMPLE_SEARCHES, QUICK_ACTIONS, APP_TAGLINE } from '@/lib/constants';
import { Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Income Tax Companion — Search Sections, CBDT Circulars & Case Laws',
  description:
    'Search any section, keyword or topic from the Income Tax Act 1961 & 2025. Built for CA students.',
};

export default function HomePage() {
  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      {/* ── Background mesh gradient ── */}
      <div className="absolute inset-0 gradient-mesh pointer-events-none" aria-hidden="true" />

      {/* ── Decorative grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(rgb(255 255 255) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
        aria-hidden="true"
      />

      <div className="relative flex-1 flex flex-col">
        {/* ════════════════════════════════════════════
            HERO SECTION
        ════════════════════════════════════════════ */}
        <section className="flex flex-col items-center justify-center px-4 sm:px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
          {/* Pill badge */}
          <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-semibold uppercase tracking-widest shadow-lg shadow-blue-500/10">
            <Sparkles size={11} className="animate-pulse" />
            Income Tax Act 1961 &amp; 2025
          </div>

          {/* Logo mark */}
          <div className="mb-6 flex justify-center">
            <Logo size="lg" showText={false} />
          </div>

          {/* Heading */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.1]"
            style={{ fontFamily: 'var(--font-outfit)' }}
          >
            Income Tax{' '}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Companion
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-muted-foreground text-base sm:text-lg md:text-xl max-w-xl leading-relaxed">
            {APP_TAGLINE}
          </p>

          {/* ── Unified Search (hero mode) ── */}
          <div className="mt-10 w-full max-w-2xl">
            <SearchContainer
              mode="hero"
              examples={EXAMPLE_SEARCHES}
            />
          </div>

          {/* Stats strip */}
          <div className="mt-12 flex items-center justify-center gap-8 flex-wrap">
            {[
              { label: 'Sections',   value: '298+' },
              { label: 'ITA 1961',   value: '✓'    },
              { label: 'ITA 2025',   value: 'New'  },
              { label: 'CBDT Items', value: '500+' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ════════════════════════════════════════════
            QUICK ACTIONS
        ════════════════════════════════════════════ */}
        <section className="px-4 sm:px-6 pb-20 max-w-7xl mx-auto w-full">
          <div className="mb-6 flex flex-col items-center gap-1 text-center">
            <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
            <p className="text-sm text-muted-foreground">
              Everything a CA student needs in one place
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {QUICK_ACTIONS.map((action) => (
              <QuickActionCard key={action.id} {...action} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
