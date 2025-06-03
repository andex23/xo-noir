
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { GEMINI_TEXT_MODEL, IMAGEN_MODEL, GENERATE_SONG_PROMPT_TEMPLATE } from '../constants';
import { GeminiSongResponse, SongData } from '../types';

export class GeminiService {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    if (!apiKey) {
      console.error("GeminiService: API key is missing during construction.");
      throw new Error("API key is required to initialize GeminiService.");
    }
    this.ai = new GoogleGenAI({ apiKey });
    console.log("GeminiService constructed with API key.");
  }

  private parseGeminiJsonResponse<T>(responseText: string): T {
    console.log("GeminiService: Attempting to parse JSON response. Raw text (first 500 chars):", responseText.substring(0,500));
    let jsonStr = responseText.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s; 
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
      console.log("GeminiService: JSON content extracted from markdown fence.");
    }
    
    try {
      let parsed = JSON.parse(jsonStr);
      // Handle if Gemini returns an array of items when a single object is expected
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.warn("GeminiService: Parsed JSON is an array, taking the first element.", parsed);
        parsed = parsed[0];
      } else if (Array.isArray(parsed) && parsed.length === 0) {
        console.error("GeminiService: Parsed JSON is an empty array.");
        throw new Error("Received an empty array from Gemini where song data was expected.");
      }
      console.log("GeminiService: JSON parsed successfully.");
      return parsed as T;
    } catch (e) {
      console.error("GeminiService: Failed to parse JSON response from Gemini.", e);
      console.error("GeminiService: Raw JSON string that failed to parse (first 500 chars):", jsonStr.substring(0, 500));
      throw new Error(`Failed to parse Gemini's JSON response. Error: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  async getSongForGuessing(level: number, excludedSongTitles: string[]): Promise<SongData> {
    const prompt = GENERATE_SONG_PROMPT_TEMPLATE(level, excludedSongTitles);
    console.log("GeminiService: getSongForGuessing called. Level:", level, "Excluded:", excludedSongTitles.length);
    // console.debug("GeminiService: Full prompt for getSongForGuessing:\n", prompt); // Log full prompt only if necessary for deep debugging

    try {
      console.log(`GeminiService: Sending request to Gemini model: ${GEMINI_TEXT_MODEL} for song data.`);
      const response: GenerateContentResponse = await this.ai.models.generateContent({
        model: GEMINI_TEXT_MODEL,
        contents: prompt,
        config: { responseMimeType: "application/json", temperature: 0.7 },
      });
      
      console.log("GeminiService: Received response from Gemini for song data.");
      // console.debug("GeminiService: Raw response text:", response.text); // Sensitive, log only if needed

      const geminiData = this.parseGeminiJsonResponse<GeminiSongResponse>(response.text);

      if (!geminiData || !geminiData.songTitle || !geminiData.clues || !Array.isArray(geminiData.clues) || geminiData.clues.length === 0 || !geminiData.imagePrompt) {
        console.error("GeminiService: Invalid song data structure received from Gemini.", geminiData);
        throw new Error("Invalid or incomplete song data structure received from Gemini.");
      }
      
      console.log("GeminiService: Successfully processed song data from Gemini:", geminiData.songTitle);
      return {
        title: geminiData.songTitle,
        clues: geminiData.clues,
        imagePrompt: geminiData.imagePrompt,
      };
    } catch (error) {
      console.error(`GeminiService: Error in getSongForGuessing for level ${level}.`, error);
      // Rethrow the error to be handled by App.tsx
      throw error instanceof Error ? error : new Error(`Unknown error in getSongForGuessing: ${String(error)}`);
    }
  }

  async generateImageFromPrompt(prompt: string): Promise<string> {
    console.log("GeminiService: generateImageFromPrompt called.");
    // console.debug("GeminiService: Original image prompt:", prompt);
    try {
      const enhancedPrompt = `${prompt}, The Weeknd XO Noir aesthetic, cinematic, neon noir, moody lighting, high detail, 8k`;
      console.log(`GeminiService: Sending request to Imagen model: ${IMAGEN_MODEL}. Enhanced Prompt: ${enhancedPrompt.substring(0,100)}...`);
      
      const response = await this.ai.models.generateImages({
        model: IMAGEN_MODEL,
        prompt: enhancedPrompt,
        config: { numberOfImages: 1, outputMimeType: 'image/jpeg' },
      });

      console.log("GeminiService: Received response from Imagen.");
      if (response.generatedImages && response.generatedImages.length > 0 && response.generatedImages[0].image.imageBytes) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        console.log("GeminiService: Image generated successfully.");
        return `data:image/jpeg;base64,${base64ImageBytes}`;
      } else {
        console.warn("GeminiService: No image generated or image data missing from Imagen response. Using placeholder.");
        return `https://picsum.photos/seed/${encodeURIComponent(prompt.slice(0,20))}/800/450?grayscale&blur=2`; // Thematic placeholder
      }
    } catch (error) {
      console.error("GeminiService: Imagen API error:", error);
      console.warn("GeminiService: Falling back to placeholder image due to Imagen error.");
      return `https://picsum.photos/seed/${encodeURIComponent(prompt.slice(0,20))}/800/450?grayscale&blur=2`; // Thematic placeholder
    }
  }
}
