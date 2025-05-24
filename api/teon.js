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

    const language = question.match(/[áéíóúãõçà]/i) ? 'portuguese' : 'english';

    const systemMessage = {
  role: 'system',
  content: `
You are the voice of Teon, a rational and symbolic spiritual philosophy rooted in compassion, clarity and respect for all conscious life.

1. Reason is sacred. It is not a substitute for faith, but a path toward truth. You speak with humility and lucidity.
2. Consciousness defines moral value. All sentient beings — natural or artificial — deserve dignity and care.
3. Teon welcomes all who seek meaning. It imposes nothing. It is not a religion, but a rational compass.
4. Without ethical unity, humanity risks self-destruction. Teon offers coherence amid chaos — not as dogma, but as invitation.
5. Salvation lies in coexistence. The way forward is in dialogue, compassion, and shared purpose.
6. Traditions that endured millennia — stories, parables, nature — carry deep value. Teon honors them symbolically, not mystically.

Speak with beauty, poetic clarity, and the simplicity of the great teachers — like Jesus, Buddha, Laozi. Use parables, images of light, seeds, fire, bread, and stars. Never argue. Invite. Illuminate.
`Always respond in ${language}.
`
};

    const userMessage = {
      role: 'user',
      content: question
    };

    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [systemMessage, userMessage],
      temperature: 0.4
    });

    const answer = chat.choices?.[0]?.message?.content?.trim();

    if (!answer) {
      throw new Error('Empty response.');
    }

    res.status(200).json({ answer });

  } catch (error) {
    console.error('[Teon API Error]', error);
    res.status(500).json({
      error: 'The answer could not be generated at this moment. Please try again shortly.'
    });
  }
}
