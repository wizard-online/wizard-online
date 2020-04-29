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

const testPlayer0: Score[] = [
  {
    bid: 0,
    score: 20,
    total: 20,
    tricks: 0,
  },
  {
    bid: 0,
    score: 20,
    total: 40,
    tricks: 0,
  },
  {
    bid: 1,
    score: -10,
    total: 30,
    tricks: 2,
  },
  {
    bid: 2,
    score: 40,
    total: 70,
    tricks: 2,
  },
];
const testPlayer1: Score[] = [
  {
    bid: 1,
    score: 30,
    total: 30,
    tricks: 1,
  },
  {
    bid: 1,
    score: 30,
    total: 60,
    tricks: 1,
  },
  {
    bid: 1,
    score: -10,
    total: 50,
    tricks: 0,
  },
  {
    bid: 2,
    score: -10,
    total: 40,
    tricks: 1,
  },
];
const testPlayer2: Score[] = [
  {
    bid: 0,
    score: 20,
    total: 20,
    tricks: 0,
  },
  {
    bid: 0,
    score: -10,
    total: 10,
    tricks: 1,
  },
  {
    bid: 0,
    score: -10,
    total: 0,
    tricks: 1,
  },
  {
    bid: 1,
    score: 30,
    total: 30,
    tricks: 1,
  },
];
const testPlayer3: Score[] = [
  {
    bid: 0,
    score: 20,
    total: 20,
    tricks: 0,
  },
  {
    bid: 0,
    score: -10,
    total: 10,
    tricks: 1,
  },
  {
    bid: 2,
    score: 40,
    total: 50,
    tricks: 2,
  },
  {
    bid: 0,
    score: 20,
    total: 70,
    tricks: 0,
  },
];

describe("getPlayersWithHighestScore", () => {
  test("returns player with highest score", () => {
    expect(
      getPlayersWithHighestScore([testPlayer0, testPlayer1, testPlayer2])
    ).toEqual([0]);
  });

  test("returns all players with highest score", () => {
    expect(
      getPlayersWithHighestScore([testPlayer0, testPlayer1, testPlayer3])
    ).toEqual([0, 2]);
  });
});

describe("getPlayersWithMostWonRounds", () => {
  test("returns player with most won rounds", () => {
    expect(
      getPlayersWithMostWonRounds([testPlayer0, testPlayer1, testPlayer2])
    ).toEqual([0]);
  });

  test("returns all players with most won rounds", () => {
    expect(
      getPlayersWithMostWonRounds([testPlayer0, testPlayer1, testPlayer3])
    ).toEqual([0, 2]);
  });
});

describe("getPlayersWithHighestIndividualScore", () => {
  test("returns player with highest individual score", () => {
    expect(
      getPlayersWithHighestIndividualScore([
        testPlayer0,
        testPlayer1,
        testPlayer2,
      ])
    ).toEqual([0]);
  });

  test("returns all players with highest individual score", () => {
    expect(
      getPlayersWithHighestIndividualScore([
        testPlayer0,
        testPlayer1,
        testPlayer3,
      ])
    ).toEqual([0, 2]);
  });
});

describe("getPlayersWithMostAmountOfHighestIndividualScore", () => {
  test("returns player with most amount of highest individual score", () => {
    expect(
      getPlayersWithMostAmountOfHighestIndividualScore([
        testPlayer0,
        testPlayer1,
        testPlayer2,
      ])
    ).toEqual([0]);
  });

  test("returns all players with most amount of highest individual score", () => {
    expect(
      getPlayersWithMostAmountOfHighestIndividualScore([
        testPlayer0,
        testPlayer1,
        testPlayer3,
      ])
    ).toEqual([0, 2]);
  });
});

describe("getPlayersWithSecondHighestIndividualScore", () => {
  test("returns player with most amount of highest individual score", () => {
    expect(
      getPlayersWithSecondHighestIndividualScore([
        testPlayer0,
        testPlayer2,
        testPlayer3,
      ])
    ).toEqual([1]);
  });

  test("returns all players with most amount of highest individual score", () => {
    expect(
      getPlayersWithSecondHighestIndividualScore([
        testPlayer0,
        testPlayer1,
        testPlayer2,
      ])
    ).toEqual([1, 2]);
  });
});

describe("getLeader", () => {
  test("returns leading player", () => {
    const scorePad: ScoreRow[] = transposeMatrix([
      testPlayer0,
      testPlayer1,
      testPlayer2,
    ]).map((playerScores, i) => ({ numCards: i + 1, playerScores }));
    expect(getLeaders(scorePad)).toEqual([0]);
  });

  test("returns all leading players", () => {
    const scorePad: ScoreRow[] = transposeMatrix([
      testPlayer0,
      testPlayer1,
      testPlayer3,
    ]).map((playerScores, i) => ({ numCards: i + 1, playerScores }));
    expect(getLeaders(scorePad)).toEqual([0, 2]);
  });
});
