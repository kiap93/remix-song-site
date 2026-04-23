/**
 * Audio Service
 * 
 * This file handles the interaction with the Google GenAI SDK to generate audio
 * using the Lyria 3 models. It streams the response, accumulates the base64
 * audio data, and converts it into a playable Blob URL.
 * 
 * Use Cases:
 * - Generate a full song using the 'lyria-3-pro-preview' model.
 * - Generate a quick 30s clip using the 'lyria-3-clip-preview' model.
 */

import { GoogleGenAI, Modality } from "@google/genai";
import { DurationMode } from "../types";
import { CONFIG } from "../config";

/**
 * Generates a song using the Lyria model based on the provided prompt and duration mode.
 * 
 * @param prompt - The text prompt describing the song structure and context.
 * @param mode - The duration mode ('quick' or 'full') which determines the model used.
 * @param onProgress - Callback function to stream lyrics and metadata text back to the UI.
 * @returns A promise that resolves to an object containing the playable audio URL and the raw Blob.
 */
export async function generateSong(prompt: string, mode: DurationMode, onProgress: (text: string) => void): Promise<{ url: string, blob: Blob }> {
  console.info("generateSong called", { promptLength: prompt.length, mode });
  
  const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("API Key is not set. Please select an API key.");

  const ai = new GoogleGenAI({ apiKey });
  const modelName = mode === 'quick' ? CONFIG.models.quickClip : CONFIG.models.fullTrack;

  const genAiConfig = {
    responseModalities: [Modality.AUDIO]
  };

  console.info("Calling GenAI generateContentStream", {
    model: modelName,
    prompt: prompt,
    config: genAiConfig
  });

  const responseStream = await ai.models.generateContentStream({
    model: modelName,
    contents: prompt,
    config: genAiConfig
  });

  let audioAccumulator = "";
  let mimeType = "audio/wav";
  let textAccumulator = "";

  for await (const chunk of responseStream) {
    const parts = chunk.candidates?.[0]?.content?.parts;
    if (!parts) continue;

    for (const part of parts) {
      if (part.inlineData?.data) {
        if (!audioAccumulator && part.inlineData.mimeType) {
          mimeType = part.inlineData.mimeType;
        }
        audioAccumulator += part.inlineData.data;
      }
      if (part.text) {
        textAccumulator += part.text;
        onProgress(part.text);
      }
    }
  }

  console.info("GenAI stream completed", {
    textOutput: textAccumulator,
    audioBytesLength: audioAccumulator.length,
    mimeType
  });

  if (!audioAccumulator) {
    throw new Error("No audio data received from the model.");
  }

  const binaryString = atob(audioAccumulator);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const blob = new Blob([bytes], { type: mimeType });
  return {
    url: URL.createObjectURL(blob),
    blob
  };
}
