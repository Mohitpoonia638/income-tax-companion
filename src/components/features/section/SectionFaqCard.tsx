'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { FAQ } from '@/types/legal';
import { CollapsibleCard } from './CollapsibleCard';

interface SectionFaqCardProps {
  faqs?: FAQ[];
  sectionNumber: string;
}

export function SectionFaqCard({ faqs = [], sectionNumber }: SectionFaqCardProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const defaultFaqs: FAQ[] = [
    {
      id: 'faq-1',
      question: `What is the maximum monetary cap under Section ${sectionNumber}?`,
      answer: `Under Section ${sectionNumber}, statutory deduction/exemption limits apply based on assessee category. Refer to specific limits and tax regime election guidelines for exact AY computation.`,
      relatedSections: [sectionNumber],
    },
    {
      id: 'faq-2',
      question: `Is Section ${sectionNumber} applicable under the New Default Tax Regime (Sec 115BAC)?`,
      answer: `Under the New Default Tax Regime (Section 115BAC), specified deductions under Chapter VI-A (including Section 80C) are generally restricted unless explicitly allowed by the statute.`,
      relatedSections: [sectionNumber],
    },
    {
      id: 'faq-3',
      question: `What documents or deposit proofs are required for claiming Section ${sectionNumber}?`,
      answer: `Assessees should maintain valid deposit receipts, insurance premium certificates, or bank statements as proof of investment before filing ROI under Section 139(1).`,
      relatedSections: [sectionNumber],
    },
  ];

  const items = faqs.length > 0 ? faqs : defaultFaqs;

  return (
    <CollapsibleCard
      id="module-faqs"
      title="Frequently Asked Questions"
      icon={HelpCircle}
      badge={<span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-mono">{items.length} FAQs</span>}
    >
      <div className="space-y-3 pt-2">
        {items.map((faq, index) => {
          const isOpen = openFaqIndex === index;
          return (
            <div
              key={faq.id}
              className="rounded-xl border border-white/8 bg-white/3 overflow-hidden transition-all duration-150"
            >
              <button
                type="button"
                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-white/5"
              >
                <span className="text-sm font-semibold text-foreground/90 leading-snug">
                  {faq.question}
                </span>
                <span className="text-muted-foreground/60 shrink-0">
                  {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 text-xs md:text-sm text-muted-foreground leading-relaxed border-t border-white/5 bg-white/2">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </CollapsibleCard>
  );
}
