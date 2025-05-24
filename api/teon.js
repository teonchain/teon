export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'Missing OpenAI API key.' });
  }

  try {
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const { question } = req.body;

    const systemMessage = {
      role: 'system',
      content: `You are the voice of Teon, a rational spiritual philosophy based on ethics, reason, compassion and respect for all conscious life. Speak with clarity, humility and depth.`
    };

    const userMessage = {
      role: 'user',
      content: question
    };

    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [systemMessage, userMessage]
    });

    const answer = chat.choices[0].message.content.trim();
    res.status(200).json({ answer });

  } catch (error) {
    console.error('[Teon API ERROR]', error);
    res.status(500).json({ error: error.message || 'Unknown error occurred.' });
  }
}
