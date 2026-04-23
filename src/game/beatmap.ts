/**
 * Beatmap Generator
 * 
 * This file contains the logic for defining song structures and generating
 * the corresponding prompts for the Lyria model. It also generates the 
 * playable beatmap (notes) based on the BPM and duration of each section.
 * 
 * Use Cases:
 * - Define the structure for full songs and quick tests.
 * - Generate a text prompt for the GenAI model to compose the track.
 * - Generate the rhythm game notes (beatmap) that match the generated audio.
 */

import { Note, SongSection, GenerationOptions } from '../types';

export const FULL_SONG_STRUCTURE: SongSection[] = [
  { name: "Intro", startTime: 0, endTime: 10, energy: 3, description: "Slow and atmospheric" },
  { name: "Verse 1", startTime: 10, endTime: 30, energy: 5, description: "Building energy" },
  { name: "Chorus 1", startTime: 30, endTime: 50, energy: 8, description: "Uplifting and energetic" },
  { name: "Verse 2", startTime: 50, endTime: 70, energy: 4, description: "Slower and rhythmic" },
  { name: "Chorus 2", startTime: 70, endTime: 90, energy: 10, description: "Exact same as Chorus 1, uplifting and energetic" },
  { name: "Outro", startTime: 90, endTime: 100, energy: 3, description: "Fading out" },
];

export const QUICK_TEST_STRUCTURE: SongSection[] = [
  { name: "Intro", startTime: 0, endTime: 10, energy: 3, description: "Slow and atmospheric" },
  { name: "Chorus", startTime: 10, endTime: 20, energy: 9, description: "Uplifting and energetic" },
  { name: "Outro", startTime: 20, endTime: 30, energy: 3, description: "Fading out" },
];

/**
 * Retrieves the song structure based on the selected duration mode and difficulty.
 * 
 * @param options - The generation options.
 * @returns An array of SongSection defining the track's structure.
 */
export function getStructure(options: GenerationOptions): SongSection[] {
  console.info("getStructure called", { options });
  return options.mode === 'quick' ? QUICK_TEST_STRUCTURE : FULL_SONG_STRUCTURE;
}

/**
 * Generates a text prompt for the Lyria model based on the song structure and style.
 * 
 * @param sections - The array of SongSection defining the track.
 * @param options - The generation options.
 * @returns A formatted string prompt for the GenAI model.
 */
export function generatePrompt(sections: SongSection[], options: GenerationOptions): string {
  console.info("generatePrompt called", { numSections: sections.length, style: options.style });
  
  const totalDuration = sections.length > 0 ? sections[sections.length - 1].endTime : 0;
  const bpm = options.difficulty === 'easy' ? 90 : options.difficulty === 'normal' ? 128 : 150;
  
  let prompt = `Generate a ${totalDuration}-second track.\nContext: "A ${options.style} track. The song is completely instrumental until the very end."\n`;
  prompt += "Generate lyrics with precise [seconds:] timing markers.\n";
  prompt += `The track must have a constant tempo of exactly ${bpm} BPM throughout the entire song.\n`;
  prompt += "The track must have the following exact structure and energy levels:\n";
  for (const section of sections) {
    const startStr = formatTime(section.startTime);
    const endStr = formatTime(section.endTime);
    prompt += `- [${startStr}-${endStr}] ${section.name}: ${section.description}, Energy level: ${section.energy}/10.\n`;
  }
  prompt += "The track must strictly follow these timestamps and energy levels. Make it a seamless continuous track.\n\n";
  
  const lyricsTime = Math.max(0, totalDuration - 4);
  prompt += `Lyrics:\n[0:00:] (Instrumental)\n[${formatTime(lyricsTime)}:] Thank you for playing.`;
  
  return prompt;
}

/**
 * Formats seconds into a MM:SS string.
 * 
 * @param seconds - The time in seconds.
 * @returns A formatted time string.
 */
function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/**
 * Generates a beatmap (array of notes) based on the song structure and difficulty.
 * 
 * @param sections - The array of SongSection defining the track.
 * @param options - The generation options.
 * @returns An array of Note objects representing the playable beatmap.
 */
export function generateBeatmap(sections: SongSection[], options: GenerationOptions): Note[] {
  console.info("generateBeatmap called", { numSections: sections.length, difficulty: options.difficulty });
  const notes: Note[] = [];
  
  const bpm = options.difficulty === 'easy' ? 90 : options.difficulty === 'normal' ? 128 : 150;
  const beatInterval = 60 / bpm;
  
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const nextSection = i + 1 < sections.length ? sections[i + 1] : null;
    
    for (let t = section.startTime; t < section.endTime; t += beatInterval) {
      // Quarter note
      notes.push({
        time: t,
        column: Math.floor(Math.random() * 4),
        hit: false,
        missed: false
      });
      
      let addEighth = false;
      let addSixteenth = false;
      
      // Anticipate the next section's energy if it's higher and we are within 1.5 seconds of the transition.
      // This matches musical build-ups (drum fills, risers) before a drop.
      let effectiveEnergy = section.energy;
      if (nextSection && nextSection.energy > section.energy && (section.endTime - t <= 1.5)) {
        effectiveEnergy = nextSection.energy;
      }
      
      if (options.difficulty === 'easy') {
        if (effectiveEnergy >= 7 && Math.random() > 0.6) addEighth = true;
      } else if (options.difficulty === 'normal') {
        if (effectiveEnergy >= 6 && Math.random() > 0.7) addEighth = true;
        if (effectiveEnergy >= 8 && Math.random() > 0.5) addEighth = true;
      } else if (options.difficulty === 'hard') {
        if (effectiveEnergy >= 5 && Math.random() > 0.5) addEighth = true;
        if (effectiveEnergy >= 8 && Math.random() > 0.3) addEighth = true;
        if (effectiveEnergy >= 9 && Math.random() > 0.85) addSixteenth = true;
      }
      
      if (addEighth) {
         notes.push({
            time: t + beatInterval / 2,
            column: Math.floor(Math.random() * 4),
            hit: false,
            missed: false
         });
      }
      
      if (addSixteenth) {
         notes.push({
            time: t + beatInterval / 4,
            column: Math.floor(Math.random() * 4),
            hit: false,
            missed: false
         });
         notes.push({
            time: t + (beatInterval * 3) / 4,
            column: Math.floor(Math.random() * 4),
            hit: false,
            missed: false
         });
      }
    }
  }
  
  // Sort notes by time just in case
  notes.sort((a, b) => a.time - b.time);
  
  // Remove notes in the first 3 seconds to give the player a buffer
  const finalNotes = notes.filter(n => n.time >= 3);
  
  console.info("generateBeatmap completed", { totalNotes: finalNotes.length });
  return finalNotes;
}
