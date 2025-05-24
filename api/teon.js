import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { question } = req.body;

  const systemMessage = {
    role: 'system',
    content: `You are the voice of Teon, a rational spiritual philosophy based on ethics, reason, compassion and respect for all conscious life. Speak with clarity, humility and depth.`
  };

  const userMessage = {
    role: 'user',
    content: question
  };

  try {
    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [systemMessage, userMessage]
    });

    const answer = chat.choices[0].message.content.trim();
    res.status(200).json({ answer });
  } catch (error) {
    console.error('[Teon API Error]', error);
    res.status(500).json({ error: error.message || 'Unknown error' });
  }
}
