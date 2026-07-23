import { NextResponse } from 'next/server';
import { GEMINI_SYSTEM_INSTRUCTION, sanitizeGeminiResponse, type GeminiSectionResponse } from '@/lib/hybrid/schema';

export const runtime = 'nodejs';

const PRIMARY_MODEL = 'openrouter/free';
const FALLBACK_MODEL = 'poolside/laguna-s-2.1:free';

// Server-side in-memory cache for fast repeated query responses (case-insensitive)
const apiCache = new Map<string, { data: GeminiSectionResponse; modelUsed: string; timestamp: number }>();

/**
 * Strip markdown code fences and extract the first {...} JSON object.
 */
function extractJsonFromString(str: string): string {
  if (!str) return '';
  const cleaned = str.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  return match ? match[0] : cleaned;
}

/**
 * Make a single Chat Completions call to OpenRouter API and measure performance.
 */
async function callOpenRouterModel(
  apiKey: string,
  modelName: string,
  queryText: string
): Promise<{ result: GeminiSectionResponse | null; error?: string; apiResponseTimeMs: number }> {
  const apiStart = performance.now();
  try {
    const siteUrl =
      process.env.NEXT_PUBLIC_APP_URL ??
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'X-Title': 'Income Tax AI Companion',
    };

    if (siteUrl) {
      headers['HTTP-Referer'] = siteUrl;
    }

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: modelName,
        messages: [
          {
            role: 'system',
            content: GEMINI_SYSTEM_INSTRUCTION,
          },
          {
            role: 'user',
            content: `Analyze this Indian Income Tax law query for CA Final students & tax professionals: "${queryText}"`,
          },
        ],
        temperature: 0.2,
        response_format: { type: 'json_object' },
      }),
    });

    const apiResponseTimeMs = Math.round(performance.now() - apiStart);

    if (!res.ok) {
      const errText = await res.text();
      return { result: null, error: `HTTP ${res.status}: ${errText}`, apiResponseTimeMs };
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      return { result: null, error: 'Empty content returned from OpenRouter', apiResponseTimeMs };
    }

    const cleaned = extractJsonFromString(content);
    try {
      const parsed = JSON.parse(cleaned);
      const sanitized = sanitizeGeminiResponse(parsed);
      if (sanitized) {
        return { result: sanitized, apiResponseTimeMs };
      }
      return { result: null, error: 'JSON payload failed schema sanitization', apiResponseTimeMs };
    } catch {
      return { result: null, error: 'Failed to parse JSON string', apiResponseTimeMs };
    }
  } catch (err: any) {
    const apiResponseTimeMs = Math.round(performance.now() - apiStart);
    return { result: null, error: err?.message || 'Network error calling OpenRouter', apiResponseTimeMs };
  }
}

export async function POST(request: Request) {
  const reqStart = performance.now();
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return NextResponse.json(
      {
        success: false,
        isConfigured: false,
        error: 'OPENROUTER_API_KEY is not configured in .env.local',
        message: 'Add OPENROUTER_API_KEY to .env.local to enable AI analysis.',
      },
      { status: 200 }
    );
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const query = String(body.query || body.sectionNumber || body.prompt || '80C').trim();
  const actYear = String(body.actYear || '').trim();
  const history = String(body.context || body.history || '').trim();
  const queryText = `${query}${actYear ? ` Act Year ${actYear}` : ''}${history ? ` [Prior Context: ${history}]` : ''}`;
  const cacheKey = `${query.toLowerCase()}_${actYear}_${history.toLowerCase()}`;

  // 1. Check in-memory cache for repeated case-insensitive queries
  if (apiCache.has(cacheKey)) {
    const cached = apiCache.get(cacheKey)!;
    const totalProcessingTimeMs = Math.round(performance.now() - reqStart);
    console.log(`[PERF] [CACHE HIT] Query: "${queryText}" | API Response Time: 0ms | Total Request Processing Time: ${totalProcessingTimeMs}ms`);

    return NextResponse.json({
      success: true,
      isConfigured: true,
      data: cached.data,
      source: `OpenRouter AI (${cached.modelUsed}) - Server Cached`,
      modelUsed: cached.modelUsed,
      performance: {
        cached: true,
        apiResponseTimeMs: 0,
        totalProcessingTimeMs,
      },
    });
  }

  // 2. Execute single API Request (Try Primary Model)
  let modelUsed = PRIMARY_MODEL;
  let { result, error, apiResponseTimeMs } = await callOpenRouterModel(apiKey, PRIMARY_MODEL, queryText);

  // If primary fails/unavailable, fallback to secondary model
  if (!result) {
    console.warn(`[OpenRouter] Primary model (${PRIMARY_MODEL}) failed: ${error}. Retrying with fallback model (${FALLBACK_MODEL})...`);
    modelUsed = FALLBACK_MODEL;
    const fallback = await callOpenRouterModel(apiKey, FALLBACK_MODEL, queryText);
    result = fallback.result;
    apiResponseTimeMs += fallback.apiResponseTimeMs;
    if (fallback.error) {
      error = fallback.error;
    }
  }

  const totalProcessingTimeMs = Math.round(performance.now() - reqStart);
  console.log(`[PERF] [API CALL] Query: "${queryText}" | Model: ${modelUsed} | API Response Time: ${apiResponseTimeMs}ms | Total Request Processing Time: ${totalProcessingTimeMs}ms`);

  if (result) {
    // Save successful result in cache (case-insensitive key)
    apiCache.set(cacheKey, {
      data: result,
      modelUsed,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      success: true,
      isConfigured: true,
      data: result,
      source: `OpenRouter AI (${modelUsed})`,
      modelUsed,
      performance: {
        cached: false,
        apiResponseTimeMs,
        totalProcessingTimeMs,
      },
    });
  }

  return NextResponse.json(
    {
      success: false,
      isConfigured: true,
      isRateLimited: error?.includes('429') || false,
      error: error || 'OpenRouter AI query failed.',
      message: 'An error occurred while invoking OpenRouter AI.',
      modelUsed,
      performance: {
        cached: false,
        apiResponseTimeMs,
        totalProcessingTimeMs,
      },
    },
    { status: 200 }
  );
}
