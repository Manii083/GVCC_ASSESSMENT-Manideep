const axios = require('axios');

class GrokService {
  constructor() {
    this.apiKey = process.env.GROK_API_KEY;
    this.apiUrl = process.env.GROK_API_URL;
  }

  async askQuestion(documentText, question) {
    try {
      const prompt = `
You are a document assistant.

Answer ONLY using the information provided below.

DOCUMENT:
${documentText}

QUESTION:
${question}

If the answer does not exist in the document, reply:
"The information is not available in the document."

Do not make assumptions.
`;

const response = await axios.post(
  `${this.apiUrl}/chat/completions`,
  {
    model: 'grok-4',
    messages: [
      {
        role: 'system',
        content: 'You are a document assistant that answers questions strictly based on the provided document.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 1000
  },
  {
    headers: {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    }
  }
);

      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('Grok API Error:', error.response?.data || error.message);
      
      if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      
      if (error.response?.status === 401) {
        throw new Error('Grok API authentication failed. Please check your API key.');
      }
      
      throw new Error('Failed to get response from AI service');
    }
  }
}

module.exports = new GrokService();