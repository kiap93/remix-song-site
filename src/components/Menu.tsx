/**
 * Menu Component
 * 
 * This file renders the main menu of the Lyria Rhythm game.
 * It allows the user to select the duration mode (Quick Test or Full Song)
 * and start the generation process, or open the Song Library.
 * 
 * Use Cases:
 * - Display game instructions and controls.
 * - Select between 30s and 100s track generation.
 * - Navigate to the pre-generated Song Library.
 */

import React, { useState } from 'react';
import { DurationMode, Style, Difficulty, GenerationOptions } from '../types';
import { Library, Music, Zap, Clock, Play } from 'lucide-react';
import { FEATURED_SONGS, LibrarySong } from '../game/songs';

/**
 * Props for the Menu component.
 */
interface MenuProps {
  /** Callback fired when the user clicks "Generate Song & Play" */
  onStart: (options: GenerationOptions) => void;
  /** Callback fired when the user selects a pre-generated song */
  onSelectLibrarySong: (song: LibrarySong) => void;
  /** Optional error message to display */
  errorMsg?: string | null;
  /** Whether the user has selected an API key */
  hasKey: boolean;
  /** Callback to open the API key selection dialog */
  onSelectKey: () => void;
}

/**
 * Renders the main menu interface.
 */
export function Menu({ onStart, onSelectLibrarySong, errorMsg, hasKey, onSelectKey }: MenuProps) {
  const [mode, setMode] = useState<DurationMode>('full');
  const [style, setStyle] = useState<Style>('electronic');
  const [customStyle, setCustomStyle] = useState<string>('');
  const [difficulty, setDifficulty] = useState<Difficulty>('normal');

  const STYLES: { value: Style, label: string }[] = [
    { value: 'electronic', label: 'Electronic' },
    { value: 'rock', label: 'Rock' },
    { value: 'pop', label: 'Pop' },
    { value: 'hiphop', label: 'Hip Hop' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'custom', label: 'Custom' },
  ];

  const DIFFICULTIES: { value: Difficulty, label: string }[] = [
    { value: 'easy', label: 'Easy' },
    { value: 'normal', label: 'Normal' },
    { value: 'hard', label: 'Hard' },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl text-center">
        <h1 className="text-7xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400">
          LYRIA RHYTHM
        </h1>
        <p className="text-xl mb-12 text-zinc-400 leading-relaxed max-w-3xl mx-auto">
          Experience a rhythm game where the music is generated on the fly by Google's Lyria model.
          The track follows a strict structure of intros, verses, and choruses with varying energy levels, 
          and the beatmap is generated to match perfectly.
        </p>

        {/* Featured Tracks Section */}
        {FEATURED_SONGS.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-6 text-zinc-200 text-left">Featured Tracks</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURED_SONGS.slice(0, 3).map((song) => (
                <div 
                  key={song.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all group cursor-pointer"
                  onClick={() => onSelectLibrarySong(song)}
                >
                  <div className="aspect-square bg-zinc-800 relative overflow-hidden">
                    {song.coverUrl ? (
                      <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-zinc-700">
                        <Music size={48} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black pl-1">
                        <Play size={24} />
                      </div>
                    </div>
                  </div>
                  <div className="p-4 text-left">
                    <h3 className="font-bold text-lg text-white mb-1 truncate">{song.title}</h3>
                    <p className="text-zinc-400 text-sm mb-3 truncate">{song.artist}</p>
                    <div className="flex items-center gap-3 text-xs font-medium">
                      <span className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-md">{song.duration}</span>
                      <span className="px-2 py-1 bg-zinc-800 text-zinc-300 rounded-md">{song.difficulty}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8 text-left">
          <h2 className="text-2xl font-bold text-zinc-200">Make Your Own Track</h2>
          <p className="text-zinc-500 text-sm mt-1">Generate a unique song and beatmap instantly.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Duration Selection */}
          <div className="flex flex-col items-center bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2 mb-4 text-zinc-400">
              <Clock size={20} />
              <h3 className="text-sm font-bold uppercase tracking-widest">Duration</h3>
            </div>
            <div className="flex flex-col gap-2 w-full">
              <button 
                onClick={() => setMode('quick')}
                className={`px-4 py-3 rounded-xl transition-all ${mode === 'quick' ? 'bg-white text-black font-bold' : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'}`}
              >
                Quick Test (30s)
              </button>
              <button 
                onClick={() => setMode('full')}
                className={`px-4 py-3 rounded-xl transition-all ${mode === 'full' ? 'bg-white text-black font-bold' : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'}`}
              >
                Full Song (100s)
              </button>
            </div>
          </div>

          {/* Style Selection */}
          <div className="flex flex-col items-center bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2 mb-4 text-zinc-400">
              <Music size={20} />
              <h3 className="text-sm font-bold uppercase tracking-widest">Style</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full mb-2">
              {STYLES.map(s => (
                <button 
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={`px-3 py-2 text-sm rounded-xl transition-all ${style === s.value ? 'bg-indigo-500 text-white font-bold' : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'}`}
                >
                  {s.label}
                </button>
              ))}
            </div>
            {style === 'custom' && (
              <input
                type="text"
                placeholder="e.g. 8-bit chiptune, orchestral dubstep..."
                value={customStyle}
                onChange={(e) => setCustomStyle(e.target.value)}
                className="w-full mt-2 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            )}
          </div>

          {/* Difficulty Selection */}
          <div className="flex flex-col items-center bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
            <div className="flex items-center gap-2 mb-4 text-zinc-400">
              <Zap size={20} />
              <h3 className="text-sm font-bold uppercase tracking-widest">Difficulty</h3>
            </div>
            <div className="flex flex-col gap-2 w-full">
              {DIFFICULTIES.map(d => (
                <button 
                  key={d.value}
                  onClick={() => setDifficulty(d.value)}
                  className={`px-4 py-2 rounded-xl transition-all ${difficulty === d.value ? 'bg-pink-500 text-white font-bold' : 'bg-zinc-950 text-zinc-400 hover:text-zinc-200 border border-zinc-800'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 text-left bg-zinc-900 p-6 rounded-2xl border border-zinc-800">
          <div>
            <h3 className="font-bold text-zinc-200 mb-2">Track Structure</h3>
            {mode === 'full' ? (
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>0:00 - Intro (Energy 3/10)</li>
                <li>0:10 - Verse 1 (Energy 5/10)</li>
                <li>0:30 - Chorus 1 (Energy 8/10)</li>
                <li>0:50 - Verse 2 (Energy 4/10)</li>
                <li>1:10 - Chorus 2 (Energy 10/10)</li>
                <li>1:30 - Outro (Energy 3/10)</li>
              </ul>
            ) : (
              <ul className="text-sm text-zinc-400 space-y-1">
                <li>0:00 - Intro (Energy 3/10)</li>
                <li>0:10 - Chorus (Energy 9/10)</li>
                <li>0:20 - Outro (Energy 3/10)</li>
              </ul>
            )}
            <p className="text-xs text-zinc-500 mt-4">
              BPM is fixed based on difficulty:<br/>
              Easy: 90 | Normal: 128 | Hard: 150
            </p>
          </div>
          <div>
            <h3 className="font-bold text-zinc-200 mb-2">Controls</h3>
            <div className="flex items-center space-x-2 mt-4">
              <kbd className="px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 font-mono text-sm">←</kbd>
              <kbd className="px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 font-mono text-sm">↓</kbd>
              <kbd className="px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 font-mono text-sm">↑</kbd>
              <kbd className="px-3 py-2 bg-zinc-800 rounded-lg border border-zinc-700 font-mono text-sm">→</kbd>
            </div>
            <p className="text-xs text-zinc-500 mt-4">Use the arrow keys to hit the notes as they cross the targets.</p>
          </div>
        </div>

        {errorMsg && (
          <div className="mb-8 p-4 bg-red-900/50 border border-red-500/50 rounded-xl text-red-200 text-sm max-w-2xl mx-auto text-left">
            <strong className="font-bold block mb-1">Error:</strong>
            <span className="break-words">{errorMsg}</span>
          </div>
        )}

        {/* <div className="flex gap-4 justify-center">
          {!hasKey ? (
            <button 
              onClick={onSelectKey}
              className="px-10 py-5 bg-purple-600 text-white font-bold rounded-full text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(168,85,247,0.4)] cursor-pointer"
            >
              Select API Key
            </button>
          ) : (
            <button 
              onClick={() => {
                const finalStyle = style === 'custom' && customStyle.trim() !== '' ? customStyle.trim() : style;
                console.info("Menu: Starting game generation", { mode, style: finalStyle, difficulty });
                onStart({ mode, style: finalStyle, difficulty, theme: '' });
              }}
              className="px-10 py-5 bg-white text-black font-bold rounded-full text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(255,255,255,0.3)] cursor-pointer"
            >
              Generate Song & Play
            </button>
          )}
        </div> */}
      </div>
    </div>
  );
}
