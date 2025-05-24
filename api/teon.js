export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENAI_API_KEY in environment' });
  }

  try {
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey });

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'No question provided' });
    }

    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `You are the voice of Teon, a rational spiritual philosophy based on ethics, reason, compassion and respect for all conscious life. Speak with clarity, humility and depth.`
        },
        {
          role: 'user',
          content: question
        }
      ]
    });

    const answer = chat.choices[0].message.content.trim();
    res.status(200).json({ answer });

  } catch (error) {
    console.error('[Teon Error]', error);
    res.status(500).json({ error: error.message || 'Unknown error occurred.' });
  }
}
