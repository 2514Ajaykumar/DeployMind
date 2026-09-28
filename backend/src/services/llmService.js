const Groq = require('groq-sdk');
require('dotenv').config();

const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured in the environment');
  }
  return new Groq({ apiKey });
};

const generateResponse = async (prompt) => {
  try {
    const groq = getGroqClient();
    
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'openai/gpt-oss-20b',
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    let message = error.message || 'Unknown error';
    const apiKey = process.env.GROQ_API_KEY;
    if (apiKey && message.includes(apiKey)) {
      message = message.replace(new RegExp(apiKey, 'g'), '[REDACTED_API_KEY]');
    }
    
    if (error.status === 401 || message.includes('401') || message.includes('authentication')) {
      throw new Error('Groq authentication failed. Please check your API key.');
    }
    
    if (error.status === 429 || message.includes('429') || message.includes('Rate limit')) {
      console.error('[LLM Service] 429 Rate Limit Hit:', message);
      throw new Error('AI analysis is temporarily unavailable because the AI service has reached its current usage limit. Please try again later.');
    }
    
    throw new Error(`LLM generation failed: ${message}`);
  }
};

module.exports = {
  generateResponse
};
