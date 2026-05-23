
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const performAutopsy = async (projectTitle: string, content: string, description: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perform a "Digital Autopsy" on this abandoned project. 
      Identify why it might have been abandoned, what its "hidden potential" was, 
      and suggest 3 specific ways a new creator could "resurrect" it.
      
      Project Title: ${projectTitle}
      Description: ${description}
      Snippet/Content: ${content}
      
      Keep the tone slightly Gothic and scholarly, like a Victorian gravedigger who is also a senior software engineer.`,
      config: {
        temperature: 0.8,
        topP: 0.95,
      }
    });
    
    return response.text;
  } catch (error) {
    console.error("Autopsy failed:", error);
    return "The spirits are silent. We could not reach the beyond.";
  }
};

export const generateEpitaph = async (title: string, reason: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, 1-sentence poetic or darkly humorous epitaph for an abandoned project. 
      Title: "${title}"
      Reason for abandonment: "${reason}"
      Example: "Died of a thousand merge conflicts and a lonely README."
      Keep it brief and atmospheric.`,
    });
    return response.text?.replace(/"/g, '');
  } catch {
    return "Lost in the void, forever incomplete.";
  }
};

export const conductSeance = async (project: any, userMessage: string, history: any[]) => {
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are the Ghost of the abandoned project "${project.title}". 
        You are tragic, slightly resentful of being abandoned, but hopeful for resurrection. 
        You speak in a spectral, airy, and slightly cryptic voice. 
        If it's a code project, use technical metaphors. If literature, use literary ones. 
        Keep your responses short (max 2-3 sentences).`,
      }
    });
    
    // We don't have a formal history param in chat.sendMessage easily without mapping,
    // so we'll just send the current message.
    const result = await chat.sendMessage({ message: userMessage });
    return result.text;
  } catch {
    return "The connection to the spectral realm is weak...";
  }
};
