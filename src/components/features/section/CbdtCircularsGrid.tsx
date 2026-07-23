'use client';

import { Bell, ExternalLink } from 'lucide-react';
import type { Circular } from '@/types/legal';
import { Badge } from '@/components/ui/Badge';

interface CbdtCircularsGridProps {
  circulars?: Circular[];
  sectionNumber: string;
}

export function CbdtCircularsGrid({ circulars = [], sectionNumber }: CbdtCircularsGridProps) {
  const hasCirculars = circulars && circulars.length > 0;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
          <Bell size={18} />
        </div>
        <h2 className="text-xl font-semibold text-foreground tracking-tight">
          CBDT Circulars &amp; Notifications
        </h2>
      </div>

      {hasCirculars ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {circulars.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl border border-white/10 bg-white/3 space-y-3 flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="default" className="text-[10px]">
                    {c.category || c.type || 'Circular'} No. {c.circularNumber || c.number}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    {c.issueDate || c.date}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-foreground">{c.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{c.subject}</p>
              </div>

              {(c.pdfUrl || c.url) && (
                <a
                  href={c.pdfUrl || c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:underline pt-2"
                >
                  View Official PDF <ExternalLink size={12} />
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 rounded-2xl border border-white/10 bg-white/3 text-center space-y-2">
          <div className="flex justify-center text-muted-foreground/40">
            <Bell size={24} />
          </div>
          <p className="text-sm font-medium text-foreground/80">No CBDT Circulars Listed</p>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Official CBDT instructions, clarifications, and departmental orders for Section {sectionNumber} will be listed here.
          </p>
        </div>
      )}
    </section>
  );
}
