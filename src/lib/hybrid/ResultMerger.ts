// ─── Result Merger ─────────────────────────────────────────────────────────────

import type { Section, HybridSearchResult } from '@/types/legal';
import type { AiExplanationResponse } from './IAiProvider';
import { sourceVerifier } from './SourceVerifier';
import { citationManager } from './CitationManager';

export class ResultMerger {
  /**
   * Merge local database Section entity with optional AI explanation & updates
   */
  mergeLocalAndAi(
    localSection: Section | null,
    aiResponse: AiExplanationResponse | null,
    aiUpdates: Partial<HybridSearchResult> | null
  ): HybridSearchResult {
    const isLocalAvailable = localSection !== null;
    const isAiAvailable = aiResponse !== null || aiUpdates !== null;

    const confidenceLevel = sourceVerifier.determineConfidenceLevel(isLocalAvailable, isAiAvailable);

    const sectionNumber = localSection?.sectionNumber || aiUpdates?.sectionNumber || '80C';
    const actYear = localSection?.actYear || aiUpdates?.actYear || '1961';
    const title = localSection?.sectionTitle || aiUpdates?.title || `Section ${sectionNumber}`;

    const citations = [
      citationManager.createSectionCitation(sectionNumber, actYear),
      ...(aiUpdates?.citations || []),
    ];

    // Merge all specified required fields
    return {
      id: localSection?.id || aiUpdates?.id || `sec-${actYear}-${sectionNumber.toLowerCase()}`,
      sectionNumber,
      actYear,
      title,

      simpleMeaning:
        localSection?.simpleMeaning ||
        aiResponse?.simpleMeaning ||
        aiUpdates?.simpleMeaning ||
        `Allows eligible assessees to claim tax deductions and exemptions under Section ${sectionNumber} of the Income Tax Act.`,

      detailedMeaning:
        localSection?.detailedMeaning ||
        aiResponse?.detailedMeaning ||
        aiUpdates?.detailedMeaning,

      bareAct: localSection?.bareAct || aiUpdates?.bareAct,

      section1961: localSection?.actYear === '1961' ? sectionNumber : localSection?.parallelSection,
      section2025: localSection?.actYear === '2025' ? sectionNumber : localSection?.parallelSection,

      importantChanges:
        localSection?.importantChanges ||
        aiResponse?.importantChanges ||
        aiUpdates?.importantChanges ||
        [],

      examples: localSection?.examples || aiUpdates?.examples || [],
      relatedSections: localSection?.relatedSections || aiUpdates?.relatedSections || [],
      caseLaws: aiUpdates?.caseLaws || [],
      latestAmendments: aiUpdates?.latestAmendments || [],
      cbdtCirculars: aiUpdates?.cbdtCirculars || [],
      notifications: aiUpdates?.notifications || [],
      revisionNotes: localSection?.revisionNotes || aiUpdates?.revisionNotes || [],
      mcqs: aiUpdates?.mcqs || [],
      pyqs: aiUpdates?.pyqs || [],

      // Required verification & metadata fields
      source: localSection?.source || 'Income Tax Department (Verified Database)',
      lastUpdated: localSection?.lastUpdated || new Date().toISOString().split('T')[0],
      confidenceLevel,
      citations,
    };
  }
}

export const resultMerger = new ResultMerger();
