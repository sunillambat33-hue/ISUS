import { GoogleGenAI } from "@google/genai";

// Robustly retrieve API Key to prevent "process is not defined" errors in browser
const getApiKey = () => {
  try {
    // Check if process and process.env exist before accessing
    if (typeof process !== 'undefined' && process.env && process.env.API_KEY) {
      return process.env.API_KEY;
    }
  } catch (error) {
    // Ignore reference errors
  }
  return '';
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey: apiKey || 'DUMMY_KEY_FOR_INIT' });

export const explainQuestion = async (questionText: string, options: string[], correctAnswer: string): Promise<string> => {
  if (!apiKey) return "API Key not configured. Unable to fetch AI explanation.";

  try {
    const prompt = `
      You are a helpful physics and math tutor for high school students.
      Explain the solution to the following multiple choice question clearly and concisely.
      
      Question: ${questionText}
      Options: ${options.join(', ')}
      Correct Answer: ${correctAnswer}

      Provide the step-by-step logic to arrive at the correct answer.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't generate an explanation at this moment.";
  }
};

export const generateQuizQuestion = async (subject: string, topic: string): Promise<any> => {
    if (!apiKey) return null;

    try {
        const prompt = `Generate a single multiple-choice question for a ${subject} student on the topic "${topic}".
        Return the response in strictly valid JSON format with the following structure:
        {
            "text": "The question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0, // index of correct option (0-3)
            "explanation": "Brief explanation"
        }
        Do not include markdown formatting like \`\`\`json. Just the raw JSON string.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });
        
        const text = response.text || "{}";
        return JSON.parse(text);

    } catch (e) {
        console.error("Error generating question", e);
        return null;
    }
}

export const generatePracticeSet = async (classLevel: string, subject: string, topic: string): Promise<any[]> => {
    if (!apiKey) return [];

    try {
        const prompt = `
        You are an expert teacher for Class ${classLevel}.
        Generate 5 multiple-choice practice questions for the subject "${subject}" on the topic "${topic}".
        
        Return the response in strictly valid JSON format with the following structure:
        [
          {
            "id": 1,
            "text": "Question text here",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0, // index 0-3
            "explanation": "Brief explanation of the correct answer."
          },
          ...
        ]
        Do not use markdown code blocks. Just raw JSON.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const text = response.text || "[]";
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Practice Set Error:", error);
        return [];
    }
};

export const generateStudyNotes = async (classLevel: string, subject: string, topic: string): Promise<string> => {
    if (!apiKey) return "API Key not configured. Please check your settings.";

    try {
        const prompt = `
        You are an expert teacher for Class ${classLevel}.
        Create comprehensive, easy-to-understand study notes for the subject "${subject}" on the topic "${topic}".
        
        Structure the notes with the following sections:
        1. 📌 Introduction
        2. 🔑 Key Concepts
        3. 📜 Important Definitions
        4. 📐 Formulas (if applicable) & Equations
        5. 💡 Key Points to Remember
        6. 📝 Short Summary
        
        Use emojis to make it engaging. Format with clear headings and bullet points. 
        Do not use markdown code blocks (like \`\`\`). Just plain text with formatting.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || "Could not generate notes. Please try again.";
    } catch (error) {
        console.error("Gemini Notes Error:", error);
        return "Sorry, I encountered an error while generating notes.";
    }
};

export const generateChapterSummary = async (classLevel: string, subject: string, chapter: string): Promise<any> => {
    if (!apiKey) return null;

    try {
        const prompt = `
        You are an expert tutor for Class ${classLevel}. 
        Provide a concise interactive summary for the chapter "${chapter}" in the subject "${subject}".
        
        Return the output in strictly valid JSON format with this structure:
        {
            "summary": "A 2-3 sentence overview of the chapter.",
            "keyConcepts": [
                { "term": "Concept Name", "definition": "A very brief 1-sentence explanation." },
                { "term": "Concept Name", "definition": "A very brief 1-sentence explanation." },
                ... (provide 4-6 key concepts)
            ]
        }
        Do not use markdown. Just raw JSON.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json'
            }
        });

        const text = response.text || "{}";
        return JSON.parse(text);
    } catch (error) {
        console.error("Gemini Summary Error:", error);
        return null;
    }
};