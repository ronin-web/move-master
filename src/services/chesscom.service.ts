import axios, { AxiosInstance, AxiosError } from 'axios';
import { CHESS_COM_API, LICHESS_API } from '@constants/app';
import { ChessGame, PlayerProfile, RatingInfo } from '@types/chess';

/**
 * Chess.com API Service
 * Handles all Chess.com related API calls
 */
class ChessComService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: CHESS_COM_API,
      timeout: 10000,
      headers: {
        'User-Agent': 'MoveMaster/1.0 (+https://github.com/ronin-web/move-master)',
      },
    });
  }

  /**
   * Get player profile information
   */
  async getPlayerProfile(username: string): Promise<PlayerProfile> {
    try {
      const response = await this.client.get(`/player/${username}`);
      const data = response.data;

      return {
        username: data.username,
        platform: 'chess.com',
        avatar: data.avatar,
        title: data.title,
        followers: data.followers,
        following: data.following,
      };
    } catch (error) {
      throw this.handleError(error, `Failed to fetch profile for ${username}`);
    }
  }

  /**
   * Get player's rating statistics
   */
  async getPlayerStats(username: string): Promise<PlayerProfile['stats']> {
    try {
      const response = await this.client.get(`/player/${username}/stats`);
      const stats: Record<string, any> = response.data;

      const result: PlayerProfile['stats'] = {};

      if (stats.chess_bullet)
        result.bullet = this.parseRatingInfo(stats.chess_bullet);
      if (stats.chess_blitz)
        result.blitz = this.parseRatingInfo(stats.chess_blitz);
      if (stats.chess_rapid)
        result.rapid = this.parseRatingInfo(stats.chess_rapid);
      if (stats.chess_classical)
        result.classic = this.parseRatingInfo(stats.chess_classical);

      return result;
    } catch (error) {
      throw this.handleError(error, `Failed to fetch stats for ${username}`);
    }
  }

  /**
   * Get player's games for a specific month
   */
  async getPlayerGames(
    username: string,
    year: number,
    month: number
  ): Promise<ChessGame[]> {
    try {
      const response = await this.client.get(
        `/player/${username}/games/${year}/${month}`
      );
      return response.data.games || [];
    } catch (error) {
      throw this.handleError(
        error,
        `Failed to fetch games for ${username} ${year}/${month}`
      );
    }
  }

  /**
   * Get player's game archives
   */
  async getGameArchives(username: string): Promise<string[]> {
    try {
      const response = await this.client.get(`/player/${username}/games/archives`);
      return response.data.archives || [];
    } catch (error) {
      throw this.handleError(error, `Failed to fetch game archives for ${username}`);
    }
  }

  /**
   * Parse rating info from API response
   */
  private parseRatingInfo(data: any): RatingInfo {
    return {
      rating: data.last?.rating || 0,
      ratingDiff: data.last?.ratingDiff,
      wins: data.record?.wins || 0,
      losses: data.record?.losses || 0,
      draws: data.record?.draws || 0,
      games: (data.record?.wins || 0) + (data.record?.losses || 0) + (data.record?.draws || 0),
      lastGame: data.last?.date,
    };
  }

  /**
   * Handle and normalize API errors
   */
  private handleError(error: unknown, defaultMessage: string): Error {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 404) {
        return new Error('Player not found');
      }
      if (axiosError.response?.status === 429) {
        return new Error('Rate limited. Please try again later.');
      }
      if (axiosError.message === 'Network Error') {
        return new Error('Network error. Please check your connection.');
      }
    }
    return new Error(defaultMessage);
  }
}

export default new ChessComService();
