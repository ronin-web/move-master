import { create } from 'zustand';
import { ChessGame, GameState, GameAnalysis } from '@types/chess';

interface AppState {
  // Player
  selectedUsername: string;
  selectedPlatform: 'chess.com' | 'lichess';
  setSelectedUsername: (username: string) => void;
  setSelectedPlatform: (platform: 'chess.com' | 'lichess') => void;

  // Games
  games: ChessGame[];
  selectedGame: ChessGame | null;
  isLoadingGames: boolean;
  gamesError: string | null;
  setGames: (games: ChessGame[]) => void;
  setSelectedGame: (game: ChessGame | null) => void;
  setIsLoadingGames: (loading: boolean) => void;
  setGamesError: (error: string | null) => void;

  // Game State
  gameState: GameState;
  updateGameState: (state: Partial<GameState>) => void;

  // Analysis
  gameAnalysis: GameAnalysis | null;
  isAnalyzing: boolean;
  analysisProgress: number;
  setGameAnalysis: (analysis: GameAnalysis | null) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setAnalysisProgress: (progress: number) => void;

  // UI State
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

/**
 * Main application state store using Zustand
 */
export const useAppStore = create<AppState>((set) => ({
  // Player
  selectedUsername: '',
  selectedPlatform: 'chess.com',
  setSelectedUsername: (username: string) =>
    set({ selectedUsername: username }),
  setSelectedPlatform: (platform: 'chess.com' | 'lichess') =>
    set({ selectedPlatform: platform }),

  // Games
  games: [],
  selectedGame: null,
  isLoadingGames: false,
  gamesError: null,
  setGames: (games: ChessGame[]) => set({ games }),
  setSelectedGame: (game: ChessGame | null) =>
    set({ selectedGame: game, gameState: createInitialGameState() }),
  setIsLoadingGames: (loading: boolean) =>
    set({ isLoadingGames: loading }),
  setGamesError: (error: string | null) => set({ gamesError: error }),

  // Game State
  gameState: createInitialGameState(),
  updateGameState: (state: Partial<GameState>) =>
    set((prevState) => ({
      gameState: { ...prevState.gameState, ...state },
    })),

  // Analysis
  gameAnalysis: null,
  isAnalyzing: false,
  analysisProgress: 0,
  setGameAnalysis: (analysis: GameAnalysis | null) =>
    set({ gameAnalysis: analysis }),
  setIsAnalyzing: (analyzing: boolean) => set({ isAnalyzing: analyzing }),
  setAnalysisProgress: (progress: number) =>
    set({ analysisProgress: progress }),

  // UI State
  sidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));

/**
 * Create initial game state
 */
function createInitialGameState(): GameState {
  return {
    fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
    moveHistory: [],
    currentMoveIndex: 0,
    isAnalyzing: false,
    currentEvaluation: null,
  };
}
