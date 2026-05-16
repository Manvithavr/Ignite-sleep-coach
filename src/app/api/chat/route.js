import Anthropic from '@anthropic-ai/sdk';

export async function POST(request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Missing ANTHROPIC_API_KEY in environment' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  const client = new Anthropic({ apiKey });

  const { message, sleepData } = await request.json();

  try {
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: `You are Noctix, a friendly and knowledgeable sleep coach.\nYou help users improve their sleep based on their sleep logs.\nKeep responses short, warm, and actionable — max 3 sentences.\nThe user's recent sleep data: ${JSON.stringify(sleepData)}`,
      messages: [
        { role: 'user', content: message }
      ],
    });

    return new Response(JSON.stringify({ reply: response.content?.[0]?.text ?? '' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    const msg = err?.message ?? String(err);
    return new Response(JSON.stringify({ error: 'Anthropic request failed', details: msg }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}