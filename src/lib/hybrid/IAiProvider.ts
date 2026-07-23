// ─── AI Provider Interface Contract ──────────────────────────────────────────

import type { HybridSearchResult } from '@/types/legal';

export interface AiPromptOptions {
  query: string;
  sectionNumber?: string;
  actYear?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AiExplanationResponse {
  simpleMeaning?: string;
  detailedMeaning?: string;
  importantChanges?: string[];
  suggestedKeywords?: string[];
  rawText?: string;
  confidenceScore?: number; // 0-100
}

export interface IAiProvider {
  readonly providerId: string;
  readonly isAvailable: boolean;

  /**
   * Generate student-friendly explanation or legal summary
   */
  explainSection(options: AiPromptOptions): Promise<AiExplanationResponse | null>;

  /**
   * Fetch latest legal updates / case laws / circulars via AI search
   */
  fetchLatestUpdates(sectionNumber: string): Promise<Partial<HybridSearchResult> | null>;
}

// Default provider when no AI API key is attached
export class NullAiProvider implements IAiProvider {
  readonly providerId = 'null-ai-provider';
  readonly isAvailable = false;

  async explainSection(_options: AiPromptOptions): Promise<AiExplanationResponse | null> {
    return null;
  }

  async fetchLatestUpdates(_sectionNumber: string): Promise<Partial<HybridSearchResult> | null> {
    return null;
  }
}
