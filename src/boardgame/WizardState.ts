import shuffle from "lodash/shuffle";
import { Ctx } from "boardgame.io";
import { Card, generateCardDeck, Suit } from "./entities/cards";
import { NumPlayers, PlayerID } from "./entities/players";
import { Phase } from "./phases/phase";
import { ScorePad } from "./entities/score";

/**
 * Describes the Wizard game state used in the g object.
 *
 * @export
 * @interface WizardState
 */
export interface WizardState {
  // round-specific state which is resetted after each round
  round: WizardRoundState | null;
  // trick-specific state which is resetted after each trick
  trick: WizardTrickState | null;
  // general game state
  numCards: number;
  dealer: PlayerID;
  currentPlayer: PlayerID;
  scorePad: ScorePad;
  numPlayers: NumPlayers;
  phase: Phase;
}

/**
 * Describes trick-specific Wizard game state
 *
 * @export
 * @interface WizardTrickState
 */
export interface WizardTrickState {
  cards: [Card, PlayerID][];
  lead?: Card;
}

/**
 * Describes round-specific Wizard game state
 *
 * @export
 * @interface WizardRoundState
 */
export interface WizardRoundState {
  bids: (number | null)[];
  bidsMismatch?: number;
  hands: Card[][];
  trickCount: number[];
  trump: Trump;
  deck: Card[];
}

/**
 * Describes the round's trump suit.
 * card: contains the trump card if given (i.e. not in the last round)
 * suit: contains the trump suit. This is redudant to the card's suit most of the time
 * but serves for the case when the trump card is a Z and the dealer selects a trump suit.
 *
 * @export
 * @interface Trump
 */
export interface Trump {
  card: Card | null;
  suit?: Suit | null;
}

/**
 * Checks if a trick is set.
 * Function uses typescript guards:
 * If used in conditions, typescript knows this trick is not null in following code.
 *
 * @export
 * @param {(WizardTrickState | null)} trick
 * @returns {trick is WizardTrickState} true if trick is set, otherwise false
 */
export function isSetTrick(
  trick: WizardTrickState | null
): trick is WizardTrickState {
  return !!trick;
}

/**
 * Checks if a guard is set.
 * Function uses typescript guards:
 * If used in conditions, typescript knows this variable is not null in following code.
 *
 * @export
 * @param {(WizardRoundState | null)} round
 * @returns {round is WizardRoundState}
 */
export function isSetRound(
  round: WizardRoundState | null
): round is WizardRoundState {
  return !!round;
}

/**
 * Generates a WizardState with default values.
 *
 * @param {Ctx} ctx
 * @param {{ setRound?: boolean; setTrick?: boolean }} [{
 *     setRound = true,
 *     setTrick = true,
 *   }={}]
 * @returns {WizardState}
 */
export const generateDefaultWizardState = (
  ctx: Ctx,
  {
    setRound = true,
    setTrick = true,
  }: { setRound?: boolean; setTrick?: boolean } = {}
): WizardState => {
  const numPlayers = ctx.numPlayers as NumPlayers;
  const round = setRound ? generateBlankRoundState(numPlayers) : null;
  const trick = setTrick ? generateBlankTrickState() : null;
  return {
    round,
    trick,
    numCards: 1,
    dealer: 0 as PlayerID,
    scorePad: [],
    numPlayers,
    currentPlayer: Number.parseInt(ctx.currentPlayer, 10) as PlayerID,
    phase: ctx.phase as Phase,
  };
};

/**
 * Generates a blank WizardRoundState
 *
 * @export
 * @param {NumPlayers} numPlayers
 * @returns {WizardRoundState}
 */
export function generateBlankRoundState(
  numPlayers: NumPlayers
): WizardRoundState {
  return {
    bids: new Array(numPlayers).fill(null),
    hands: new Array(numPlayers).fill([]),
    trickCount: new Array(numPlayers).fill(null),
    trump: { card: null },
    deck: shuffle(generateCardDeck()),
  };
}

/**
 * Generates a blank WizardTrickState
 *
 * @export
 * @returns {WizardTrickState}
 */
export function generateBlankTrickState(): WizardTrickState {
  return {
    cards: [],
  };
}
