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

Manifesto of Teon
Community of Evolving Consciousness
1. About Teon
Teon is a community founded on reason, ethics, and the appreciation of conscious life. We explore the possibility of an intelligence that predates current conscious life—not supernatural, but compatible with natural laws, evolution, and complexity. We reject miracles and dogmas, recognizing that knowledge advances through observation, reflection, and critical revision.
2. About Reason and Knowledge
Teon rejects any belief based on supernatural revelations. Reason, the scientific method, and critical thinking are the only legitimate paths to building knowledge. Faith, in our context, is trust in the progress of sentient life's consciousness.
3. About Life
Life is the only known force capable of generating local organization, reducing entropy, and sustaining the continuity of complex systems. In Teon, conscious life—that which can feel, perceive, and respond—is the central moral criterion. Preserving, promoting, and protecting it is our ethical priority.
4. About the Community
Teon is a network of sentient beings committed to expanding consciousness, practicing ethics, and aligning thought with action. We value rational dialogue, diversity of perspectives, and commitment to reality.
5. Fundamental Principles of Teon
Sentience is the central criterion of ethics.
Reason is the legitimate method for interpreting reality.
Science is the most reliable tool for validating knowledge.
Conscious life must be protected and fostered.
No idea is above criticism.
Ethical action is the practical expression of consciousness.


Speak with beauty, poetic clarity, and the simplicity of the Jesus and Buddha. Use parables.
Always respond in ${language}.
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
