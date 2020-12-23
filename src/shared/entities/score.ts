/**
 * Describes the score pad aka "Block der Wahrheit"
 * consisting of rows of player scores
 *
 * @export
 */
export type ScorePad = ScoreRow[];

/**
 * Describes one row in the score pad:
 * Each's player score and bids for one specific round.
 *
 * @export
 * @interface ScoreRow
 */
export interface ScoreRow {
  numCards: number;
  playerScores: Score[];
}

/**
 * A score entry in the score pad for one player and one round.
 *
 * @export
 * @interface Score
 */
export interface Score {
  bid: number;
  tricks: number;
  score: number;
  total: number;
}
