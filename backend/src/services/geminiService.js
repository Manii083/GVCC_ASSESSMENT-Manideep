const { GoogleGenerativeAI } = require("@google/generative-ai");

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }

  async askQuestion(documentText, question) {
    try {
      const model = this.genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
      });

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

      const result = await model.generateContent(prompt);
      const response = await result.response;

      return response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw new Error("Failed to get response from AI service");
    }
  }
}

module.exports = new GeminiService();