'use client';

import { Skeleton } from '@/components/ui/Skeleton';

export function SectionSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-4 pb-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40 rounded-xl" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24 rounded-xl" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-10 w-3/4 rounded-xl" />
      </div>

      {/* Quick Summary Banner Skeleton */}
      <Skeleton className="h-28 w-full rounded-2xl" />

      {/* Modular Cards Skeleton */}
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="p-6 rounded-2xl border border-white/10 bg-white/3 space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-xl" />
            <Skeleton className="h-6 w-48 rounded-lg" />
          </div>
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>
      ))}
    </div>
  );
}
