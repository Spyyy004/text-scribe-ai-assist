
import { toast } from "sonner";

// This is a publishable key for this demo
const API_KEY = "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";
const API_URL = "https://api.openai.com/v1/chat/completions";

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

export const processText = async (text: string, operation: 'rewrite' | 'simplify'): Promise<string> => {
  console.log(`Processing text with operation: ${operation}`, text);
  
  const prompt = operation === 'rewrite' 
    ? `Rewrite the following text to be more engaging and professional, but keep the main points: "${text}"`
    : `Simplify the following text to make it easier to understand, using shorter sentences and simpler words: "${text}"`;

  const payload = {
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: operation === 'rewrite' 
          ? "You are a professional editor. Rewrite the text to be more engaging while maintaining the original meaning."
          : "You are a simplification expert. Make text clearer and easier to understand for a general audience."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 1000
  };

  try {
    console.log("Sending request to OpenAI API:", JSON.stringify(payload));
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    console.log("Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || 'Failed to process the text');
    }

    const data = await response.json() as OpenAIResponse;
    console.log("Response data:", data);
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      throw new Error('Invalid response format from OpenAI API');
    }

    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error processing text with OpenAI:', error);
    toast.error('Failed to process the text. Please try again later.');
    throw error;
  }
};
