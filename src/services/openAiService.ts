import { toast } from "sonner";

// WARNING: This is a publishable key FOR DEMO PURPOSES ONLY.
// DO NOT embed secret API keys directly in frontend code in production.
// Use environment variables and backend proxies.
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
;
const API_URL = "https://api.openai.com/v1/chat/completions";

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  }
}

// Define the type for allowed operations
export type TextOperation = 'rewrite' | 'simplify' | 'makeLonger' | 'makeShorter' | 'makeList' | 'makeTable';

// Keep only this complete and correct definition of processText
export const processText = async (text: string, operation: TextOperation): Promise<string> => {
  console.log('processText called with:', { text: `"${text}"`, operation }); // Log input

  if (!API_KEY) {
    console.error('No API key configured');
    toast.error('API key is missing. Cannot process text.');
    throw new Error('OpenAI API key is not configured');
  }

  let systemContent: string;
  let userPrompt: string;

  // Determine System Content and User Prompt based on operation
  switch (operation) {
    case 'rewrite':
      systemContent = "You are a professional editor. Rewrite the provided text to be more engaging, clear, and professional, while strictly maintaining the original meaning and intent. Do not add information not present in the original text.";
      userPrompt = `Rewrite the following text: "${text}"`;
      break;
    case 'simplify':
      systemContent = "You are a simplification expert. Make the provided text clearer and easier to understand for a general audience by using shorter sentences, simpler vocabulary, and clarifying complex concepts. Retain the core meaning.";
      userPrompt = `Simplify the following text: "${text}"`;
      break;
    case 'makeLonger':
      systemContent = "You are a content expansion assistant. Elaborate on the provided text by adding relevant details, examples, or explanations to make it longer. Ensure the added content directly supports and expands upon the original ideas, without introducing unrelated topics. Maintain a consistent tone.";
      userPrompt = `Expand and elaborate on the following text to make it longer: "${text}"`;
      break;
    case 'makeShorter':
      systemContent = "You are a conciseness expert. Summarize or condense the provided text, making it significantly shorter while retaining the most crucial information and main points. Remove redundancy and less important details.";
      userPrompt = `Condense the following text to make it shorter: "${text}"`;
      break;
    case 'makeList':
      systemContent = "You are a formatting assistant. Identify the key points, steps, or items in the provided text and format them as a Markdown bulleted list (* item). If the text doesn't naturally lend itself to a list, return the original text with a note saying 'Could not convert to list.'";
      userPrompt = `Convert the key information in the following text into a Markdown bulleted list: "${text}"`;
      break;
    case 'makeTable':
      systemContent = "You are a data structuring assistant. Analyze the provided text for information that can be logically organized into a table. If suitable, create a simple Markdown table with appropriate headers and rows based *only* on the text content. If the text cannot be reasonably formatted as a table, return the original text with a note saying 'Could not convert to table.'";
      userPrompt = `Organize the information in the following text into a Markdown table if appropriate: "${text}"`;
      break;
    default:
      // This case ensures 'operation' is handled exhaustively by the type system
      // If a new operation is added to TextOperation without adding a case here,
      // TypeScript will likely complain (depending on compiler options).
      // We still provide a fallback error for runtime safety.
      console.error('Invalid operation type:', operation);
      toast.error('Invalid text operation requested.');
      throw new Error(`Invalid operation: ${operation}`);
  }

  // Prepare API Payload
  const payload = {
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: systemContent },
      { role: "user", content: userPrompt }
    ],
    temperature: 0.6,
    max_tokens: 1500,
  };

  // Make API Call
  try {
    console.log(`Making API request for operation: ${operation}`);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    console.log('API response status:', response.status, response.statusText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
        console.error('API error response body:', errorData);
      } catch (jsonError) {
        const textError = await response.text();
        console.error('API error response text (non-JSON):', textError);
        errorData = { error: { message: response.statusText || 'Unknown API error' } };
      }
      const errorMessage = errorData?.error?.message || `API request failed with status ${response.status}`;
      toast.error(`OpenAI API Error: ${errorMessage}`);
      throw new Error(errorMessage); // Re-throw API error
    }

    const data = await response.json() as OpenAIResponse;

    // Process Response
    const processedText = data.choices?.[0]?.message?.content?.trim();

    if (!processedText) {
      console.error('No content received in API response choice.');
      toast.error('Received an empty response from the AI.');
      throw new Error('No response content received from OpenAI');
    }

    console.log('Received processed text:', `"${processedText}"`);
    return processedText;

  } catch (error) {
    // Catch network errors or errors thrown above
    console.error(`Error during '${operation}' operation:`, error);
    // Avoid duplicate toasts if it's an API error already handled
    if (!(error instanceof Error && error.message.startsWith('API request failed'))) {
       toast.error('Failed to process text. Please check console for details.');
    }
    throw error; // Re-throw the error for the calling function
  }
};

// Remove the unnecessary object export if only exporting this function
// export const openAiService = {
//   processText
// };