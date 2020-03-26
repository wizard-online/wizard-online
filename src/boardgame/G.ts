import shuffle from "lodash/shuffle";
import { Ctx, PlayerID } from "boardgame.io";
import { Card, generateCardDeck } from "./entities/cards";

export interface G {
  game: GGame;
  round: GRound | null;
  trick: GTrick | null;
}

export interface GTrick {
  cards: [Card, PlayerID][];
  lead: Card | null;
}

export function isSetTrick(trick: GTrick | null): trick is GTrick {
  return !!trick;
}

export interface GRound {
  bids: (number | null)[];
  hands: Card[][];
  trickCount: number[];
  trump: Card | null;
  deck: Card[];
}

export function isSetRound(round: GRound | null): round is GRound {
  return !!round;
}

export interface GGame {
  numCards: number;
  scorePad: RoundScore[];
}

export interface RoundScore {
  numCards: number;
  playerScores: Score[];
}

export interface Score {
  bid: number;
  tricks: number;
  score: number;
  total: number;
}

export const defaultG = (
  ctx: Ctx,
  {
    setRound = true,
    setTrick = true,
  }: { setRound?: boolean; setTrick?: boolean } = {}
): G => {
  const game = { numCards: 3, scorePad: Array(ctx.numPlayers).fill([]) };
  const round = setRound ? blankRound(ctx) : null;
  const trick = setTrick ? blankTrick() : null;
  return {
    game,
    round,
    trick,
  };
};

export function blankRound(ctx: Ctx): GRound {
  return {
    bids: Array(ctx.numPlayers).fill(null),
    hands: Array(ctx.numPlayers).fill([]),
    trickCount: Array(ctx.numPlayers).fill(0),
    trump: null,
    deck: shuffle(generateCardDeck()),
  };
}

export function blankTrick(): GTrick {
  return {
    cards: [],
    lead: null,
  };
}
