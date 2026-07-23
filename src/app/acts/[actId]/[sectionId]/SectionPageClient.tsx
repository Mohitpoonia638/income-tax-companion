'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { ActYear, HybridSearchResult } from '@/types/legal';
import { hybridSearchService } from '@/services/HybridSearchService';
import {
  SectionHeader,
  OneLineMeaning,
  SimpleExplanation,
  PracticalExampleCard,
  Comparison1961vs2025,
  ImportantChangesTimeline,
  RelatedSectionsGrid,
  CaseLawsTimeline,
  CbdtCircularsGrid,
  RevisionNotesSection,
  AskAiFloatingButton,
  BareActViewer,
  CollapsibleCard,
  SectionFaqCard,
  AskAiModule,
  SectionSkeleton,
  type ViewMode,
} from '@/components/features/section';

import {
  BookOpen,
  FileText,
  Lightbulb,
  ArrowRightLeft,
  History,
  Scale,
  Bell,
  BookmarkCheck,
  AlertCircle,
  RotateCw,
  Clock,
} from 'lucide-react';
// Note: Clock kept for the rate-limit icon

interface SectionPageClientProps {
  actId: string;
  sectionId: string;
}

export function SectionPageClient({ actId, sectionId }: SectionPageClientProps) {
  const [mode, setMode] = useState<ViewMode>('student');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [hybridResult, setHybridResult] = useState<HybridSearchResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);

  // Prevents the double-invocation of useEffect in React Strict Mode (dev only).
  // In production React only mounts once, so this ref has no effect there.
  const hasFetchedRef = useRef(false);

  const parsedActYear: ActYear = actId === '2025' ? '2025' : '1961';
  const cleanSectionNumber = sectionId.toUpperCase().trim();

  const fetchSectionData = useCallback(() => {
    setLoading(true);
    setError(null);
    setIsRateLimited(false);

    hybridSearchService
      .searchSectionWithMeta(cleanSectionNumber, parsedActYear)
      .then((result) => {
        if (result.data) {
          setHybridResult(result.data);
        } else if (result.isRateLimited) {
          setIsRateLimited(true);
          setError('Gemini API rate limit reached. Use Retry Now when ready.');
        } else {
          setError('Unable to generate study notes. Please try again.');
        }
      })
      .catch(() => {
        setError('Unable to generate study notes. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [cleanSectionNumber, parsedActYear]);

  // Fire exactly once per mount, guarded against React Strict Mode double-invoke.
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchSectionData();
  }, [fetchSectionData]);

  if (loading) {
    return <SectionSkeleton />;
  }

  // ── Rate Limit State ─────────────────────────────────────────────────────────
  if (isRateLimited) {
    return (
      <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full p-8 rounded-2xl border border-amber-500/30 bg-amber-500/5 backdrop-blur-md text-center space-y-6 shadow-2xl shadow-amber-950/20">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
            <Clock size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              Gemini API rate limit reached
            </h2>
            <p className="text-sm text-muted-foreground">
              The free-tier quota for <span className="text-amber-300 font-semibold">Section {cleanSectionNumber}</span> is temporarily exhausted. Wait a moment, then click Retry Now.
            </p>
          </div>
          <button
            onClick={fetchSectionData}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600/80 hover:bg-amber-500 text-white text-sm font-semibold transition-all shadow-lg shadow-amber-500/20"
          >
            <RotateCw size={16} />
            Retry Now
          </button>
        </div>
      </div>
    );
  }

  // ── Hard Error State ─────────────────────────────────────────────────────────
  if (error || !hybridResult) {
    return (
      <div className="relative min-h-[70vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full p-8 rounded-2xl border border-rose-500/30 bg-rose-500/5 backdrop-blur-md text-center space-y-5 shadow-2xl shadow-rose-950/20">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
            <AlertCircle size={28} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">
              Unable to generate study notes.
            </h2>
            <p className="text-sm text-muted-foreground">
              We could not generate AI legal study notes for Section {cleanSectionNumber}. Please verify your network or Gemini API settings.
            </p>
          </div>
          <button
            onClick={fetchSectionData}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-all shadow-lg shadow-blue-500/20"
          >
            <RotateCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Gemini AI Section Payload Mapping
  const sectionNumber = hybridResult.sectionNumber || cleanSectionNumber;
  const sectionTitle = hybridResult.title || `Section ${sectionNumber}`;
  const simpleMeaningText = hybridResult.simpleMeaning || '';
  const detailedMeaningText = hybridResult.detailedMeaning || simpleMeaningText;
  const bareActText = hybridResult.bareAct || '';
  const examplesList = hybridResult.examples || [];
  const changesList = hybridResult.importantChanges || [];
  const caseLawsList = hybridResult.caseLaws || [];
  const faqsList = hybridResult.faqs || [];
  const relatedSectionsList = hybridResult.relatedSections || [];
  const revisionNotesList = hybridResult.revisionNotes || [];

  const geminiComparison = {
    act1961: hybridResult.section1961 || sectionNumber,
    act2025: hybridResult.section2025 || 'No direct corresponding provision currently exists.',
    majorChanges: changesList,
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-24">
      {/* Background gradient mesh */}
      <div className="absolute inset-0 gradient-mesh pointer-events-none" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* 1. SECTION HEADER */}
        <SectionHeader
          sectionNumber={sectionNumber}
          sectionTitle={sectionTitle}
          actYear={hybridResult.actYear}
          chapter="Income Tax Act"
          status="active"
          lastUpdated={hybridResult.lastUpdated}
          confidenceLevel={hybridResult.confidenceLevel}
          mode={mode}
          onModeChange={setMode}
          isBookmarked={isBookmarked}
          onToggleBookmark={() => setIsBookmarked(!isBookmarked)}
        />

        {/* 2. QUICK SUMMARY (Shown FIRST) */}
        <OneLineMeaning
          text={simpleMeaningText}
          sectionNumber={sectionNumber}
        />

        {/* 3. BARE ACT (Collapsible Card) */}
        <CollapsibleCard
          id="module-bare-act"
          title={`Bare Act — Section ${sectionNumber}`}
          icon={FileText}
          defaultOpen={mode === 'professional'}
          badge={
            <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 font-mono">
              Statutory Text
            </span>
          }
        >
          <BareActViewer
            bareAct={bareActText}
            sectionNumber={sectionNumber}
          />
        </CollapsibleCard>

        {/* 4. SIMPLE EXPLANATION */}
        <CollapsibleCard
          id="module-simple-explanation"
          title="Simple Explanation"
          icon={BookOpen}
          defaultOpen={mode === 'student'}
        >
          <SimpleExplanation
            content={detailedMeaningText || simpleMeaningText}
            sectionNumber={sectionNumber}
          />
        </CollapsibleCard>

        {/* 5. PRACTICAL EXAMPLE */}
        <CollapsibleCard
          id="module-practical-example"
          title="Practical Example"
          icon={Lightbulb}
          defaultOpen={true}
        >
          <PracticalExampleCard
            examples={examplesList}
            sectionNumber={sectionNumber}
          />
        </CollapsibleCard>

        {/* 6. 1961 ↔ 2025 COMPARISON */}
        <CollapsibleCard
          id="module-comparison"
          title="1961 ↔ 2025 Comparison"
          icon={ArrowRightLeft}
          defaultOpen={true}
        >
          <Comparison1961vs2025
            sectionNumber={sectionNumber}
            parallelSection={geminiComparison.act2025}
            actYear={hybridResult.actYear}
            geminiComparison={geminiComparison}
          />
        </CollapsibleCard>

        {/* 7. IMPORTANT CHANGES */}
        <CollapsibleCard
          id="module-important-changes"
          title="Important Changes"
          icon={History}
          defaultOpen={true}
        >
          <ImportantChangesTimeline
            changes={changesList}
            sectionNumber={sectionNumber}
          />
        </CollapsibleCard>

        {/* 8. CASE LAWS */}
        <CollapsibleCard
          id="module-case-laws"
          title="Case Laws & Judgments"
          icon={Scale}
          defaultOpen={true}
          badge={
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 font-mono">
              {caseLawsList.length} Judgments
            </span>
          }
        >
          <CaseLawsTimeline
            caseLaws={caseLawsList}
            sectionNumber={sectionNumber}
          />
        </CollapsibleCard>

        {/* 9. CBDT CIRCULARS */}
        <CollapsibleCard
          id="module-cbdt-circulars"
          title="CBDT Circulars & Instructions"
          icon={Bell}
          defaultOpen={true}
          badge={
            <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-mono">
              0 Circulars
            </span>
          }
        >
          <CbdtCircularsGrid
            circulars={[]}
            sectionNumber={sectionNumber}
          />
        </CollapsibleCard>

        {/* 10. REVISION NOTES */}
        <CollapsibleCard
          id="module-revision-notes"
          title="CA Exam Revision Notes & Mnemonics"
          icon={BookmarkCheck}
          defaultOpen={true}
        >
          <RevisionNotesSection
            revisionNotes={revisionNotesList}
            sectionNumber={sectionNumber}
          />
        </CollapsibleCard>

        {/* 11. FREQUENTLY ASKED QUESTIONS */}
        <SectionFaqCard
          faqs={faqsList}
          sectionNumber={sectionNumber}
        />

        {/* 12. ASK AI */}
        <AskAiModule
          sectionNumber={sectionNumber}
        />

        {/* 13. RELATED SECTIONS */}
        <RelatedSectionsGrid
          relatedSections={relatedSectionsList}
          actYear={hybridResult.actYear}
          sectionNumber={sectionNumber}
        />
      </div>

      {/* Floating Ask AI Shortcut Button */}
      <AskAiFloatingButton
        sectionNumber={sectionNumber}
      />
    </div>
  );
}
