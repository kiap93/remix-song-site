import React from 'react';
import { GameResult } from '../types';
import { Download } from 'lucide-react';

export function Result({ result, onReplay, onMenu }: { result: GameResult, onReplay: () => void, onMenu: () => void }) {
  const totalNotes = result.perfects + result.greats + result.goods + result.misses;
  const accuracy = totalNotes > 0 
    ? ((result.perfects + result.greats * 0.8 + result.goods * 0.5) / totalNotes * 100).toFixed(2) 
    : "0.00";

  const downloadAudio = () => {
    if (!result.audioBlob) return;
    const url = URL.createObjectURL(result.audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lyria-track.wav';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadBeatmap = () => {
    if (!result.beatmap) return;
    const data = JSON.stringify(result.beatmap, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'beatmap.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-2xl w-full bg-zinc-900 p-12 rounded-3xl border border-zinc-800 text-center">
        <h2 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
          STAGE CLEARED
        </h2>
        <div className="text-7xl font-bold mb-12">{result.score.toLocaleString()}</div>
        
        <div className="grid grid-cols-2 gap-8 mb-12 text-left">
          <div className="space-y-4">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Max Combo</span>
              <span className="font-bold">{result.maxCombo}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-400">Accuracy</span>
              <span className="font-bold">{accuracy}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-yellow-500">
              <span>Perfect</span>
              <span className="font-bold">{result.perfects}</span>
            </div>
            <div className="flex justify-between text-green-500">
              <span>Great</span>
              <span className="font-bold">{result.greats}</span>
            </div>
            <div className="flex justify-between text-cyan-500">
              <span>Good</span>
              <span className="font-bold">{result.goods}</span>
            </div>
            <div className="flex justify-between text-red-500">
              <span>Miss</span>
              <span className="font-bold">{result.misses}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-4 justify-center">
            <button 
              onClick={downloadAudio}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Download size={18} /> Audio
            </button>
            <button 
              onClick={downloadBeatmap}
              className="flex items-center gap-2 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-colors cursor-pointer"
            >
              <Download size={18} /> Beatmap
            </button>
          </div>
          
          <div className="flex gap-4 justify-center mt-4">
            <button 
              onClick={onReplay}
              className="px-8 py-4 bg-white text-black font-bold rounded-full text-lg hover:scale-105 transition-transform cursor-pointer flex-1"
            >
              Play Again
            </button>
            <button 
              onClick={onMenu}
              className="px-8 py-4 bg-zinc-800 text-white font-bold rounded-full text-lg hover:scale-105 transition-transform cursor-pointer flex-1"
            >
              Play Another Track
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
