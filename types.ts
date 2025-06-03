export enum GameStatus {
  LOADING_CONFIG = 'LOADING_CONFIG',
  LANDING_SCREEN = 'LANDING_SCREEN',
  SHOWING_GAME_MODES = 'SHOWING_GAME_MODES',
  SHOWING_PROFILE_SCREEN = 'SHOWING_PROFILE_SCREEN', // New
  MULTIPLAYER_LOBBY = 'MULTIPLAYER_LOBBY', // UI Placeholder
  LOADING_SONG = 'LOADING_SONG',
  GUESSING = 'GUESSING',
  SUBMITTING_GUESS = 'SUBMITTING_GUESS',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  REVEALED_ANSWER = 'REVEALED_ANSWER',
  SONG_SKIPPED_REVEALED = 'SONG_SKIPPED_REVEALED',
  LEVEL_UP_TRANSITION = 'LEVEL_UP_TRANSITION', // Could also be Rank Up
  VIEWING_LEADERBOARD = 'VIEWING_LEADERBOARD', // UI Placeholder
  VIEWING_STATS = 'VIEWING_STATS', // UI Placeholder
  ERROR = 'ERROR',
}

export enum GameMode {
  SOLO = 'SOLO',
  GROUP_CHALLENGE = 'GROUP_CHALLENGE', // Placeholder
  KNOCKOUT = 'KNOCKOUT',               // Placeholder
  RANK_LADDER = 'RANK_LADDER',         // Placeholder
}

export interface SongData {
  title: string;
  clues: string[];
  imagePrompt: string;
}

export interface GeminiSongResponse {
  songTitle: string;
  clues: string[];
  imagePrompt: string;
}

export type FeedbackType = 'correct' | 'incorrect' | 'info' | 'warning' | 'error' | 'skipped' | 'success' | null;

export interface RankingTier {
  name: string;
  minXp: number;
  badge?: string; // Placeholder for badge image/icon
}

export interface UserProfile {
  username: string;
  xp: number;
  level: number; // Solo mode level
  currentRankingTierName: string;
  playedSongTitles: string[]; // Optional: to sync across devices if backend existed
  // Add any other stats you want to save with the profile
}

export interface GameState {
  status: GameStatus;
  userProfile: UserProfile | null; // New
  currentSong: SongData | null;
  currentSongImage: string | null;
  userGuess: string;
  score: number; // Kept for now, could be derived or specific to solo level
  level: number; // Current solo level, potentially part of profile
  songsCorrectThisLevel: number;
  feedbackMessage: string | null; // Screen-specific feedback
  feedbackType: FeedbackType;
  errorMessage: string | null;
  playedSongTitles: string[]; // Current session's played titles
  revealedCluesCount: number;
  
  // XO Noir specific state
  xp: number; // Current session XP, to be synced with profile
  currentRankingTierName: string; // Current session rank, to be synced
  selectedGameMode: GameMode | null;
  // For multiplayer (placeholders)
  players: { id: string, name: string, score: number, isReady?: boolean, isEliminated?: boolean }[]; 
  roomCode: string | null;
  isHost: boolean;

  // Global feedback
  globalFeedbackMessage: string | null;
  globalFeedbackType: FeedbackType;
}

// For older structure, can be removed if not used by any old component traces.
export interface Choice {
  id: string;
  text: string;
}
export interface StoryPathEntry {
  scenario: string;
  choiceMade: string;
}