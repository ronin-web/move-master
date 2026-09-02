/**
 * Utility functions for chess operations
 */

/**
 * Convert evaluation centipawns to readable format
 */
export function formatEvaluation(centipawns: number | null): string {
  if (centipawns === null) return '...';
  
  if (Math.abs(centipawns) > 30000) {
    // Checkmate
    const moves = Math.ceil(Math.abs(centipawns) / 30000);
    return centipawns > 0 ? `+M${moves}` : `-M${moves}`;
  }

  const pawns = (centipawns / 100).toFixed(1);
  if (centipawns > 0) {
    return `+${pawns}`;
  }
  return pawns;
}

/**
 * Convert FEN to current position description
 */
export function fenToPosition(fen: string): string {
  const parts = fen.split(' ');
  return parts[0]; // Return board position part
}

/**
 * Get color from move number
 */
export function getMoveColor(moveNumber: number): 'white' | 'black' {
  return moveNumber % 2 === 1 ? 'white' : 'black';
}

/**
 * Format move notation
 */
export function formatMove(move: string): string {
  return move.toUpperCase();
}

/**
 * Validate chess.com username
 */
export function validateChessComUsername(username: string): boolean {
  return /^[a-z0-9_-]{1,20}$/i.test(username);
}

/**
 * Validate Lichess username
 */
export function validateLichessUsername(username: string): boolean {
  return /^[a-z0-9_-]{1,30}$/i.test(username);
}

/**
 * Calculate game duration in seconds
 */
export function calculateGameDuration(
  startTime: number,
  endTime: number
): number {
  return Math.floor((endTime - startTime) / 1000);
}

/**
 * Format duration as HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}

/**
 * Get move number display (1. for white, ... for black)
 */
export function getMoveNumberDisplay(
  moveIndex: number
): string {
  const moveNumber = Math.floor(moveIndex / 2) + 1;
  if (moveIndex % 2 === 0) {
    return `${moveNumber}.`;
  }
  return '';
}
