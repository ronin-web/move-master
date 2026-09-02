// Environment Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';
export const CHESS_COM_API = 'https://api.chess.com/pub';
export const LICHESS_API = 'https://lichess.org/api';

// Engine Configuration
export const STOCKFISH_DEPTH = 25;
export const STOCKFISH_NODES = 3500000;
export const ENGINE_ANALYSIS_TIMEOUT = 30000; // 30 seconds

// Game Classifications
export const MOVE_CLASSIFICATIONS = {
  BEST: 'best',
  EXCELLENT: 'excellent',
  GOOD: 'good',
  INACCURACY: 'inaccuracy',
  MISTAKE: 'mistake',
  BLUNDER: 'blunder',
} as const;

// Evaluation Thresholds (centipawns)
export const EVALUATION_THRESHOLDS = {
  // For white (positive values)
  BEST_THRESHOLD: 20, // Within 20cp of best move
  EXCELLENT_THRESHOLD: 50, // Within 50cp
  GOOD_THRESHOLD: 100, // Within 100cp
  INACCURACY_THRESHOLD: 200, // Within 200cp
  MISTAKE_THRESHOLD: 500, // Within 500cp
  BLUNDER_THRESHOLD: Infinity, // Anything worse
} as const;

// Time Controls
export const TIME_CONTROLS = {
  BULLET: 'bullet',
  BLITZ: 'blitz',
  RAPID: 'rapid',
  CLASSICAL: 'classic',
} as const;

// Pagination
export const ITEMS_PER_PAGE = 20;
export const MAX_ITEMS_PER_PAGE = 100;

// Cache Duration (in milliseconds)
export const CACHE_DURATION = {
  PROFILE: 5 * 60 * 1000, // 5 minutes
  GAMES: 10 * 60 * 1000, // 10 minutes
  ANALYSIS: 60 * 60 * 1000, // 1 hour
} as const;

// UI Constants
export const TOAST_DURATION = 4000;
export const ANIMATION_DURATION = 300;
export const DEBOUNCE_DELAY = 300;

// Messages
export const MESSAGES = {
  LOADING_GAMES: 'Loading games...',
  ANALYZING_GAME: 'Analyzing game...',
  ERROR_LOADING_GAMES: 'Failed to load games. Please try again.',
  ERROR_LOADING_PROFILE: 'Failed to load player profile.',
  INVALID_USERNAME: 'Invalid username. Please check and try again.',
  ANALYSIS_COMPLETE: 'Game analysis complete!',
  COPY_SUCCESS: 'Copied to clipboard!',
  COPY_ERROR: 'Failed to copy to clipboard.',
} as const;
