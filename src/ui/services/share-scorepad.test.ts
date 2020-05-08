import { ScorePad } from "../../game/entities/score";
import { fromScorePad, SharableScorePad, toScorepad } from "./share-scorepad";

const scorePad: ScorePad = [
  {
    numCards: 1,
    playerScores: [
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
        total: 20,
      },
      {
        bid: 0,
        tricks: 1,
        score: -10,
        total: -10,
      },
    ],
  },
  {
    numCards: 3,
    playerScores: [
      {
        bid: 1,
        tricks: 1,
        score: 30,
        total: 50,
      },
      {
        bid: 0,
        tricks: 1,
        score: -10,
        total: 10,
      },
      {
        bid: 1,
        tricks: 1,
        score: 30,
        total: 20,
      },
    ],
  },
  {
    numCards: 5,
    playerScores: [
      {
        bid: 2,
        tricks: 0,
        score: -20,
        total: 30,
      },
      {
        bid: 0,
        tricks: 0,
        score: 20,
        total: 30,
      },
      {
        bid: 2,
        tricks: 5,
        score: -30,
        total: -10,
      },
    ],
  },
];

const sharableScorePad: SharableScorePad = [
  [
    1,
    [
      [0, 0],
      [0, 0],
      [0, 1],
    ],
  ],
  [
    3,
    [
      [1, 1],
      [0, 1],
      [1, 1],
    ],
  ],
  [
    5,
    [
      [2, 0],
      [0, 0],
      [2, 5],
    ],
  ],
];

describe("fromScorePad", () => {
  test("converts to sharable scorepad", () => {
    expect(fromScorePad(scorePad)).toEqual(sharableScorePad);
  });
});

describe("toScorePad", () => {
  test("converts from sharable scorepad", () => {
    expect(toScorepad(sharableScorePad)).toEqual(scorePad);
  });
});
