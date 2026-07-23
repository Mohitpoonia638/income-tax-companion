'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Sparkles, Send, Bot, CheckCircle2, AlertCircle, BookOpen, Lightbulb, Scale, HelpCircle } from 'lucide-react';
import type { GeminiSectionResponse } from '@/lib/hybrid/schema';

export function AiTutorClient() {
  const searchParams = useSearchParams();
  const initialSection = searchParams.get('section') || '';

  const [inputQuery, setInputQuery] = useState(initialSection ? `Section ${initialSection}` : '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeminiSectionResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(true);

  const samplePrompts = [
    'Section 80C deductions and limits',
    'Section 194Q buyer TDS rules',
    'House Property rental income calculation',
    'Capital Gain exemption under Section 54',
  ];

  const handleSearch = async (queryToSubmit: string) => {
    if (!queryToSubmit.trim()) return;

    setLoading(true);
    setResult(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryToSubmit }),
      });

      const data = await res.json();

      if (!data.isConfigured) {
        setIsConfigured(false);
        setErrorMsg('GEMINI_API_KEY is not configured in .env.local. Add your key to enable live Gemini AI queries.');
        setLoading(false);
        return;
      }

      if (!data.success || !data.data) {
        setErrorMsg(data.message || data.error || 'Failed to generate Gemini AI response.');
        setLoading(false);
        return;
      }

      setIsConfigured(true);
      setResult(data.data);
    } catch {
      setErrorMsg('Network error while connecting to Gemini AI endpoint.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-run if query param section exists
  useEffect(() => {
    if (initialSection) {
      handleSearch(`Section ${initialSection}`);
    }
  }, [initialSection]);

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(inputQuery);
  };

  const onChipClick = (prompt: string) => {
    setInputQuery(prompt);
    handleSearch(prompt);
  };

  return (
    <div className="space-y-8">
      {/* ── Query Input Card ── */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-md space-y-4">
        <form onSubmit={onSubmitForm} className="relative flex items-center">
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask AI any section, topic or deduction (e.g. '80C', 'House Property', 'Capital Gain')…"
            className="w-full px-5 py-4 pr-14 rounded-xl bg-white/5 border border-white/15 text-base text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            aria-label="Send query to Gemini AI"
            className="absolute right-2.5 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-md shadow-violet-500/20"
          >
            {loading ? <Sparkles size={18} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>

        {/* Prompt Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 self-center">
            <Sparkles size={12} className="text-violet-400" /> Try searching:
          </span>
          {samplePrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              onClick={() => onChipClick(prompt)}
              className="text-xs px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-violet-500/30 transition-all"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* ── Unconfigured / Missing Key Notice ── */}
      {!isConfigured && (
        <div className="p-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 text-amber-200 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-amber-300">
            <AlertCircle size={18} />
            <span>Gemini API Key Required</span>
          </div>
          <p className="text-sm leading-relaxed text-amber-200/90">
            To enable live Google Gemini AI answers, open your <code className="px-1.5 py-0.5 rounded bg-black/40 text-amber-300 font-mono text-xs">.env.local</code> file and paste your key:
          </p>
          <pre className="p-3 rounded-xl bg-black/50 border border-white/10 text-xs font-mono text-amber-300">
            GEMINI_API_KEY=your_actual_gemini_api_key_here
          </pre>
        </div>
      )}

      {/* ── Error Banner ── */}
      {isConfigured && errorMsg && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* ── Loading Skeleton ── */}
      {loading && (
        <div className="p-8 rounded-2xl border border-white/10 bg-white/3 space-y-6 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-white/10 rounded" />
              <div className="h-4 w-32 bg-white/5 rounded" />
            </div>
          </div>
          <div className="h-20 bg-white/5 rounded-xl" />
          <div className="h-32 bg-white/5 rounded-xl" />
        </div>
      )}

      {/* ── Live Gemini Response ── */}
      {result && !loading && (
        <div className="space-y-6 animate-in fade-in duration-300">

          {/* Result Header */}
          <div className="p-6 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-900/20 to-blue-900/20 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-violet-300 uppercase tracking-wider mb-1">
                <Bot size={16} /> Google Gemini AI Intelligence
                <CheckCircle2 size={14} className="text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">
                {result.title}
              </h2>
              {result.sectionNumber && (
                <p className="text-sm text-blue-400 font-mono mt-0.5">
                  Section {result.sectionNumber} ({result.act})
                </p>
              )}
            </div>

            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              ✓ Verified Live AI Result
            </span>
          </div>

          {/* Simple Meaning */}
          <div className="p-6 rounded-2xl border border-white/10 bg-white/3 space-y-2">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BookOpen size={18} className="text-blue-400" /> Simple Explanation
            </h3>
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
              {result.simpleMeaning}
            </p>
          </div>

          {/* Bare Act Summary */}
          {result.bareActSummary && (
            <div className="p-6 rounded-2xl border border-white/10 bg-white/3 space-y-2">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <BookOpen size={18} className="text-violet-400" /> Statutory Provision
              </h3>
              <p className="text-xs md:text-sm text-muted-foreground font-mono leading-relaxed bg-black/30 p-4 rounded-xl border border-white/5">
                {result.bareActSummary}
              </p>
            </div>
          )}

          {/* Practical Example */}
          {result.practicalExample && (
            <div className="p-6 rounded-2xl border border-white/10 bg-white/3 space-y-2">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Lightbulb size={18} className="text-amber-400" /> Practical Exam Scenario & Solution
              </h3>
              <p className="text-sm text-foreground/90 leading-relaxed bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl">
                {result.practicalExample}
              </p>
            </div>
          )}

          {/* Case Laws */}
          {result.caseLaws && result.caseLaws.length > 0 && (
            <div className="p-6 rounded-2xl border border-white/10 bg-white/3 space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Scale size={18} className="text-rose-400" /> Landmark Case Laws
              </h3>
              <div className="grid gap-3">
                {result.caseLaws.map((cl, i) => (
                  <div key={i} className="p-4 rounded-xl border border-white/8 bg-white/2 space-y-1">
                    <div className="flex items-center justify-between text-sm font-semibold text-foreground">
                      <span>{cl.caseName}</span>
                      <span className="text-xs font-mono text-rose-400">{cl.citation}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{cl.summary}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQs */}
          {result.faqs && result.faqs.length > 0 && (
            <div className="p-6 rounded-2xl border border-white/10 bg-white/3 space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <HelpCircle size={18} className="text-sky-400" /> Frequently Asked Questions
              </h3>
              <div className="space-y-3">
                {result.faqs.map((faq, i) => (
                  <div key={i} className="p-4 rounded-xl border border-white/8 bg-white/2 space-y-1">
                    <h4 className="text-sm font-semibold text-foreground">{faq.question}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
