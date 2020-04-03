import { ScoreRow, ScorePad, Score } from "../entities/score";
import { PlayerID } from "../entities/players";

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

export function getLeader(scorePad: ScorePad): PlayerID {
  if (scorePad.length === 0)
    throw new Error("cannot get leader of empty score pad");
  const latestRow = scorePad[scorePad.length - 1];
  return latestRow.playerScores.reduce((bestPlayerID, score, playerID, arr) => {
    return score.total > arr[bestPlayerID].total ? playerID : bestPlayerID;
  }, 0 as number) as PlayerID;
}
