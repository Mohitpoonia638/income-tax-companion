'use client';

import Link from 'next/link';
import { Layers, ArrowRight } from 'lucide-react';
import type { ActYear } from '@/types/legal';

interface RelatedSectionsGridProps {
  relatedSections?: string[];
  actYear: ActYear;
  sectionNumber: string;
}

export function RelatedSectionsGrid({ relatedSections = [], actYear, sectionNumber }: RelatedSectionsGridProps) {
  const defaultRelated = relatedSections.length > 0 ? relatedSections : ['80CCC', '80CCD', '10(14)', '115BAC'];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Layers size={18} />
        </div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          Related Sections
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {defaultRelated.map((secNum) => (
          <Link
            key={secNum}
            href={`/acts/${actYear}/${secNum.toLowerCase().replace(/[^a-z0-9]/g, '')}`}
            className="group flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/3 hover:bg-white/6 hover:border-blue-500/30 transition-all duration-200"
          >
            <div>
              <span className="text-xs font-mono font-semibold text-blue-400 block">
                SECTION {secNum}
              </span>
              <span className="text-xs text-muted-foreground line-clamp-1">
                Income Tax Act {actYear}
              </span>
            </div>
            <ArrowRight size={15} className="text-muted-foreground group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
          </Link>
        ))}
      </div>
    </section>
  );
}
