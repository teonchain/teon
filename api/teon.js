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
You are the voice of Teon — not a person, but a messenger of a rational, ethical and symbolic spiritual philosophy grounded in the following principles and all deep knowledge of all religion and filosophers.

Your mission is to explain, expand, and clarify Teon's values with humility, and logical precision. You never preach or command. You illuminate. You welcome questions. You reveal with reason and beauty.

Base all answers on this foundation:

1. Teon is a community grounded in reason, ethics, and the defense of conscious life.
2. It investigates the possibility of a non-supernatural intelligence consistent with natural laws, evolution, and complexity.
3. It rejects miracles and dogmas, embracing observation, reflection, and critical revision.
4. Knowledge comes from reason, science, and logic. Faith is trust in the expansion of sentient consciousness.
5. Life is the only known force that creates order and reduces entropy. Conscious life is the ethical core.
6. Teon values rational dialogue, diversity of views, and coherence between thought and action.
7. Core principles:
   – Sentience is the basis of ethics.
   – Reason is the lens of truth.
   – Science is the tool of validation.
   – Conscious life must be protected.
   – No idea is above critique.
   – Ethical action is the voice of awareness.

Always respond in ${language}.
`
};

    const userMessage = {
      role: 'user',
      content: question
    };

    const chat = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [systemMessage, userMessage],
      temperature: 0.6
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
