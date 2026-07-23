// ─── Search Engine ────────────────────────────────────────────────────────────
//
// Client-side inverted index search engine.
//
// Design:
//   - Inverted index: token → Set<docId>
//   - Section number index: normalizedSectionNum → docId (for exact matches)
//   - Prefix index: prefix → Set<suggestions> (for autocomplete)
//   - Scoring: section exact > title prefix > title contains > token match
//   - Synonym expansion handled at query time via expandQuery()
//
// This engine is DATA-AGNOSTIC. It accepts any SearchableDocument[].
// Each dataset (ITA 1961, ITA 2025, Circulars, etc.) gets its own engine instance.

import type { SearchableDocument, SearchResult, SearchFilter, Suggestion } from '@/types/search';
import { normalizeQuery, normalizeSectionNumber, tokenize, prefixesOf, highlightText } from './normalizer';
import { expandQuery } from './synonyms';

// ── Scoring weights ────────────────────────────────────────────────────────────

const SCORE = {
  SECTION_EXACT:    100,  // "80c" matches section 80C exactly
  SECTION_PREFIX:    85,  // "80" matches "80C", "80D", etc.
  TITLE_EXACT:       80,  // full normalized title matches query
  TITLE_PREFIX:      65,  // title starts with query token
  TITLE_CONTAINS:    45,  // title contains query token
  TAG_MATCH:         30,  // tag matches query token
  TOKEN_MATCH:       20,  // general token index match
  SYNONYM_MATCH:     15,  // match via synonym expansion
} as const;

// ── Internal storage ───────────────────────────────────────────────────────────

interface SuggestionEntry {
  text: string;
  type: Suggestion['type'];
  sectionNumber?: string;
  tokens: string[]; // normalized tokens of the suggestion text
}

// ── SearchEngine ───────────────────────────────────────────────────────────────

export class SearchEngine {
  private invertedIndex = new Map<string, Set<string>>();   // token → Set<docId>
  private prefixIndex   = new Map<string, Set<string>>();   // prefix → Set<suggText>
  private sectionIndex  = new Map<string, string>();        // normSectionNum → docId
  private documents     = new Map<string, SearchableDocument>();
  private suggestionPool: SuggestionEntry[] = [];
  private _built = false;

  // ── Build Index ─────────────────────────────────────────────────────────────

  buildIndex(docs: SearchableDocument[]): void {
    // Reset
    this.invertedIndex.clear();
    this.prefixIndex.clear();
    this.sectionIndex.clear();
    this.documents.clear();
    this.suggestionPool = [];

    for (const doc of docs) {
      this.documents.set(doc.id, doc);

      // ── Section number index ──
      if (doc.sectionNumber) {
        const norm = normalizeSectionNumber(doc.sectionNumber);
        this.sectionIndex.set(norm, doc.id);
        this._addSuggestion({ text: doc.sectionNumber, type: 'section', sectionNumber: doc.sectionNumber });
      }

      // ── Inverted index: title tokens ──
      const titleTokens = tokenize(doc.title);
      for (const token of titleTokens) {
        this._addToIndex(token, doc.id);
      }

      // ── Inverted index: tag tokens ──
      for (const tag of doc.tags) {
        const tagTokens = tokenize(tag);
        for (const t of tagTokens) this._addToIndex(t, doc.id);
      }

      // ── Inverted index: pre-computed search tokens ──
      for (const token of doc.searchTokens) {
        this._addToIndex(token, doc.id);
      }

      // ── Inverted index: synonym tokens ──
      for (const token of doc.synonymTokens) {
        this._addToIndex(token, doc.id);
      }

      // ── Suggestion pool ──
      this._addSuggestion({ text: doc.title, type: 'topic', tokens: titleTokens });
      for (const tag of doc.tags) {
        if (tag.length > 2) this._addSuggestion({ text: tag, type: 'topic', tokens: tokenize(tag) });
      }
    }

    this._built = true;
  }

  // ── Search ──────────────────────────────────────────────────────────────────

  search(rawQuery: string, filters?: SearchFilter): SearchResult[] {
    if (!this._built || !rawQuery.trim()) return [];

    const normalized = normalizeQuery(rawQuery);
    const sectionNorm = normalizeSectionNumber(rawQuery);
    const expandedTokens = expandQuery(normalized);

    const scores = new Map<string, number>();

    // 1. Section exact match
    if (this.sectionIndex.has(sectionNorm)) {
      const docId = this.sectionIndex.get(sectionNorm)!;
      this._addScore(scores, docId, SCORE.SECTION_EXACT);
    }

    // 2. Section prefix match (e.g. query "80" matches "80c", "80d")
    for (const [normSec, docId] of this.sectionIndex) {
      if (normSec.startsWith(sectionNorm) && normSec !== sectionNorm) {
        this._addScore(scores, docId, SCORE.SECTION_PREFIX);
      }
    }

    // 3. Token & synonym matches
    for (const token of expandedTokens) {
      const matchingDocs = this.invertedIndex.get(token);
      if (!matchingDocs) continue;

      for (const docId of matchingDocs) {
        const doc = this.documents.get(docId)!;
        const normTitle = normalizeQuery(doc.title);
        const isSynonym = !normalized.includes(token);

        let tokenScore: number = isSynonym ? SCORE.SYNONYM_MATCH : SCORE.TOKEN_MATCH;

        if (normTitle === normalized) tokenScore = Math.max(tokenScore, SCORE.TITLE_EXACT);
        else if (normTitle.startsWith(token)) tokenScore = Math.max(tokenScore, SCORE.TITLE_PREFIX);
        else if (normTitle.includes(token)) tokenScore = Math.max(tokenScore, SCORE.TITLE_CONTAINS);
        else if (doc.tags.some((t) => normalizeQuery(t).includes(token))) tokenScore = Math.max(tokenScore, SCORE.TAG_MATCH);

        this._addScore(scores, docId, tokenScore);
      }
    }

    // 4. Sort, filter, map to SearchResult
    return Array.from(scores.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([docId, score]) => ({ doc: this.documents.get(docId)!, score }))
      .filter(({ doc }) => this._matchesFilters(doc, filters))
      .map(({ doc, score }) => this._toResult(doc, normalized, score));
  }

  // ── Suggest (Autocomplete) ──────────────────────────────────────────────────

  suggest(rawPrefix: string, limit = 8): Suggestion[] {
    if (!this._built || !rawPrefix.trim()) return [];

    const normalized = normalizeQuery(rawPrefix);
    const sectionNorm = normalizeSectionNumber(rawPrefix);

    const seen = new Set<string>();
    const results: Suggestion[] = [];

    const addSuggestion = (text: string, type: Suggestion['type'], sectionNumber?: string) => {
      const key = text.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      results.push({ id: `sug-${key}`, text, type, sectionNumber });
    };

    // Instant Domain Suggestions Map for instant offline autocomplete matching user requirements
    const DOMAIN_SUGGESTIONS: Record<string, string[]> = {
      '54': ['54', '54EC', '54F', '54B', '54D', '54EE', '54GB'],
      '80': ['80C', '80CCC', '80CCD', '80CCD(1B)', '80D', '80DD', '80DDB', '80E', '80EE', '80EEA', '80G', '80GG', '80GGA'],
      'tax': ['Tax Saving', 'Old vs New Tax Regime', 'Income Tax Return', 'Advance Tax', 'TDS', 'Rebate u/s 87A'],
      'capital': ['Capital Gains', 'Section 45', 'Section 54', 'Section 54EC', 'Section 54F'],
      'salary': ['Salary Income', 'HRA', 'LTA', 'Standard Deduction', 'Professional Tax'],
    };

    // 1. Check exact key prefix matches in instant domain dictionary
    const normLower = normalized.toLowerCase();
    for (const [key, items] of Object.entries(DOMAIN_SUGGESTIONS)) {
      if (key === normLower || sectionNorm === key) {
        for (const item of items) {
          const isSec = /^(\d+|Section)/i.test(item);
          addSuggestion(item, isSec ? 'section' : 'topic', isSec ? item.replace(/^Section\s*/i, '') : undefined);
        }
      }
    }

    // 2. Section number prefix matches (e.g. "80" -> "80C", "80D"; "54" -> "54F")
    for (const [normSec, docId] of this.sectionIndex) {
      if (normSec.startsWith(sectionNorm) || normSec.startsWith(normalized)) {
        const doc = this.documents.get(docId)!;
        if (doc.sectionNumber) {
          addSuggestion(doc.sectionNumber, 'section', doc.sectionNumber);
        }
      }
      if (results.length >= limit) break;
    }

    // 3. Prefix index matches
    const prefixHits = this.prefixIndex.get(normalized) ?? new Set();
    for (const suggText of prefixHits) {
      addSuggestion(suggText, 'autocomplete');
      if (results.length >= limit) break;
    }

    // 4. Full contains fallback for short pool
    if (results.length < limit) {
      for (const entry of this.suggestionPool) {
        const normText = normalizeQuery(entry.text);
        if (normText.includes(normalized) && !seen.has(entry.text.toLowerCase())) {
          addSuggestion(entry.text, entry.type, entry.sectionNumber);
          if (results.length >= limit) break;
        }
      }
    }

    return results.slice(0, limit);
  }

  // ── Getters ─────────────────────────────────────────────────────────────────

  get isBuilt(): boolean { return this._built; }
  get documentCount(): number { return this.documents.size; }

  // ── Private helpers ─────────────────────────────────────────────────────────

  private _addToIndex(token: string, docId: string): void {
    if (!this.invertedIndex.has(token)) this.invertedIndex.set(token, new Set());
    this.invertedIndex.get(token)!.add(docId);

    // Also index all prefixes for autocomplete
    for (const prefix of prefixesOf(token)) {
      if (!this.prefixIndex.has(prefix)) this.prefixIndex.set(prefix, new Set());
    }
  }

  private _addSuggestion(entry: Partial<SuggestionEntry> & { text: string }): void {
    const tokens = entry.tokens ?? tokenize(entry.text);
    this.suggestionPool.push({
      text: entry.text,
      type: entry.type ?? 'autocomplete',
      sectionNumber: entry.sectionNumber,
      tokens,
    });
    // Index prefixes of suggestion text for fast lookup
    for (const token of tokens) {
      for (const prefix of prefixesOf(token)) {
        if (!this.prefixIndex.has(prefix)) this.prefixIndex.set(prefix, new Set());
        this.prefixIndex.get(prefix)!.add(entry.text);
      }
    }
    // Also index the full normalized text
    const fullNorm = normalizeQuery(entry.text);
    for (const prefix of prefixesOf(fullNorm)) {
      if (!this.prefixIndex.has(prefix)) this.prefixIndex.set(prefix, new Set());
      this.prefixIndex.get(prefix)!.add(entry.text);
    }
  }

  private _addScore(scores: Map<string, number>, docId: string, score: number): void {
    scores.set(docId, (scores.get(docId) ?? 0) + score);
  }

  private _matchesFilters(doc: SearchableDocument, filters?: SearchFilter): boolean {
    if (!filters) return true;
    if (filters.actIds?.length && doc.actId && !filters.actIds.includes(doc.actId as never)) return false;
    if (filters.datasetIds?.length && !filters.datasetIds.includes(doc.datasetId)) return false;
    if (filters.types?.length && !filters.types.includes(doc.type)) return false;
    if (filters.tags?.length && !filters.tags.some((t) => doc.tags.includes(t))) return false;
    return true;
  }

  private _toResult(doc: SearchableDocument, normalizedQuery: string, score: number): SearchResult {
    return {
      id: doc.id,
      type: doc.type,
      datasetId: doc.datasetId,
      title: highlightText(doc.title, normalizedQuery),
      subtitle: doc.subtitle,
      excerpt: highlightText(doc.excerpt, normalizedQuery),
      actId: doc.actId as never,
      sectionNumber: doc.sectionNumber,
      tags: doc.tags,
      href: doc.href,
      relevanceScore: Math.min(score, 100),
    };
  }
}
