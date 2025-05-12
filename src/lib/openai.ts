import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: false // Prevent exposing API key in browser
});

export const chat = async (messages: Array<{ role: 'user' | 'assistant' | 'system', content: string }>) => {
  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: import.meta.env.VITE_OPENAI_MODEL || 'gpt-3.5-turbo',
      temperature: 0.7,
    });

    return completion.choices[0].message;
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw error;
  }
};

export default openai;