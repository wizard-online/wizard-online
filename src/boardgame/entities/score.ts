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

export function updateScorePad(
  bids: (number | null)[],
  trickCount: number[],
  numCards: number,
  scorePad: ScoreRow[]
): ScoreRow[] {
  return [...scorePad, calcRoundScore(bids, trickCount, numCards, scorePad)];
}

export function calcRoundScore(
  bids: (number | null)[],
  trickCount: number[],
  numCards: number,
  scorePad: ScoreRow[]
): ScoreRow {
  const lastRoundScore = scorePad[scorePad.length - 1];
  const playerScores = bids.map((bid, i) => {
    if (bid === null) throw new Error("unexpected bid null value");
    const tricks = trickCount[i];
    const diff = Math.abs(tricks - bid);
    const score = diff > 0 ? diff * -10 : 20 + bid * 10;
    const oldTotal = lastRoundScore?.playerScores?.[i]?.total || 0;
    const total = oldTotal + score;

    return { bid, tricks, score, total } as Score;
  });

  return {
    numCards,
    playerScores,
  };
}

// export function getLeader(scorePad: ScorePad): number {
//   if (!scorePad.length) throw new Error("cannot get leader of empty score pad");
//   const latestRow = scorePad[scorePad.length - 1];
//   return latestRow
// }
