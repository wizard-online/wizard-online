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

export function getLeader(scorePad: ScorePad): PlayerID[] {
  if (scorePad.length === 0)
    throw new Error("cannot get leader of empty score pad");

  let scoresByPlayer = transposeMatrix(
    scorePad.map((scoreRow) => scoreRow.playerScores)
  );
  let players = scoresByPlayer.map((score, i) => i as PlayerID);

  // 1. players with highest score
  const playerIndecesWithHighestScore = getPlayersWithHighestScore(
    scoresByPlayer
  );
  players = players.filter((playerID, i) =>
    playerIndecesWithHighestScore.includes(i)
  );
  if (players.length === 1) {
    return players;
  }

  // 2. players with most won rounds
  scoresByPlayer = scoresByPlayer.filter((playerScores, i) =>
    playerIndecesWithHighestScore.includes(i)
  );
  const playerIndecesWithMostWonRounds = getPlayersWithMostWonRounds(
    scoresByPlayer
  );
  players = players.filter((playerID, i) =>
    playerIndecesWithMostWonRounds.includes(i)
  );
  if (players.length === 1) {
    return players;
  }

  // 3. players with highest individual score
  scoresByPlayer = scoresByPlayer.filter((playerScores, i) =>
    playerIndecesWithMostWonRounds.includes(i)
  );
  const playerIndecesWithHighestIndividualScore = getPlayersWithHighestIndividualScore(
    scoresByPlayer
  );
  players = players.filter((playerID, i) =>
    playerIndecesWithHighestIndividualScore.includes(i)
  );
  if (players.length === 1) {
    return players;
  }

  // 4. players with most amount of highest individual score
  scoresByPlayer = scoresByPlayer.filter((playerScores, i) =>
    playerIndecesWithHighestIndividualScore.includes(i)
  );
  const playerIndecesWithMostAmountOfHighestIndividualScore = getPlayersWithMostAmountOfHighestIndividualScore(
    scoresByPlayer
  );
  players = players.filter((playerID, i) =>
    playerIndecesWithMostAmountOfHighestIndividualScore.includes(i)
  );
  if (players.length === 1) {
    return players;
  }

  // 5. players with second highest individual score
  scoresByPlayer = scoresByPlayer.filter((playerScores, i) =>
    playerIndecesWithMostAmountOfHighestIndividualScore.includes(i)
  );
  const playerIndecesWithSecondHighestIndividualScore = getPlayersWithSecondHighestIndividualScore(
    scoresByPlayer
  );
  players = players.filter((playerID, i) =>
    playerIndecesWithSecondHighestIndividualScore.includes(i)
  );
  if (players.length === 1) {
    return players;
  }

  // otherwise: all left players win together
  return players;
}

/**
 *
 *
 * @param {Score[][]} scoresByPlayer
 * @returns {number[]} indeces of player cols with highest score
 */
export function getPlayersWithHighestScore(
  scoresByPlayer: Score[][]
): number[] {
  // 1. get player with highest score
  const latestRow = scoresByPlayer.map(
    (playerScores) => playerScores[playerScores.length - 1]
  );
  const highestScore = Math.max(...latestRow.map(({ total }) => total));

  const playersWithHighestScore = latestRow
    .map((score, i) => ({ i, score }))
    .filter(({ score }) => score.total === highestScore)
    .map(({ i }) => i);
  if (playersWithHighestScore.length === 0) {
    throw new Error("did not find any player with highest score");
  }
  return playersWithHighestScore;
}

export function getPlayersWithMostWonRounds(
  scoresByPlayer: Score[][]
): number[] {
  // 2. get player with most won rounds
  const wonRounds = scoresByPlayer.map((playerScores) =>
    playerScores.reduce(
      (sumWonRounds, score) =>
        score.score > 0 ? sumWonRounds + 1 : sumWonRounds,
      0
    )
  );

  const maxWonRounds = Math.max(...wonRounds);
  const playersWithMostWonRounds = wonRounds
    .map((wins, i) => ({ wins, i }))
    .filter(({ wins }) => wins === maxWonRounds)
    .map(({ i }) => i);
  if (playersWithMostWonRounds.length === 0) {
    throw new Error("did not find any player with most won rounds");
  }
  return playersWithMostWonRounds;
}

export function getPlayersWithHighestIndividualScore(
  scoresByPlayer: Score[][]
): number[] {
  // 3. get players with highest individual score
  const highestIndividualScores = scoresByPlayer.map((playerScores) =>
    Math.max(...playerScores.map((score) => score.score))
  );

  const maxHighestIndividualScore = Math.max(...highestIndividualScores);
  const playersWithMaxHighestIndividualScore = highestIndividualScores
    .map((score, i) => ({ score, i }))
    .filter(({ score }) => score === maxHighestIndividualScore)
    .map(({ i }) => i);
  if (playersWithMaxHighestIndividualScore.length === 0) {
    throw new Error("did not find any player with highest individual score");
  }
  return playersWithMaxHighestIndividualScore;
}

export function getPlayersWithMostAmountOfHighestIndividualScore(
  scoresByPlayer: Score[][]
): number[] {
  const highestIndividualScores = scoresByPlayer.map((playerScores) =>
    Math.max(...playerScores.map((score) => score.score))
  );
  const maxHighestIndividualScore = Math.max(...highestIndividualScores);

  const amountsOfHighestIndividualScore = scoresByPlayer.map(
    (playerScores) =>
      playerScores.filter((score) => score.score === maxHighestIndividualScore)
        .length
  );
  const maxAmountOfHighestIndividualScore = Math.max(
    ...amountsOfHighestIndividualScore
  );
  const playersWithMostAmountOfHighestIndividualScore = amountsOfHighestIndividualScore
    .map((amount, i) => ({ amount, i }))
    .filter(({ amount }) => amount === maxAmountOfHighestIndividualScore)
    .map(({ i }) => i);
  if (playersWithMostAmountOfHighestIndividualScore.length === 0) {
    throw new Error(
      "did not find any player with most amount of highests individual score"
    );
  }
  return playersWithMostAmountOfHighestIndividualScore;
}

export function getPlayersWithSecondHighestIndividualScore(
  scoresByPlayer: Score[][]
): number[] {
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
  const maxSecondHighestIndividualScore = Math.max(
    ...secondHighestIndividualScores
  );

  const playersWithSecondHighestIndividualScore = secondHighestIndividualScores
    .map((score, i) => ({ score, i }))
    .filter(({ score }) => score === maxSecondHighestIndividualScore)
    .map(({ i }) => i);

  if (playersWithSecondHighestIndividualScore.length === 0) {
    throw new Error(
      "did not find any player with second highest individual score"
    );
  }

  return playersWithSecondHighestIndividualScore;
}

export function transposeMatrix<T>(matrix: T[][]): T[][] {
  // https://stackoverflow.com/a/17428705/5025424
  return matrix[0].map((col, i) => matrix.map((row) => row[i]));
}
