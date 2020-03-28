import shuffle from "lodash/shuffle";
import { Ctx } from "boardgame.io";
import { Card, generateCardDeck } from "./entities/cards";
import { NumPlayers, PlayerID } from "./entities/players";

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
  dealer: PlayerID;
  currentPlayer: PlayerID;
  scorePad: RoundScore[];
  numPlayers: NumPlayers;
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
  const numPlayers = ctx.numPlayers as NumPlayers;
  const game = {
    numCards: 3,
    dealer: 0 as PlayerID,
    scorePad: new Array(numPlayers).fill([]),
    numPlayers,
    currentPlayer: Number.parseInt(ctx.currentPlayer, 10) as PlayerID,
  };
  const round = setRound ? blankRound(numPlayers) : null;
  const trick = setTrick ? blankTrick() : null;
  return {
    game,
    round,
    trick,
  };
};

export function blankRound(numPlayers: NumPlayers): GRound {
  return {
    bids: new Array(numPlayers).fill(null),
    hands: new Array(numPlayers).fill([]),
    trickCount: new Array(numPlayers).fill(null),
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
