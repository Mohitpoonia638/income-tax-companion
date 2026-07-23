'use client';

import Link from 'next/link';
import { Sparkles, MessageSquare } from 'lucide-react';

interface AskAiFloatingButtonProps {
  sectionNumber: string;
}

export function AskAiFloatingButton({ sectionNumber }: AskAiFloatingButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Link
        href={`/ai-tutor?section=${encodeURIComponent(sectionNumber)}`}
        className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-2xl shadow-blue-500/40 border border-white/20 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        <Sparkles size={18} className="animate-pulse" />
        Ask AI Tutor about Section {sectionNumber}
      </Link>
    </div>
  );
}
