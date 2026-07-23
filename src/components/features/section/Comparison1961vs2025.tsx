'use client';

import { ArrowRightLeft, Sparkles } from 'lucide-react';
import type { GeminiComparison } from '@/lib/hybrid/schema';

interface Comparison1961vs2025Props {
  sectionNumber: string;
  parallelSection?: string;
  actYear: '1961' | '2025';
  geminiComparison?: GeminiComparison;
}

export function Comparison1961vs2025({
  sectionNumber,
  parallelSection,
  actYear,
  geminiComparison,
}: Comparison1961vs2025Props) {
  const is1961 = actYear === '1961';
  const sec1961 = geminiComparison?.act1961 || (is1961 ? sectionNumber : parallelSection || '—');
  const sec2025 = geminiComparison?.act2025 || (is1961 ? parallelSection || '—' : sectionNumber);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <ArrowRightLeft size={18} />
          </div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            1961 vs 2025 Comparison
          </h2>
        </div>
        {geminiComparison && (
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/30 flex items-center gap-1 font-medium">
            <Sparkles size={11} /> Gemini AI Analysis
          </span>
        )}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white/5 border-b border-white/10 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th scope="col" className="px-6 py-4">Feature / Act</th>
                <th scope="col" className="px-6 py-4 text-blue-400">Income Tax Act, 1961</th>
                <th scope="col" className="px-6 py-4 text-violet-400">Income Tax Act, 2025</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-foreground/90">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Section Number</td>
                <td className="px-6 py-4 font-mono text-blue-300 font-semibold">
                  Section {sec1961}
                </td>
                <td className="px-6 py-4 font-mono text-violet-300 font-semibold">
                  Section {sec2025}
                </td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">Structure &amp; Language</td>
                <td className="px-6 py-4 text-muted-foreground">
                  Traditional legal framing with proviso &amp; explanation clauses
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  Simplified modern drafting, restructured chapters
                </td>
              </tr>
              {geminiComparison?.majorChanges && geminiComparison.majorChanges.length > 0 && (
                <tr className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">Major Structural Changes</td>
                  <td colSpan={2} className="px-6 py-4 text-sm text-foreground/90 space-y-1">
                    <ul className="list-disc list-inside space-y-1 text-xs md:text-sm text-muted-foreground">
                      {geminiComparison.majorChanges.map((change, i) => (
                        <li key={i}>{change}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
