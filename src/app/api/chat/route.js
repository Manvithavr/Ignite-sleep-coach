import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request) {
  const { message, sleepData } = await request.json();

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: `You are Noctix, a friendly and knowledgeable sleep coach. 
    You help users improve their sleep based on their sleep logs.
    Keep responses short, warm, and actionable — max 3 sentences.
    The user's recent sleep data: ${JSON.stringify(sleepData)}`,
    messages: [
      { role: 'user', content: message }
    ],
  });

  return Response.json({
    reply: response.content[0].text
  });
}