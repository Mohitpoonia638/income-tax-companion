'use client';

import { Lightbulb, CheckCircle } from 'lucide-react';
import type { SectionExample } from '@/types/legal';

interface PracticalExampleCardProps {
  examples?: SectionExample[];
  sectionNumber: string;
}

export function PracticalExampleCard({ examples, sectionNumber }: PracticalExampleCardProps) {
  const hasExamples = examples && examples.length > 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
          <Lightbulb size={18} />
        </div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          Practical Example
        </h2>
      </div>

      {hasExamples ? (
        <div className="grid grid-cols-1 gap-4">
          {examples.map((ex) => (
            <div
              key={ex.id}
              className="rounded-2xl border border-white/10 bg-white/3 p-6 space-y-4 hover:border-white/20 transition-all duration-200"
            >
              <h3 className="text-base font-semibold text-foreground">{ex.title}</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="font-medium text-foreground/90">Scenario:</p>
                <p className="bg-white/5 p-3.5 rounded-xl border border-white/5 font-mono text-xs md:text-sm">
                  {ex.scenario}
                </p>
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-medium text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle size={15} />
                  Solution &amp; Computation:
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {ex.solution}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-white/3 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">Practical Scenario — Section {sectionNumber}</h3>
            <span className="text-xs px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 font-medium">
              Exam Computation
            </span>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scenario</p>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-sm text-foreground/90 leading-relaxed font-mono">
              An individual assessee computes total income for Assessment Year 2025-26 under Section {sectionNumber}.
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle size={13} /> Practical Solution &amp; Key Rule
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Verify statutory capping limits, valid proof of deposit/expenditure, and tax regime election before claiming final deductions on total income.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
