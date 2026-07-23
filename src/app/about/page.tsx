import type { Metadata } from 'next';
import { Scale, Code2, BookOpen, GitCompare, Sparkles, Bell, Gavel, FileText } from 'lucide-react';
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants';
import { ACT_REGISTRY } from '@/lib/config';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'About',
  description:
    'About Income Tax Companion — a comprehensive legal research platform for CA students.',
};

const plannedFeatures = [
  { icon: BookOpen,   label: 'Bare Act Viewer',           desc: 'Section-by-section reader for ITA 1961 & 2025',       status: 'planned' as const },
  { icon: GitCompare, label: 'Parallel Section Compare',  desc: 'Side-by-side ITA 1961 ↔ ITA 2025 mapping',            status: 'planned' as const },
  { icon: FileText,   label: 'Full-Text Search',          desc: 'Search across sections, circulars, and case laws',     status: 'planned' as const },
  { icon: Bell,       label: 'CBDT Circulars',            desc: 'Latest circulars and notifications',                   status: 'planned' as const },
  { icon: Gavel,      label: 'Case Laws',                 desc: 'Supreme Court & High Court judgments',                 status: 'planned' as const },
  { icon: Sparkles,   label: 'AI Tutor',                  desc: 'Plain-English explanations and exam prep',             status: 'planned' as const },
];

const techStack = [
  { name: 'Next.js 16',     desc: 'App Router framework'     },
  { name: 'React 19',       desc: 'UI rendering'              },
  { name: 'TypeScript',     desc: 'Full type safety'          },
  { name: 'Tailwind CSS v4',desc: 'Utility-first styling'     },
  { name: 'next-themes',    desc: 'Dark/light mode'           },
  { name: 'Lucide React',   desc: 'Icon library'              },
];

export default function AboutPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 gradient-mesh pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-xl shadow-blue-500/30">
              <Scale size={28} className="text-white" strokeWidth={1.8} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-outfit)' }}>
            About {APP_NAME}
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            {APP_DESCRIPTION}
          </p>
        </div>

        {/* Acts Supported */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Acts Covered</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.values(ACT_REGISTRY).map((act) => (
              <Card key={act.id} glass hover>
                <CardContent className="flex items-start gap-4">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${
                    act.color === 'blue'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-violet-500/20 text-violet-400'
                  }`}>
                    <BookOpen size={18} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground">{act.title}</h3>
                      {act.id === '2025' && (
                        <Badge variant="primary" className="text-[10px]">New</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{act.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Planned Features */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Planned Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {plannedFeatures.map((f) => (
              <div
                key={f.label}
                className="flex items-start gap-3 p-4 rounded-xl border border-white/10 bg-white/3"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/15 text-blue-400 shrink-0">
                  <f.icon size={15} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-foreground mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {techStack.map((t) => (
              <div
                key={t.name}
                title={t.desc}
                className="px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors"
              >
                {t.name}
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section>
          <Card glass>
            <CardContent>
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="text-amber-400 font-semibold">⚠ Disclaimer:</span>{' '}
                {APP_NAME} is an educational tool intended to help CA students and tax professionals
                study the Income Tax Act. It does not constitute legal advice. Always consult a
                qualified tax professional for legal matters. Official texts are available at{' '}
                <a
                  href="https://www.incometax.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  incometax.gov.in
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </section>

        {/* GitHub */}
        <div className="mt-10 flex justify-center">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm text-muted-foreground hover:text-foreground hover:border-white/20 hover:bg-white/10 transition-all duration-200"
          >
            <Code2 size={16} />
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
