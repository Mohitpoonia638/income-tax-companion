// ─── Gemini Primary Search Service ─────────────────────────────────────────────
//
// Single-pass Gemini AI search service:
//   1. Check Cache (Only cached Gemini AI responses)
//   2. Single Gemini API Call (/api/ai/explain)
//   3. Structured JSON Parsing & Validation
//   4. Store Gemini response in Cache
//   5. Return Gemini AI payload (or null if API fails — NO demo data fallback)

import type { HybridSearchResult, ActYear } from '@/types/legal';
import { cacheManager } from '@/lib/hybrid/CacheManager';
import { geminiAiProvider, GeminiAiProvider } from '@/lib/hybrid/GeminiAiProvider';

export interface SectionSearchResult {
  data: HybridSearchResult | null;
  isRateLimited: boolean;
  retryAfter: number;
  error?: string;
}

export class HybridSearchService {
  private aiProvider: GeminiAiProvider;

  constructor(provider: GeminiAiProvider = geminiAiProvider) {
    this.aiProvider = provider;
  }

  /**
   * Execute Gemini AI Search Workflow (Single API call, zero demo data fallback).
   * Returns a typed result including rate-limit metadata.
   */
  async searchSectionWithMeta(
    sectionNumber: string,
    actYear: ActYear = '1961'
  ): Promise<SectionSearchResult> {
    const cacheKey = `gemini_sec_${actYear}_${sectionNumber.toLowerCase()}`;

    // 1. Check Cache (Only valid Gemini responses)
    const cached = cacheManager.get<HybridSearchResult>(cacheKey);
    if (cached) {
      return { data: cached, isRateLimited: false, retryAfter: 0 };
    }

    // 2. Execute ONE Gemini API Request — returns data + rate-limit metadata
    try {
      const result = await this.aiProvider.fetchGeminiSectionResultWithMeta(sectionNumber, actYear);

      if (result.data) {
        cacheManager.set(cacheKey, result.data);
      }

      return {
        data: result.data,
        isRateLimited: result.isRateLimited,
        retryAfter: result.retryAfter,
      };
    } catch (err) {
      return {
        data: null,
        isRateLimited: false,
        retryAfter: 0,
        error: err instanceof Error ? err.message : 'Network error',
      };
    }
  }



  /**
   * Legacy compatibility: searchSection returns HybridSearchResult | null.
   */
  async searchSection(sectionNumber: string, actYear: ActYear = '1961'): Promise<HybridSearchResult | null> {
    const cacheKey = `gemini_sec_${actYear}_${sectionNumber.toLowerCase()}`;

    // 1. Check Cache (Only valid Gemini responses)
    const cached = cacheManager.get<HybridSearchResult>(cacheKey);
    if (cached) {
      return cached;
    }

    // 2. Execute SINGLE Gemini API Request
    const geminiResult = await this.aiProvider.fetchGeminiSectionResult(sectionNumber, actYear);

    // 3. Store in Cache if valid Gemini response
    if (geminiResult) {
      cacheManager.set(cacheKey, geminiResult);
      return geminiResult;
    }

    // 4. Return null on API error (No demo data fallback!)
    return null;
  }
}

export const hybridSearchService = new HybridSearchService();

