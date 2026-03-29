import { Ctx } from "boardgame.io";
import { Card, Rank, Suit } from "../../shared/entities/cards";
import { NumPlayers, PlayerID } from "../../shared/entities/players";
import { Phase } from "../../shared/phases/phase";
import {
  WizardState,
  WizardConfig,
  WizardTrickState,
  WizardRoundState,
} from "../../shared/WizardState";
import { OptionalTrickCard, TrickCard } from "../../shared/entities/trick";
import { ScoreRow } from "../../shared/entities/score";
import { generateCtx } from "./ctx";

/** Terse alias for the Card factory */
export function c(suit: Suit, rank: Rank): Card {
  return Card(suit, rank);
}

/** Returns a Wizard card (Rank.Z) of the given suit */
export const WIZARD = (suit: Suit): Card => Card(suit, Rank.Z);

/** Returns a Null card (Rank.N) of the given suit */
export const NULL_CARD = (suit: Suit): Card => Card(suit, Rank.N);

export interface BuildTrickOptions {
  cards: OptionalTrickCard[];
  lead?: Card;
  isComplete?: boolean;
}

export interface BuildRoundOptions {
  bids?: (number | null)[];
  bidsMismatch?: number;
  hands?: (Card | null)[][];
  trickCount?: number[];
  trump?: { card: Card | null | undefined; suit?: Suit | null };
  deck?: (Card | null)[];
  previousTrick?: TrickCard[];
  isComplete?: boolean;
}

export interface BuildStateOptions {
  numPlayers?: NumPlayers;
  phase?: Phase;
  currentPlayer?: PlayerID;
  roundIndex?: number;
  rounds?: number[];
  dealer?: PlayerID;
  round?: BuildRoundOptions | null;
  trick?: BuildTrickOptions | null;
  config?: WizardConfig;
  scorePad?: ScoreRow[];
}

/**
 * Builds a WizardState + Ctx pair for testing.
 *
 * NOTE: The default `hands` uses `new Array(numPlayers).fill([])` which creates
 * shared array references. Callers providing hands should always supply explicit
 * distinct arrays.
 */
export function buildState(options: BuildStateOptions = {}): {
  g: WizardState;
  ctx: Ctx;
} {
  const {
    numPlayers = 4 as NumPlayers,
    phase = Phase.Playing,
    currentPlayer = 0 as PlayerID,
    roundIndex = 0,
    rounds = [3, 4],
    dealer = 0 as PlayerID,
    round: roundOptions,
    trick: trickOptions,
    config = {},
    scorePad = [],
  } = options;

  const ctx = generateCtx({
    numPlayers,
    currentPlayer: currentPlayer.toString(),
    phase,
    playOrder: Array.from({ length: numPlayers }, (_, i) => i.toString()),
  });

  // Build round
  let round: WizardRoundState | null;
  if (roundOptions === null) {
    round = null;
  } else {
    const defaultRound: WizardRoundState = {
      bids: new Array(numPlayers).fill(0),
      hands: new Array(numPlayers).fill([]),
      handsMeta: new Array(numPlayers).fill(null),
      trickCount: new Array(numPlayers).fill(0),
      trump: { card: null },
      deck: [],
    };
    round = { ...defaultRound, ...roundOptions };
  }

  // Build trick
  let trick: WizardTrickState | null;
  if (trickOptions === undefined || trickOptions === null) {
    trick = null;
  } else {
    trick = {
      cards: trickOptions.cards,
      lead: trickOptions.lead,
      isComplete: trickOptions.isComplete,
    };
  }

  const g: WizardState = {
    config,
    round,
    trick,
    rounds,
    roundIndex,
    dealer,
    currentPlayer,
    scorePad,
    numPlayers,
    phase,
  };

  return { g, ctx };
}
