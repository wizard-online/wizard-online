import { NumPlayers, PlayerID } from "../game/entities/players";
import { Card, Suit, Rank } from "../game/entities/cards";

export interface GameScenario {
  numPlayers: NumPlayers;
  firstDealer: PlayerID;
  rounds: RoundScenario[];
}

export interface RoundScenario {
  numCards: number;
  moves: {
    [playerID: number]: PlayerMoves;
  };
  trickWinners: PlayerID[];
  trumpCard: Card;
  trumpSuit?: Suit;
}

export interface PlayerMoves {
  bid: number;
  play: Card[];
}

const C = Card;
const B = Suit.Blue;
const G = Suit.Green;
const R = Suit.Red;
const Y = Suit.Yellow;
const { N } = Rank;
const { Z } = Rank;

export const scenario: GameScenario = {
  numPlayers: 4,
  firstDealer: 1,
  rounds: [
    {
      numCards: 1,
      moves: {
        0: { bid: 1, play: [C(R, 9)] },
        1: { bid: 0, play: [C(G, 2)] },
        2: { bid: 1, play: [C(Y, 3)] },
        3: { bid: 0, play: [C(R, 3)] },
      },
      trumpCard: C(R, 11),
      trickWinners: [0],
    },
    {
      numCards: 2,
      moves: {
        0: { bid: 0, play: [C(R, 7), C(B, 5)] },
        1: { bid: 1, play: [C(B, N), C(B, 12)] },
        2: { bid: 0, play: [C(Y, 10), C(B, 1)] },
        3: { bid: 0, play: [C(Y, 2), C(R, 9)] },
      },
      trumpCard: C(G, 1),
      trickWinners: [2, 1],
    },
    {
      numCards: 3,
      moves: {
        0: { bid: 1, play: [C(Y, 13), C(B, 1), C(R, 4)] },
        1: { bid: 1, play: [C(Y, 7), C(Y, 2), C(R, Z)] },
        2: { bid: 0, play: [C(Y, 3), C(R, 10), C(R, 3)] },
        3: { bid: 0, play: [C(R, 11), C(B, 10), C(B, 2)] },
      },
      trumpCard: C(G, 9),
      trickWinners: [0, 3, 1],
    },
    {
      numCards: 4,
      moves: {
        0: { bid: 2, play: [C(R, 9), C(G, 1), C(Y, Z), C(R, 5)] },
        1: { bid: 1, play: [C(R, 2), C(G, 2), C(G, 8), C(B, Z)] },
        2: { bid: 1, play: [C(G, 3), C(G, 10), C(G, 9), C(B, 11)] },
        3: { bid: 1, play: [C(R, 3), C(Y, 10), C(R, 1), C(Y, 11)] },
      },
      trumpCard: C(Y, 5),
      trickWinners: [0, 3, 0, 1],
    },
    {
      numCards: 5,
      moves: {
        0: {
          bid: 1,
          play: [C(R, 11), C(Y, 3), C(R, N), C(B, 6), C(G, 13), C(G, 9)],
        },
        1: {
          bid: 4,
          play: [C(G, Z), C(Y, 12), C(B, 12), C(R, 3), C(B, Z), C(B, 8)],
        },
        2: {
          bid: 0,
          play: [C(R, 2), C(B, 9), C(G, 8), C(G, 5), C(G, 3), C(Y, 7)],
        },
        3: {
          bid: 1,
          play: [C(R, 8), C(Y, 1), C(B, 4), C(R, 7), C(Y, N), C(G, N)],
        },
      },
      trumpCard: C(R, 1),
      trickWinners: [1, 1, 1, 3, 1, 0],
    },
    {
      numCards: 6,
      moves: {
        0: { bid: 3, play: [C(R, Z), C(R, 12), C(Y, N), C(B, Z), C(R, 5)] },
        1: { bid: 2, play: [C(G, 2), C(R, 13), C(Y, 13), C(Y, 3), C(G, 4)] },
        2: { bid: 2, play: [C(G, 7), C(Y, 2), C(G, Z), C(Y, 11), C(B, 2)] },
        3: { bid: 0, play: [C(G, 8), C(R, 9), C(Y, 1), C(R, 7), C(R, N)] },
      },
      trumpCard: C(G, 1),
      trickWinners: [0, 1, 2, 0, 1],
    },
    {
      numCards: 7,
      moves: {
        0: {
          bid: 1,
          play: [
            C(B, 4),
            C(B, 8),
            C(G, 11),
            C(G, 6),
            C(G, N),
            C(R, Z),
            C(R, N),
          ],
        },
        1: {
          bid: 2,
          play: [
            C(B, 9),
            C(R, 5),
            C(R, 6),
            C(B, 6),
            C(G, Z),
            C(G, 12),
            C(Y, N),
          ],
        },
        2: {
          bid: 1,
          play: [
            C(B, 11),
            C(Y, 4),
            C(B, N),
            C(R, 3),
            C(Y, 3),
            C(G, 10),
            C(G, 7),
          ],
        },
        3: {
          bid: 2,
          play: [
            C(B, 12),
            C(Y, 6),
            C(R, 2),
            C(G, 9),
            C(B, Z),
            C(Y, 1),
            C(R, 9),
          ],
        },
      },
      trumpCard: C(R, 11),
      trickWinners: [3, 1, 1, 2, 3, 0, 3],
    },

    {
      numCards: 8,
      moves: {
        0: {
          bid: 1,
          play: [
            C(B, 6),
            C(Y, 12),
            C(Y, 6),
            C(B, 11),
            C(G, 4),
            C(R, 1),
            C(G, 8),
            C(R, 5),
          ],
        },
        1: {
          bid: 1,
          play: [
            C(B, 12),
            C(Y, 8),
            C(Y, 5),
            C(R, 8),
            C(G, N),
            C(R, 7),
            C(G, 3),
            C(R, 6),
          ],
        },
        2: {
          bid: 2,
          play: [
            C(B, 9),
            C(Y, 11),
            C(Y, 7),
            C(Y, 1),
            C(B, N),
            C(R, 10),
            C(G, Z),
            C(G, 13),
          ],
        },
        3: {
          bid: 3,
          play: [
            C(B, 13),
            C(Y, 3),
            C(B, 5),
            C(B, 2),
            C(G, 2),
            C(B, Z),
            C(G, 7),
            C(R, Z),
          ],
        },
      },
      trumpCard: C(G, 11),
      trickWinners: [3, 0, 2, 2, 0, 3, 2, 3],
    },
    {
      numCards: 9,
      moves: {
        0: {
          bid: 2,
          play: [
            C(B, 7),
            C(Y, 9),
            C(G, 10),
            C(Y, 5),
            C(G, 5),
            C(Y, 13),
            C(B, N),
            C(Y, N),
            C(G, 9),
          ],
        },
        1: {
          bid: 3,
          play: [
            C(R, 2),
            C(Y, 2),
            C(B, 6),
            C(B, 9),
            C(G, 11),
            C(B, 11),
            C(G, 12),
            C(G, Z),
            C(R, Z),
          ],
        },
        2: {
          bid: 2,
          play: [
            C(R, 9),
            C(Y, 6),
            C(B, 3),
            C(B, 2),
            C(B, 13),
            C(B, 1),
            C(B, Z),
            C(G, N),
            C(B, 12),
          ],
        },
        3: {
          bid: 1,
          play: [
            C(R, 7),
            C(Y, 19),
            C(B, 4),
            C(G, 13),
            C(G, 7),
            C(R, 13),
            C(G, 2),
            C(R, N),
            C(R, 1),
          ],
        },
      },
      trumpCard: C(Y, 11),
      trickWinners: [2, 3, 1, 0, 1, 0, 2, 1, 1],
    },
  ],
};

const template = {
  numCards: 0,
  moves: {
    0: { bid: 0, play: [] },
    1: { bid: 0, play: [] },
    2: { bid: 0, play: [] },
    3: { bid: 0, play: [] },
  },
  trumpCard: null,
  trickWinners: [],
};
