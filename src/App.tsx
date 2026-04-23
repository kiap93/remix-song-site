/**
 * Main Application Component
 * 
 * This file orchestrates the different states of the Lyria Rhythm game.
 * It handles the transitions between the main menu, the song library, 
 * the generation loading screen, the active gameplay, and the results screen.
 * 
 * Use Cases:
 * - Start a new game (quick or full duration).
 * - Select a pre-generated song from the library.
 * - View game results and restart.
 */

import React, { useState } from 'react';
import { Menu } from './components/Menu';
import { Generating } from './components/Generating';
import { Game } from './components/Game';
import { Result } from './components/Result';
import { AdSense } from './components/AdSense';
import { generateSong } from './services/audioService';
import { generateBeatmap, generatePrompt, getStructure } from './game/beatmap';
import { Note, GameResult, DurationMode, GenerationOptions } from './types';
import { LibrarySong } from './game/songs';

type AppState = 'menu' | 'generating' | 'loading' | 'playing' | 'result';

/**
 * The root App component that manages the global state of the game.
 */
export default function App() {
  const [appState, setAppState] = useState<AppState>('menu');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [beatmap, setBeatmap] = useState<Note[]>([]);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState<boolean>(true);

  React.useEffect(() => {
    const checkKey = async () => {
      if (window.aistudio?.hasSelectedApiKey) {
        try {
          const has = await window.aistudio.hasSelectedApiKey();
          setHasKey(has);
        } catch (e) {
          console.error("Failed to check API key", e);
        }
      }
    };
    checkKey();
  }, []);

  const handleSelectKey = async () => {
    if (window.aistudio?.openSelectKey) {
      try {
        await window.aistudio.openSelectKey();
        setHasKey(true);
      } catch (e) {
        console.error("Failed to open select key dialog", e);
      }
    }
  };

  /**
   * Starts the generation process for a new song.
   * 
   * @param options - The selected generation options.
   */
  const handleStart = async (options: GenerationOptions) => {
    console.info("handleStart called", { options });
    setErrorMsg(null);

    setAppState('generating');
    
    try {
      const structure = getStructure(options);
      const prompt = generatePrompt(structure, options);
      const { url, blob } = await generateSong(prompt, options.mode, (text) => {
        // We no longer update UI with raw text, but we keep the callback for debugging/logging
        console.debug("Generation progress:", text);
      });
      
      const map = generateBeatmap(structure, options);
      
      setAudioUrl(url);
      setAudioBlob(blob);
      setBeatmap(map);
      setAppState('playing');
    } catch (error) {
      console.error("Error generating song:", error);
      const err = error as Error;
      if (err.message.includes("Requested entity was not found") || err.message.includes("PERMISSION_DENIED") || err.message.includes("403")) {
        setHasKey(false);
      }
      setErrorMsg('Failed to generate song: ' + err.message);
      setAppState('menu');
    }
  };

  /**
   * Selects a pre-generated song from the library to play immediately.
   * 
   * @param song - The selected library song object.
   */
  const handleSelectLibrarySong = async (song: LibrarySong) => {
    console.info("handleSelectLibrarySong called", { songId: song.id, songTitle: song.title });
    setAppState('loading');
    setErrorMsg(null);

    try {
      const response = await fetch(song.beatmapUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch beatmap: ${response.statusText}`);
      }
      const beatmapData: Note[] = await response.json();
      
      // Ensure no notes in the first 3 seconds for library songs as well
      const filteredBeatmap = beatmapData.filter(n => n.time >= 3);
      
      setAudioUrl(song.audioUrl);
      setAudioBlob(null);
      setBeatmap(filteredBeatmap);
      setAppState('playing');
    } catch (error) {
      console.error("Error loading library song:", error);
      setErrorMsg('Failed to load song: ' + (error as Error).message);
      setAppState('menu');
    }
  };

  /**
   * Handles the completion of the game and displays the results.
   * 
   * @param result - The final game statistics (score, combo, accuracy).
   */
  const handleGameComplete = (result: GameResult) => {
    console.info("handleGameComplete called", { result });
    setGameResult({
      ...result,
      audioBlob: audioBlob || undefined,
      beatmap: beatmap
    });
    setAppState('result');
  };

  /**
   * Replays the current track.
   */
  const handleReplay = () => {
    console.info("handleReplay called");
    // Reset the beatmap notes' hit/missed states
    const resetBeatmap = beatmap.map(note => ({ ...note, hit: false, missed: false }));
    setBeatmap(resetBeatmap);
    setGameResult(null);
    setAppState('playing');
  };

  /**
   * Resets the game state to return to the main menu.
   */
  const handleRestart = () => {
    console.info("handleRestart called");
    setAppState('menu');
    setAudioUrl(null);
    setAudioBlob(null);
    setBeatmap([]);
    setGameResult(null);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950">
      <div className="flex-grow flex flex-col">
        {appState === 'menu' && <Menu onStart={handleStart} onSelectLibrarySong={handleSelectLibrarySong} errorMsg={errorMsg} hasKey={hasKey} onSelectKey={handleSelectKey} />}
        {appState === 'generating' && <Generating />}
        {appState === 'loading' && (
          <div className="flex flex-col items-center justify-center flex-grow text-white p-8">
            <div className="relative w-16 h-16 mb-8">
              <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Loading track...</h2>
          </div>
        )}
        {appState === 'playing' && audioUrl && <Game audioUrl={audioUrl} beatmap={beatmap} onComplete={handleGameComplete} onStop={handleRestart} />}
        {appState === 'result' && gameResult && <Result result={gameResult} onReplay={handleReplay} onMenu={handleRestart} />}
      </div>
      
      {/* Show ads only on non-gameplay screens if preferred, or everywhere */}
      {(appState === 'menu' || appState === 'result') && <AdSense />}
    </div>
  );
}
