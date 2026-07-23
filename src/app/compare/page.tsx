import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/PageHeader';
import { CompareClient } from './CompareClient';

export const metadata: Metadata = {
  title: 'Compare Acts — Income Tax Companion',
  description:
    'Compare Income Tax Act 1961 and Income Tax Act 2025 side-by-side with parallel section mapping and AI diff analysis.',
};

export default function ComparePage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 gradient-mesh pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <PageHeader
          title="Compare Acts"
          badge="ITA 1961 vs ITA 2025"
          description="Compare Income Tax Act 1961 and Income Tax Act 2025 sections side-by-side with parallel mapping, statutory structural diffs, and live Gemini AI comparison analysis."
        />
        <CompareClient />
      </div>
    </div>
  );
}
