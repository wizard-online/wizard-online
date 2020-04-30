import { ScoreRow, ScorePad, Score } from "./score";
import { PlayerID } from "./players";

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

/**
 *
 *
 * @param {Score[][]} scoresByPlayer
 * @returns {number[]} indeces of player cols with highest score
 */
export const getPlayersWithHighestScore = abstractGetPlayersWithMaxValue(
  (scoresByPlayer) =>
    scoresByPlayer.map(
      (playerScores) => playerScores[playerScores.length - 1].total
    )
);

export const getPlayersWithMostWonRounds = abstractGetPlayersWithMaxValue(
  (scoresByPlayer) =>
    scoresByPlayer.map((playerScores) =>
      playerScores.reduce(
        (sumWonRounds, score) =>
          score.score > 0 ? sumWonRounds + 1 : sumWonRounds,
        0
      )
    )
);

export const getPlayersWithHighestIndividualScore = abstractGetPlayersWithMaxValue(
  (scoresByPlayer) =>
    scoresByPlayer.map((playerScores) =>
      Math.max(...playerScores.map((score) => score.score))
    )
);

export const getPlayersWithMostAmountOfHighestIndividualScore = abstractGetPlayersWithMaxValue(
  (scoresByPlayer) => {
    const highestIndividualScores = scoresByPlayer.map((playerScores) =>
      Math.max(...playerScores.map((score) => score.score))
    );
    const maxHighestIndividualScore = Math.max(...highestIndividualScores);

    const amountsOfHighestIndividualScore = scoresByPlayer.map(
      (playerScores) =>
        playerScores.filter(
          (score) => score.score === maxHighestIndividualScore
        ).length
    );
    return amountsOfHighestIndividualScore;
  }
);

export const getPlayersWithSecondHighestIndividualScore = abstractGetPlayersWithMaxValue(
  (scoresByPlayer) => {
    const highestIndividualScores = scoresByPlayer.map((playerScores) =>
      Math.max(...playerScores.map((score) => score.score))
    );
    const maxHighestIndividualScore = Math.max(...highestIndividualScores);

    const secondHighestIndividualScores = scoresByPlayer.map((playerScores) =>
      Math.max(
        ...playerScores
          .map((score) => score.score)
          .filter((score) => score !== maxHighestIndividualScore)
      )
    );
    return secondHighestIndividualScores;
  }
);

function abstractGetPlayersWithMaxValue(
  calcValues: (scoresByPlayer: Score[][]) => number[]
): (scoresByPlayer: Score[][]) => number[] {
  return (scoresByPlayer: Score[][]): number[] => {
    const values = calcValues(scoresByPlayer);
    const maxValue = Math.max(...values);
    const playersWithMaxValue = values
      .map((value, i) => ({ i, value }))
      .filter(({ value }) => value === maxValue)
      .map(({ i }) => i);

    return playersWithMaxValue;
  };
}

export function getLeaders(scorePad: ScorePad): PlayerID[] {
  if (scorePad.length === 0)
    throw new Error("cannot get leader of empty score pad");

  let scoresByPlayer = transposeMatrix(
    scorePad.map((scoreRow) => scoreRow.playerScores)
  );
  let players = scoresByPlayer.map((_score, i) => i as PlayerID);

  const rules = [
    getPlayersWithHighestScore,
    getPlayersWithMostWonRounds,
    getPlayersWithHighestIndividualScore,
    getPlayersWithMostAmountOfHighestIndividualScore,
    getPlayersWithSecondHighestIndividualScore,
  ];

  // eslint-disable-next-line no-restricted-syntax
  for (const rule of rules) {
    const playerIndeces = rule(scoresByPlayer);
    players = players.filter((_playerID, i) => playerIndeces.includes(i));
    if (players.length === 1) {
      return players;
    }
    scoresByPlayer = scoresByPlayer.filter((_playerScores, i) =>
      playerIndeces.includes(i)
    );
  }
  return players;
}

export function transposeMatrix<T>(matrix: T[][]): T[][] {
  // https://stackoverflow.com/a/17428705/5025424
  return matrix[0].map((_col, i) => matrix.map((row) => row[i]));
}
