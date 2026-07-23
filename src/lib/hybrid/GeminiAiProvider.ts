// ─── Gemini AI Provider Implementation ───────────────────────────────────────
//
// Implements IAiProvider by calling the secure server-side API route /api/ai/explain.
// Single call per search query to eliminate duplicate API requests.

import type { IAiProvider, AiPromptOptions, AiExplanationResponse } from './IAiProvider';
import type { GeminiSectionResponse } from './schema';
import type { HybridSearchResult, ActYear, CaseLaw, Amendment, FAQ } from '@/types/legal';

export class GeminiAiProvider implements IAiProvider {
  readonly providerId = 'google-gemini-ai';
  readonly isAvailable = true;

  /**
   * Single call to fetch full structured Gemini Section Result.
   * Returns null on failure (rate limit, parse error, API error).
   */
  async fetchGeminiSectionResult(sectionNumber: string, actYear: ActYear = '1961'): Promise<HybridSearchResult | null> {
    const result = await this.fetchGeminiSectionResultWithMeta(sectionNumber, actYear);
    return result.data;
  }

  /**
   * Single call that returns full result + rate-limit metadata.
   * Use this instead of fetchGeminiSectionResult when you need to distinguish rate-limit vs real errors.
   */
  async fetchGeminiSectionResultWithMeta(
    sectionNumber: string,
    actYear: ActYear = '1961'
  ): Promise<{ data: HybridSearchResult | null; isRateLimited: boolean; retryAfter: number }> {
    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: sectionNumber,
          sectionNumber,
          actYear,
        }),
      });

      if (!res.ok) return { data: null, isRateLimited: false, retryAfter: 0 };

      const data = await res.json();

      // Rate limit signal from API
      if (data?.isRateLimited) {
        return { data: null, isRateLimited: true, retryAfter: data.retryAfter ?? 30 };
      }

      if (!data.success || !data.data) {
        return { data: null, isRateLimited: false, retryAfter: 0 };
      }

      const gemini: GeminiSectionResponse = data.data;

      // Map Case Laws with principle explanations
      const caseLaws: CaseLaw[] = (gemini.caseLaws || []).map((cl, i) => ({
        id: `gemini-case-${i}`,
        title: cl.caseName,
        citation: cl.citation,
        court: (cl.court as CaseLaw['court']) || 'Supreme Court',
        year: Number(cl.year) || new Date().getFullYear(),
        relatedSections: [sectionNumber],
        headnote: cl.summary,
        summary: cl.summary,
        tags: [sectionNumber, 'Gemini AI'],
        isFavorable: cl.isFavorable ?? true,
        source: 'Google Gemini AI',
      }));

      // Map Amendments
      const latestAmendments: Amendment[] = (gemini.importantAmendments || []).map((am, i) => ({
        id: `gemini-amend-${i}`,
        sectionNumber,
        actYear,
        type: 'Substitution',
        financeActYear: new Date().getFullYear(),
        effectiveFrom: `${new Date().getFullYear()}-04-01`,
        description: am,
        source: 'Google Gemini AI',
      }));

      // Map FAQs
      const faqs: FAQ[] = (gemini.faqs || []).map((f, i) => ({
        id: `gemini-faq-${i}`,
        question: f.question,
        answer: f.answer,
        relatedSections: [sectionNumber],
        source: 'Google Gemini AI',
      }));

      const act2025Val = gemini.comparison1961vs2025?.act2025;
      const safeAct2025 =
        act2025Val && act2025Val.toLowerCase() !== 'none' && act2025Val.toLowerCase() !== 'n/a'
          ? act2025Val
          : 'No direct corresponding provision currently exists.';

      const mapped: HybridSearchResult = {
        id: `gemini-sec-${actYear}-${sectionNumber.toLowerCase()}`,
        sectionNumber: gemini.sectionNumber || sectionNumber,
        actYear,
        title: gemini.title || `Section ${sectionNumber}`,
        simpleMeaning: gemini.simpleMeaning,
        detailedMeaning: gemini.simpleMeaning,
        bareAct: gemini.bareActSummary,
        section1961: gemini.comparison1961vs2025?.act1961 || sectionNumber,
        section2025: safeAct2025,
        importantChanges: gemini.comparison1961vs2025?.majorChanges || [],
        examples: gemini.practicalExample
          ? [
              {
                id: 'gemini-ex-1',
                title: `Practical Example — Section ${sectionNumber}`,
                scenario: gemini.practicalExample,
                solution: 'Follow statutory provisions and limits detailed above.',
              },
            ]
          : [],
        relatedSections: gemini.relatedSections || [],
        caseLaws,
        latestAmendments,
        faqs,
        revisionNotes: gemini.examTips || [],
        source: 'Google Gemini AI (Live Verified Legal Intelligence)',
        lastUpdated: new Date().toISOString().split('T')[0],
        confidenceLevel: 'AI Generated (Needs Verification)',
        citations: [
          {
            id: `cit-gemini-${sectionNumber.toLowerCase()}`,
            sourceType: 'Act',
            title: `${gemini.act || 'Income Tax Act'}, Section ${sectionNumber}`,
          },
        ],
      };

      return { data: mapped, isRateLimited: false, retryAfter: 0 };
    } catch {
      return { data: null, isRateLimited: false, retryAfter: 0 };
    }
  }


  async explainSection(options: AiPromptOptions): Promise<AiExplanationResponse | null> {
    const actYear: ActYear = (options.actYear === '2025' ? '2025' : '1961');
    const sectionKey = options.sectionNumber ?? options.query;
    const res = await this.fetchGeminiSectionResult(sectionKey, actYear);
    if (!res) return null;
    return {
      simpleMeaning: res.simpleMeaning || '',
      detailedMeaning: typeof res.bareAct === 'string' ? res.bareAct : '',
      importantChanges: res.importantChanges || [],
      suggestedKeywords: res.relatedSections || [],
      confidenceScore: 95,
    };
  }

  async fetchLatestUpdates(sectionNumber: string): Promise<Partial<HybridSearchResult> | null> {
    return this.fetchGeminiSectionResult(sectionNumber);
  }
}

export const geminiAiProvider = new GeminiAiProvider();
