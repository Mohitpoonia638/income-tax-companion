// ─── Source Verifier ───────────────────────────────────────────────────────────

import type { ConfidenceLevel, HybridSearchResult } from '@/types/legal';

export class SourceVerifier {
  /**
   * Determine confidence level based on data source availability & AI enrichment state
   */
  determineConfidenceLevel(
    isLocalVerified: boolean,
    hasAiAugmentation: boolean
  ): ConfidenceLevel {
    if (isLocalVerified && !hasAiAugmentation) {
      return 'Verified';
    }
    if (isLocalVerified && hasAiAugmentation) {
      return 'Verified + AI Summary';
    }
    return 'AI Generated (Needs Verification)';
  }

  /**
   * Verify source authenticity & tag appropriate confidence badge
   */
  verifyResult(result: Partial<HybridSearchResult>, isFromLocalDb: boolean, isAiEnhanced: boolean): ConfidenceLevel {
    return this.determineConfidenceLevel(isFromLocalDb, isAiEnhanced);
  }

  /**
   * Get human readable explanation of confidence badge
   */
  getConfidenceDescription(level: ConfidenceLevel): string {
    switch (level) {
      case 'Verified':
        return 'Curated directly from verified Income Tax statutory database.';
      case 'Verified + AI Summary':
        return 'Statutory data verified from local database, enhanced with AI summary.';
      case 'AI Generated (Needs Verification)':
        return 'Retrieved via AI engine; pending formal manual statutory verification.';
    }
  }
}

export const sourceVerifier = new SourceVerifier();
