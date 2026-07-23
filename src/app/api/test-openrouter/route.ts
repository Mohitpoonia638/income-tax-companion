import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey || apiKey.trim() === '') {
    return NextResponse.json({ success: false, error: 'OPENROUTER_API_KEY is missing' }, { status: 200 });
  }

  try {
    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openrouter/free',
        messages: [{ role: 'user', content: 'Say OK' }],
      }),
    });

    const status = res.status;
    const rawBody = await res.text();

    return NextResponse.json({
      status,
      rawBody,
      ok: res.ok,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Fetch failed' }, { status: 500 });
  }
}
