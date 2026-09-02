import { StockfishEvaluation, AnalysisMove, MoveClassification } from '@types/chess';
import { EVALUATION_THRESHOLDS, MOVE_CLASSIFICATIONS } from '@constants/app';

/**
 * Stockfish Engine Service
 * Handles chess analysis using Stockfish engine
 */
class StockfishService {
  private worker?: Worker;
  private isReady: boolean = false;
  private evaluationCallback?: (eval: StockfishEvaluation) => void;
  private depth: number = 25;
  private nodes: number = 3500000;

  /**
   * Initialize Stockfish worker
   */
  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Import stockfish worker
        this.worker = new Worker(
          new URL('../workers/stockfish.worker.ts', import.meta.url),
          { type: 'module' }
        );

        this.worker.onmessage = (e) => {
          const { type, data } = e.data;

          if (type === 'ready') {
            this.isReady = true;
            resolve();
          } else if (type === 'evaluation') {
            this.evaluationCallback?.(data);
          }
        };

        this.worker.onerror = (error) => {
          reject(new Error(`Stockfish worker error: ${error.message}`));
        };

        // Send init message
        this.worker.postMessage({ type: 'init' });
      } catch (error) {
        reject(new Error(`Failed to initialize Stockfish: ${error}`));
      }
    });
  }

  /**
   * Analyze position
   */
  async analyzePosition(
    fen: string,
    onEvaluation: (eval: StockfishEvaluation) => void
  ): Promise<StockfishEvaluation> {
    if (!this.worker || !this.isReady) {
      throw new Error('Stockfish engine not initialized');
    }

    this.evaluationCallback = onEvaluation;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Analysis timeout'));
      }, 30000);

      const tempCallback = (eval: StockfishEvaluation) => {
        if (eval.depth === this.depth) {
          clearTimeout(timeout);
          resolve(eval);
          this.evaluationCallback = undefined;
        }
        onEvaluation(eval);
      };

      this.evaluationCallback = tempCallback;

      this.worker!.postMessage({
        type: 'analyze',
        fen,
        depth: this.depth,
        nodes: this.nodes,
      });
    });
  }

  /**
   * Classify a move based on evaluation
   */
  classifyMove(
    moveEval: number,
    bestEval: number
  ): MoveClassification {
    const evalDiff = Math.abs(moveEval - bestEval);

    if (evalDiff <= EVALUATION_THRESHOLDS.BEST_THRESHOLD) {
      return MOVE_CLASSIFICATIONS.BEST as MoveClassification;
    } else if (evalDiff <= EVALUATION_THRESHOLDS.EXCELLENT_THRESHOLD) {
      return MOVE_CLASSIFICATIONS.EXCELLENT as MoveClassification;
    } else if (evalDiff <= EVALUATION_THRESHOLDS.GOOD_THRESHOLD) {
      return MOVE_CLASSIFICATIONS.GOOD as MoveClassification;
    } else if (evalDiff <= EVALUATION_THRESHOLDS.INACCURACY_THRESHOLD) {
      return MOVE_CLASSIFICATIONS.INACCURACY as MoveClassification;
    } else if (evalDiff <= EVALUATION_THRESHOLDS.MISTAKE_THRESHOLD) {
      return MOVE_CLASSIFICATIONS.MISTAKE as MoveClassification;
    }
    return MOVE_CLASSIFICATIONS.BLUNDER as MoveClassification;
  }

  /**
   * Calculate accuracy percentage
   */
  calculateAccuracy(moves: AnalysisMove[]): number {
    if (moves.length === 0) return 0;

    const bestMoves = moves.filter(
      (m) => m.classification === MOVE_CLASSIFICATIONS.BEST
    ).length;
    const excellentMoves = moves.filter(
      (m) => m.classification === MOVE_CLASSIFICATIONS.EXCELLENT
    ).length;

    const accuracyPoints = bestMoves * 100 + excellentMoves * 75;
    return Math.round(accuracyPoints / (moves.length * 100) * 100);
  }

  /**
   * Terminate worker
   */
  terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.isReady = false;
    }
  }

  /**
   * Set analysis depth
   */
  setDepth(depth: number): void {
    this.depth = Math.max(1, Math.min(depth, 40));
  }

  /**
   * Set node limit
   */
  setNodes(nodes: number): void {
    this.nodes = Math.max(1000, nodes);
  }
}

export default new StockfishService();
