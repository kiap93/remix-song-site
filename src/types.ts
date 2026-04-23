export interface SongSection {
  name: string;
  startTime: number;
  endTime: number;
  energy: number;
  description: string;
}

export interface Note {
  time: number;
  column: number;
  hit: boolean;
  missed: boolean;
}

export interface GameResult {
  score: number;
  combo: number;
  maxCombo: number;
  perfects: number;
  greats: number;
  goods: number;
  misses: number;
  audioBlob?: Blob;
  beatmap?: Note[];
}

export type DurationMode = 'quick' | 'full';

export type Difficulty = 'easy' | 'normal' | 'hard';
export type Style = 'electronic' | 'rock' | 'pop' | 'hiphop' | 'jazz' | 'custom';

export interface GenerationOptions {
  mode: DurationMode;
  style: string;
  theme: string;
  difficulty: Difficulty;
}

declare global {
  interface Window {
    aistudio?: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}
