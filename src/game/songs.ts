import { Note } from '../types';

export interface LibrarySong {
  id: string;
  title: string;
  artist: string;
  duration: string;
  difficulty: string;
  audioUrl: string;
  beatmapUrl: string;
  coverUrl: string;
}

// This is where users can add their exported songs
export const FEATURED_SONGS: LibrarySong[] = [
  {
  id: 'Jazz_easy',
  title: 'Jazz (Easy)',
  artist: 'Giom',
  duration: '1:40', // Display duration
  difficulty: 'Easy', // Easy, Medium, Hard, etc.
  audioUrl: 'https://storage.googleapis.com/generativeai-downloads/images/jazz_easy.wav',
  beatmapUrl: 'https://storage.googleapis.com/generativeai-downloads/images/jazz_easy.json',
  coverUrl: 'https://storage.googleapis.com/generativeai-downloads/images/jazz_easy.jpg'
},
  {
  id: 'Eurobeat_medium',
  title: 'Eurobeat (Medium)',
  artist: 'Giom',
  duration: '1:40', // Display duration
  difficulty: 'Medium', // Easy, Medium, Hard, etc.
  audioUrl: 'https://storage.googleapis.com/generativeai-downloads/images/eurobeat_medium.wav',
  beatmapUrl: 'https://storage.googleapis.com/generativeai-downloads/images/eurobeat_medium.json',
  coverUrl: 'https://storage.googleapis.com/generativeai-downloads/images/eurobeat_medium.jpg'
},
  {
  id: 'K_pop_hard',
  title: 'K-pop (Hard)',
  artist: 'Giom',
  duration: '1:40', // Display duration
  difficulty: 'Hard', // Easy, Medium, Hard, etc.
  audioUrl: 'https://storage.googleapis.com/generativeai-downloads/images/k_pop_hard.wav',
  beatmapUrl: 'https://storage.googleapis.com/generativeai-downloads/images/k_pop_hard.json',
  coverUrl: 'https://storage.googleapis.com/generativeai-downloads/images/k_pop_hard.jpg'
},
];
