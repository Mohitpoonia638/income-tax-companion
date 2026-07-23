import type { Metadata } from 'next';
import { SearchContainer } from '@/components/features/search/SearchContainer';

export const metadata: Metadata = {
  title: 'Search',
  description:
    'Full-text search across Income Tax Act sections, CBDT circulars, notifications, and case laws.',
};

export default function SearchPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-mesh pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Page heading */}
        <div className="mb-7">
          <span className="inline-block mb-3 px-3 py-1 text-xs font-semibold rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/25 uppercase tracking-wider">
            Full-Text Search
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
            Search
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground max-w-xl">
            Search across Income Tax Act sections, CBDT circulars, notifications, and case laws.
          </p>
        </div>

        {/* Unified Search in page mode — reads ?q= URL param automatically */}
        <SearchContainer mode="page" />
      </div>
    </div>
  );
}
