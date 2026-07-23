import { Suspense } from 'react';
import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/PageHeader';
import { AiTutorClient } from './AiTutorClient';

export const metadata: Metadata = {
  title: 'AI Tutor — Income Tax Companion',
  description:
    'Ask any income tax question and get plain-English explanations, worked examples, and case law citations powered by Google Gemini AI.',
};

export default function AiTutorPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 gradient-mesh pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <PageHeader
          title="AI Legal Tutor"
          badge="Google Gemini AI"
          description="Ask any income tax question, section number, or tax topic to receive live, plain-English explanations, statutory summaries, practical exam scenarios, and landmark case law citations."
        />
        <Suspense fallback={<div className="p-8 rounded-2xl bg-white/3 animate-pulse h-40" />}>
          <AiTutorClient />
        </Suspense>
      </div>
    </div>
  );
}
