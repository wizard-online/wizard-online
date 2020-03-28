import { RoundScore, Score } from "../G";

export function updateScorePad(
  bids: (number | null)[],
  trickCount: number[],
  numCards: number,
  scorePad: RoundScore[]
): RoundScore[] {
  return [...scorePad, calcRoundScore(bids, trickCount, numCards, scorePad)];
}

export function calcRoundScore(
  bids: (number | null)[],
  trickCount: number[],
  numCards: number,
  scorePad: RoundScore[]
): RoundScore {
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
