import { Score, ScoreRow } from "./score";
import {
  getPlayersWithHighestScore,
  getPlayersWithMostWonRounds,
  getPlayersWithHighestIndividualScore,
  getPlayersWithMostAmountOfHighestIndividualScore,
  getPlayersWithSecondHighestIndividualScore,
  getLeaders,
  transposeMatrix,
} from "./score.utils";

/**
 * highest score: 70 (true)
 * most won rounds: 4/6 (true)
 * highest individual score: 50 (true)
 * most highest indiv. score: 2 (true)
 * 2nd highest indiv. score: 30 (true)
 */
const testPlayer0: Score[] = [
  {
    bid: 0,
    tricks: 0,
    score: 20,
    total: 20,
  },
  {
    bid: 1,
    tricks: 1,
    score: 30,
    total: 50,
  },
  {
    bid: 3,
    tricks: 3,
    score: 50,
    total: 100,
  },
  {
    bid: 0,
    tricks: 4,
    score: -40,
    total: 60,
  },
  {
    bid: 5,
    tricks: 1,
    score: -40,
    total: 20,
  },
  {
    bid: 3,
    tricks: 3,
    score: 50,
    total: 70,
  },
];

/**
 * highest score: 70 (true)
 * most won rounds: 3/6 (false)
 * highest individual score: 50 (true)
 * most highest indiv. score: 2 (true)
 * 2nd highest indiv. score: 40 (true)
 */
const testPlayer1: Score[] = [
  {
    bid: 0,
    tricks: 1,
    score: -10,
    total: -10,
  },
  {
    bid: 0,
    tricks: 2,
    score: -20,
    total: -30,
  },
  {
    bid: 2,
    tricks: 2,
    score: 40,
    total: 10,
  },
  {
    bid: 0,
    tricks: 4,
    score: -40,
    total: -30,
  },
  {
    bid: 3,
    tricks: 3,
    score: 50,
    total: 20,
  },
  {
    bid: 3,
    tricks: 3,
    score: 50,
    total: 70,
  },
];

/**
 * highest score: 70 (true)
 * most won rounds: 4/6 (true)
 * highest individual score: 40 (false)
 * most highest indiv. score: 0 (false)
 * 2nd highest indiv. score: 40 (true)
 */
const testPlayer2: Score[] = [
  {
    bid: 0,
    tricks: 1,
    score: -10,
    total: -10,
  },
  {
    bid: 0,
    tricks: 0,
    score: 20,
    total: 10,
  },
  {
    bid: 1,
    tricks: 1,
    score: 30,
    total: 40,
  },
  {
    bid: 2,
    tricks: 2,
    score: 40,
    total: 80,
  },
  {
    bid: 2,
    tricks: 2,
    score: 40,
    total: 120,
  },
  {
    bid: 5,
    tricks: 0,
    score: -50,
    total: 70,
  },
];

/**
 * highest score: 70 (true)
 * most won rounds: 4/6 (true)
 * highest individual score: 50 (true)
 * most highest indiv. score: 1 (false)
 * 2nd highest indiv. score: 40 (true)
 */
const testPlayer3: Score[] = [
  {
    bid: 1,
    tricks: 1,
    score: 30,
    total: 30,
  },
  {
    bid: 0,
    tricks: 0,
    score: 20,
    total: 50,
  },
  {
    bid: 0,
    tricks: 3,
    score: -30,
    total: 20,
  },
  {
    bid: 4,
    tricks: 0,
    score: -40,
    total: -20,
  },
  {
    bid: 2,
    tricks: 2,
    score: 40,
    total: 20,
  },
  {
    bid: 3,
    tricks: 3,
    score: 50,
    total: 70,
  },
];

/**
 * highest score: 70 (true)
 * most won rounds: 4/6 (true)
 * highest individual score: 50 (true)
 * most highest indiv. score: 2 (true)
 * 2nd highest indiv. score: 20 (false)
 */
const testPlayer4: Score[] = [
  {
    bid: 0,
    tricks: 0,
    score: 20,
    total: 20,
  },
  {
    bid: 0,
    tricks: 0,
    score: 20,
    total: 40,
  },
  {
    bid: 0,
    tricks: 3,
    score: -30,
    total: 10,
  },
  {
    bid: 4,
    tricks: 0,
    score: -40,
    total: -30,
  },
  {
    bid: 3,
    tricks: 3,
    score: 50,
    total: 20,
  },
  {
    bid: 3,
    tricks: 3,
    score: 50,
    total: 70,
  },
];

/**
 * highest score: 40 (false)
 * most won rounds: 4/6 (true)
 * highest individual score: 40 (false)
 * most highest indiv. score: 0 (false)
 * 2nd highest indiv. score: 30 (true)
 */
const testPlayer5: Score[] = [
  {
    bid: 1,
    tricks: 1,
    score: 30,
    total: 30,
  },
  {
    bid: 0,
    tricks: 0,
    score: 20,
    total: 50,
  },
  {
    bid: 0,
    tricks: 3,
    score: -30,
    total: 20,
  },
  {
    bid: 4,
    tricks: 0,
    score: -40,
    total: -20,
  },
  {
    bid: 1,
    tricks: 1,
    score: 30,
    total: 10,
  },
  {
    bid: 1,
    tricks: 1,
    score: 30,
    total: 40,
  },
];

describe("getPlayersWithHighestScore", () => {
  test("returns players with highest score", () => {
    expect(
      getPlayersWithHighestScore([
        testPlayer0,
        testPlayer1,
        testPlayer2,
        testPlayer3,
        testPlayer4,
        testPlayer5,
        testPlayer0,
      ])
    ).toEqual([0, 1, 2, 3, 4, 6]);
  });
});

describe("getPlayersWithMostWonRounds", () => {
  test("returns players with most won rounds", () => {
    expect(
      getPlayersWithMostWonRounds([
        testPlayer0,
        testPlayer1,
        testPlayer2,
        testPlayer3,
        testPlayer4,
        testPlayer0,
      ])
    ).toEqual([0, 2, 3, 4, 5]);
  });
});

describe("getPlayersWithHighestIndividualScore", () => {
  test("returns players with highest individual score", () => {
    expect(
      getPlayersWithHighestIndividualScore([
        testPlayer0,
        testPlayer2,
        testPlayer3,
        testPlayer4,
        testPlayer0,
      ])
    ).toEqual([0, 2, 3, 4]);
  });
});

describe("getPlayersWithMostAmountOfHighestIndividualScore", () => {
  test("returns players with most amount of highest individual score", () => {
    expect(
      getPlayersWithMostAmountOfHighestIndividualScore([
        testPlayer0,
        testPlayer3,
        testPlayer4,
        testPlayer0,
      ])
    ).toEqual([0, 2, 3]);
  });
});

describe("getPlayersWithSecondHighestIndividualScore", () => {
  test("returns players with most amount of highest individual score", () => {
    expect(
      getPlayersWithSecondHighestIndividualScore([
        testPlayer0,
        testPlayer4,
        testPlayer0,
      ])
    ).toEqual([0, 2]);
  });
});

describe("getLeader", () => {
  test("returns leading player", () => {
    const scorePad: ScoreRow[] = transposeMatrix([
      testPlayer0,
      testPlayer1,
      testPlayer2,
      testPlayer3,
      testPlayer4,
      testPlayer5,
    ]).map((playerScores, i) => ({ numCards: i + 1, playerScores }));
    expect(getLeaders(scorePad)).toEqual([0]);
  });

  test("returns all leading players", () => {
    const scorePad: ScoreRow[] = transposeMatrix([
      testPlayer0,
      testPlayer1,
      testPlayer2,
      testPlayer3,
      testPlayer4,
      testPlayer5,
      testPlayer0,
    ]).map((playerScores, i) => ({ numCards: i + 1, playerScores }));
    expect(getLeaders(scorePad)).toEqual([0, 6]);
  });
});
