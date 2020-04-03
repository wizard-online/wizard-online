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
} from "../entities/cards.utils";
import { updateScorePad } from "../entities/score.utils";
import { Phase } from "./phase";
import { Rank } from "../entities/cards";

export function play(
  g: WizardState,
  ctx: Ctx,
  cardIndex: number
): void | "INVALID_MOVE" {
  const { round } = g;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }

  const hand = round.hands[Number.parseInt(ctx.currentPlayer, 10)];
  if (cardIndex < 0 || cardIndex >= hand.length) {
    return INVALID_MOVE;
  }
  const card = hand[cardIndex];
  if (!canPlayCard(card, getSuitsInHand(hand), g.trick?.lead)) {
    return INVALID_MOVE;
  }

  // as first player, init trick
  if (!g.trick) {
    g.trick = generateBlankTrickState();
  }
  const { trick } = g;
  if (!isSetTrick(trick)) {
    throw new Error("trick is not set");
  }
  // set lead card (usually only first player, or first palyer after N)
  if (!trick.lead && card.rank !== Rank.N) {
    trick.lead = card;
  }

  if (!round.trickCount) {
    round.trickCount = new Array(5).fill(0);
  }
  // play card
  hand.splice(cardIndex, 1);
  trick.cards.push([card, g.currentPlayer]);
  // pass turn to next player
  // as last player, find trick taker, increment trick count, and cleanup trick
  if (trick.cards.length === ctx.numPlayers) {
    trick.isComplete = true;
  } else {
    ctx.events?.endTurn!();
  }
}

function cleanupTrick(g: WizardState, ctx: Ctx): void {
  const { round, trick } = g;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  if (!isSetTrick(trick)) {
    throw new Error("trick is not set");
  }

  // check that all players have same amount of cards
  if (!round.hands.every((hand) => hand.length === round.hands[0].length)) {
    throw new Error(
      "players have not equal amount of cards at the end of the trick"
    );
  }
  const [, winnerPlayerId] = getTrickWinner(
    trick.cards,
    round.trump?.suit || null
  );
  round.trickCount![winnerPlayerId] += 1;
  g.trick = null;

  ctx.events?.endTurn!({ next: winnerPlayerId.toString() });
}

function onBegin({ round }: WizardState, { numPlayers }: Ctx): void {
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  round.trickCount = new Array(numPlayers).fill(0);
}

function endIf({ round, trick }: WizardState): boolean {
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  return !trick && flatten(round.hands).length === 0;
}

function onEnd(g: WizardState, ctx: Ctx): void {
  const { round, numCards, scorePad } = g;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  if (flatten(round.hands).length > 0) {
    throw new Error("hands are not empty when attempting to end the round");
  }

  // calc score
  g.scorePad = updateScorePad(round.bids, round.trickCount, numCards, scorePad);
  // check if game is finished
  const incNumCards = numCards + 1;
  if (incNumCards * ctx.numPlayers > 60) {
    const finalScore = scorePad[scorePad.length - 1];
    ctx.events!.endGame!(finalScore);
  } else {
    // next round with one card more
    g.numCards = incNumCards;
  }
}

export const playing: PhaseConfig = {
  moves: {
    play,
    cleanupTrick,
  },
  onBegin,
  endIf,
  next: Phase.Setup,
  onEnd,
};
