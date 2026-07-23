'use client';

import { useState } from 'react';
import { ArrowRightLeft, Sparkles, Send, Bot, CheckCircle2, AlertCircle } from 'lucide-react';
import type { GeminiSectionResponse } from '@/lib/hybrid/schema';

export function CompareClient() {
  const [sectionInput, setSectionInput] = useState('80C');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<GeminiSectionResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const quickSections = ['80C', '194Q', '54', 'House Property', 'Capital Gain'];

  const handleCompare = async (sec: string) => {
    if (!sec.trim()) return;

    setLoading(true);
    setData(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/ai/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `Compare Section ${sec} 1961 vs 2025` }),
      });

      const json = await res.json();

      if (!json.success || !json.data) {
        setErrorMsg(json.message || json.error || 'Failed to generate comparison analysis.');
        setLoading(false);
        return;
      }

      setData(json.data);
    } catch {
      setErrorMsg('Network error while connecting to comparison AI service.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    handleCompare(sectionInput);
  };

  const onQuickClick = (sec: string) => {
    setSectionInput(sec);
    handleCompare(sec);
  };

  return (
    <div className="space-y-8">
      {/* ── Input Box ── */}
      <div className="p-6 rounded-2xl border border-white/10 bg-white/3 backdrop-blur-md space-y-4">
        <form onSubmit={onSubmitForm} className="relative flex items-center">
          <input
            type="text"
            value={sectionInput}
            onChange={(e) => setSectionInput(e.target.value)}
            placeholder="Enter section or topic to compare (e.g. '80C', '194Q', '54')…"
            className="w-full px-5 py-4 pr-14 rounded-xl bg-white/5 border border-white/15 text-base text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-violet-500/60 focus:ring-2 focus:ring-violet-500/20 transition-all"
          />
          <button
            type="submit"
            disabled={loading || !sectionInput.trim()}
            aria-label="Generate comparison"
            className="absolute right-2.5 flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-md shadow-violet-500/20"
          >
            {loading ? <Sparkles size={18} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>

        <div className="flex flex-wrap gap-2 pt-1">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 self-center">
            <ArrowRightLeft size={13} className="text-violet-400" /> Quick Compare:
          </span>
          {quickSections.map((sec) => (
            <button
              key={sec}
              type="button"
              onClick={() => onQuickClick(sec)}
              className="text-xs px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-foreground hover:bg-white/10 hover:border-violet-500/30 transition-all font-mono"
            >
              {sec}
            </button>
          ))}
        </div>
      </div>

      {/* Error message */}
      {errorMsg && (
        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-300 text-sm flex items-center gap-2">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="p-8 rounded-2xl border border-white/10 bg-white/3 space-y-4 animate-pulse">
          <div className="h-6 w-60 bg-white/10 rounded" />
          <div className="h-40 bg-white/5 rounded-xl" />
        </div>
      )}

      {/* Dynamic Gemini Comparison Result */}
      {data && !loading && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="p-6 rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-900/20 to-blue-900/20 backdrop-blur-md flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-violet-300 uppercase tracking-wider mb-1">
                <Bot size={16} /> Live Gemini Dynamic Comparison
                <CheckCircle2 size={14} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-foreground">
                {data.title} ({data.sectionNumber})
              </h2>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-medium">
              1961 ↔ 2025 Parallel Matrix
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 1961 Act Card */}
            <div className="p-6 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-3">
              <h3 className="text-lg font-bold text-blue-300">
                Income Tax Act, 1961
              </h3>
              <p className="text-sm text-foreground/90 font-mono">
                Section: {data.comparison1961vs2025?.act1961 || data.sectionNumber}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {data.bareActSummary || data.simpleMeaning}
              </p>
            </div>

            {/* 2025 Act Card */}
            <div className="p-6 rounded-2xl border border-violet-500/30 bg-violet-500/5 space-y-3">
              <h3 className="text-lg font-bold text-violet-300">
                Income Tax Act, 2025
              </h3>
              <p className="text-sm text-foreground/90 font-mono">
                Section: {data.comparison1961vs2025?.act2025 || 'Restructured Provision'}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Modernized statutory language with simplified chapter hierarchy.
              </p>
            </div>
          </div>

          {/* Major Changes List */}
          {data.comparison1961vs2025?.majorChanges && data.comparison1961vs2025.majorChanges.length > 0 && (
            <div className="p-6 rounded-2xl border border-white/10 bg-white/3 space-y-3">
              <h3 className="text-base font-semibold text-foreground">
                Key Structural &amp; Provision Differences
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                {data.comparison1961vs2025.majorChanges.map((change, i) => (
                  <li key={i}>{change}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
