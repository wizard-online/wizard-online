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
  firstDealer: 0,
  rounds: [
    {
      numCards: 1,
      moves: {
        0: { bid: 0, play: [C(Y, 7)] },
        1: { bid: 1, play: [C(R, 5)] },
        2: { bid: 0, play: [C(R, 12)] },
        3: { bid: 0, play: [C(G, 10)] },
      },
      trumpCard: C(B, N),
    },
    // {
    //   numCards: 2,
    //   moves: {
    //     0: { bid: 1, play: [C(R, 7)] },
    //     1: { bid: 0, play: [C(B, 3)] },
    //     2: { bid: 0, play: [C(R, 9)] },
    //     3: { bid: 1, play: [C(G, 11)] },
    //   },
    //   trumpCard: C(B, 4),
    // },
  ],
};
