import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const TRIVIA = [
  "Did you know? PaRappa the Rapper (1996) is widely considered the first true rhythm game.",
  "Dance Dance Revolution (1998) revolutionized arcades with its iconic dance pad controller.",
  "Guitar Hero (2005) popularized the peripheral-based rhythm game genre, making everyone feel like a rockstar.",
  "Osu! Tatakae! Ouendan (2005) inspired the incredibly popular PC rhythm game osu!.",
  "Beat Saber (2018) brought rhythm games into virtual reality, becoming one of the best-selling VR games of all time.",
  "Vib-Ribbon (1999) allowed players to generate levels using their own music CDs.",
  "Space Channel 5 (1999) featured Michael Jackson in a cameo role as 'Space Michael'.",
  "Rhythm Heaven (2006) focuses purely on rhythm and timing without any visual cues for the beat.",
  "The first music video game was arguably 'Simon' (1978), an electronic game of memory and rhythm.",
  "Audiosurf (2008) pioneered the 'play your own music' genre on PC by generating tracks from MP3 files."
];

export function Generating() {
  const [triviaIndex, setTriviaIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTriviaIndex((prev) => (prev + 1) % TRIVIA.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-950 text-white p-8">
      <div className="relative w-24 h-24 mb-12">
        <div className="absolute inset-0 border-4 border-zinc-800 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h2 className="text-4xl font-bold mb-6 tracking-tight">Composing your track...</h2>
      
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 max-w-2xl w-full flex items-center justify-center min-h-[160px] relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={triviaIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
            className="text-zinc-300 text-lg text-center font-medium leading-relaxed absolute px-8"
          >
            {TRIVIA[triviaIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
      
      <p className="mt-8 text-zinc-500 text-sm">This may take a minute or two as the AI generates the full audio track.</p>
    </div>
  );
}
