import shuffle from "lodash/shuffle";
import { Ctx } from "boardgame.io";
import { Card, generateCardDeck } from "./entities/cards";
import { NumPlayers, PlayerID } from "./entities/players";

export interface WizardState {
  game: WizardGameState;
  round: WizardRoundState | null;
  trick: WizardTrickState | null;
}

export interface WizardTrickState {
  cards: [Card, PlayerID][];
  lead: Card | null;
}

export function isSetTrick(
  trick: WizardTrickState | null
): trick is WizardTrickState {
  return !!trick;
}

export interface WizardRoundState {
  bids: (number | null)[];
  hands: Card[][];
  trickCount: number[];
  trump: Card | null;
  deck: Card[];
}

export function isSetRound(
  round: WizardRoundState | null
): round is WizardRoundState {
  return !!round;
}

export interface WizardGameState {
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
): WizardState => {
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

export function blankRound(numPlayers: NumPlayers): WizardRoundState {
  return {
    bids: new Array(numPlayers).fill(null),
    hands: new Array(numPlayers).fill([]),
    trickCount: new Array(numPlayers).fill(null),
    trump: null,
    deck: shuffle(generateCardDeck()),
  };
}

export function blankTrick(): WizardTrickState {
  return {
    cards: [],
    lead: null,
  };
}
