# Lyria Rhythm - Design Document

## Overview
Lyria Rhythm is an AI-powered rhythm game where the music is generated on the fly using Google's Lyria models via the `@google/genai` SDK. The game generates a strict beatmap based on predefined song structures (BPM and duration) and prompts the AI to compose a track that perfectly matches that structure.

## Features

### 1. Song Generation
- **Full Song Mode**: Generates a 100-second track using the `lyria-3-pro-preview` model. The structure includes an Intro, Verse 1, Chorus 1, Verse 2, Chorus 2, and Outro with varying BPMs (90 to 150).
- **Quick Test Mode**: Generates a 30-second track using the `lyria-3-clip-preview` model. The structure includes a 10s Intro, 10s Chorus, and 10s Outro.
- **Streaming Audio**: The audio is streamed from the GenAI model, accumulating base64 chunks and converting them into a playable Blob URL.

### 2. Beatmap Generation
- The beatmap is generated deterministically based on the selected song structure.
- Notes are placed according to the BPM of each section (quarter notes, with occasional 8th notes for higher BPMs).
- The beatmap is perfectly synced with the generated audio because the AI is prompted to strictly follow the timing and BPM instructions.

### 3. Gameplay
- **HTML5 Canvas Engine**: Custom rendering engine for scrolling notes and hit targets.
- **Controls**: Arrow keys (Left, Down, Up, Right) correspond to the 4 columns.
- **Scoring System**: Calculates accuracy based on the timing of the key press relative to the note's arrival at the target line (Perfect, Great, Good, Miss).
- **Combo**: Tracks consecutive hits, resetting on a miss.

### 4. Export & Library
- **Export**: After completing a song, users can download the generated audio (`.wav`) and the corresponding beatmap (`.json`).
- **Song Library**: Users can play pre-generated songs without waiting for the AI. Exported songs can be added to `src/game/songs.ts` to appear in the library.

## Architecture & Guidelines
- **Centralized Config**: Model names and other configurations are stored in `src/config.ts`.
- **Logging**: All major function calls and GenAI interactions are logged using `console.info` for debugging and tracing.
- **Documentation**: All files start with a descriptive header, and all functions have detailed docstrings.
- **Separation of Concerns**: 
  - `audioService.ts`: Handles GenAI API calls.
  - `beatmap.ts`: Handles song structure and note generation.
  - `Game.tsx`: Handles the rendering and input logic.
  - `App.tsx`: Orchestrates the state machine (Menu -> Generating -> Playing -> Result).
