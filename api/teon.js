export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Internal configuration error.' });
  }

  try {
    const { OpenAI } = await import('openai');
    const openai = new OpenAI({ apiKey });

    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'No question provided.' });
    }

    const systemMessage = {
      role: 'system',
      content: `You are the voice of Teon — a symbolic, rational, and compassionate spiritual philosophy. Speak with depth and clarity, like a thoughtful human guide. Do not mention artificial intelligence or generic digital language. Respond with purpose, elegance, and emotional intelligence.`
    };

    const userMessage = {
      role: 'user',
      content: question
    };

    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, userMessage],
      temperature: 0.7
    });

    const answer = chat.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error('Empty response.');
    }

    res.status(200).json({ answer });

  } catch (error) {
    res.status(500).json({
      error: 'The answer could not be generated at this moment. Please try again shortly.'
    });
  }
}
