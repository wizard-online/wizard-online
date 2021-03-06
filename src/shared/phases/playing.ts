/* eslint-disable no-param-reassign */
import { PhaseConfig, Ctx } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import flatten from "lodash/flatten";

import {
  WizardState,
  isSetRound,
  isSetTrick,
  generateBlankTrickState,
} from "../WizardState";
import {
  canPlayCard,
  getSuitsInHand,
  getTrickWinner,
  getClientHand,
} from "../entities/cards.utils";
import { updateScorePad } from "../entities/score.utils";
import { playersRound } from "../entities/players.utils";
import { Phase } from "./phase";
import { Rank } from "../entities/cards";
import { OptionalTrickCard, TrickCard } from "../entities/trick";
import { checkTrickCards } from "../entities/trick.utils";

export function play(
  g: WizardState,
  ctx: Ctx,
  cardIndex: number
): void | typeof INVALID_MOVE {
  const { round } = g;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  // as first player, init trick
  if (!g.trick || g.trick.isComplete) {
    if (g.config.inspectPreviousTrick && g.trick) {
      round.previousTrick = g.trick.cards as TrickCard[];
    }
    const trickPlayerOrder = playersRound(g.currentPlayer, g.numPlayers).map(
      (playerID) => ({ player: playerID } as OptionalTrickCard)
    );
    g.trick = generateBlankTrickState({ cards: trickPlayerOrder });
  }

  const hand = getClientHand(round.hands, g.currentPlayer);
  if (cardIndex < 0 || cardIndex >= hand.length) {
    return INVALID_MOVE;
  }
  const cardPlayed = hand[cardIndex];
  if (!canPlayCard(cardPlayed, getSuitsInHand(hand), g.trick?.lead)) {
    return INVALID_MOVE;
  }

  const { trick } = g;
  if (!isSetTrick(trick)) {
    throw new Error("trick is not set");
  }
  // set lead card (usually only first player, or first palyer after N)
  if (!trick.lead && cardPlayed.rank !== Rank.N) {
    trick.lead = cardPlayed;
  }

  if (!round.trickCount) {
    round.trickCount = new Array(5).fill(0);
  }
  // play card
  hand.splice(cardIndex, 1);
  const trickPlayerIndex = trick.cards.findIndex(
    ({ player }) => player === g.currentPlayer
  );
  if (!(trickPlayerIndex >= 0)) {
    throw new Error("current player does not exist in the trick");
  }
  trick.cards[trickPlayerIndex].card = cardPlayed;
  // pass turn to next player
  // as last player, find trick taker, increment trick count, and cleanup trick
  if (trick.cards.filter(({ card }) => !card).length === 0) {
    endTrick(g, ctx);
  } else {
    ctx.events?.endTurn?.();
  }
}

function endTrick(g: WizardState, ctx: Ctx): void {
  const { round, trick } = g;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  if (!isSetTrick(trick)) {
    throw new Error("trick is not set");
  }
  if (!checkTrickCards(trick.cards)) {
    throw new Error("cannot end trick if not all cards are played yet");
  }

  // mark trick is completed
  trick.isComplete = true;

  // check that all players have same amount of cards
  if (!round.hands.every((hand) => hand.length === round.hands[0].length)) {
    throw new Error(
      "players have not equal amount of cards at the end of the trick"
    );
  }
  const { player } = getTrickWinner(trick.cards, round.trump?.suit || null);
  round.trickCount![player] += 1;

  ctx.events?.endTurn?.({ next: player.toString() });
}

function onBegin({ round }: WizardState, { numPlayers }: Ctx): void {
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  round.trickCount = new Array(numPlayers).fill(0);
}

function endIf({ round }: WizardState): boolean {
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  return flatten(round.hands).length === 0;
}

function onEnd(g: WizardState): void {
  const { round, roundIndex, rounds, scorePad } = g;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  if (flatten(round.hands).length > 0) {
    throw new Error("hands are not empty when attempting to end the round");
  }

  // calc score
  g.scorePad = updateScorePad(
    round.bids,
    round.trickCount,
    rounds[roundIndex],
    scorePad
  );
  // mark current round complete
  round.isComplete = true;
}

export const playing: PhaseConfig = {
  moves: {
    play,
  },
  onBegin,
  endIf,
  next: Phase.Setup,
  onEnd,
};
