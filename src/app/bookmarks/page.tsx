import type { Metadata } from 'next';
import { Bookmark } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { ComingSoon } from '@/components/shared/ComingSoon';

export const metadata: Metadata = {
  title: 'Bookmarks',
  description:
    'Save and organise Income Tax Act sections, CBDT circulars, and case laws for later review.',
};

export default function BookmarksPage() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)]">
      <div className="absolute inset-0 gradient-mesh pointer-events-none" aria-hidden="true" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <PageHeader
          title="Bookmarks"
          badge="Your Library"
          description="Save sections, circulars, notifications, and case laws to personal collections for exam revision."
        />
        <ComingSoon
          icon={Bookmark}
          title="Bookmarks are coming soon"
          description="Create personal collections, add notes to saved items, and organise your study material across ITA 1961, ITA 2025, CBDT circulars, and case laws."
        />
      </div>
    </div>
  );
}
