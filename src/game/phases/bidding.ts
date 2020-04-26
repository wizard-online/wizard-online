/* eslint-disable no-param-reassign */
import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { WizardState, isSetRound } from "../WizardState";
import { isValidBid, getBidsMismatch } from "../entities/bid.utils";
import { Phase } from "./phase";
import { sortHand, getClientHand } from "../entities/cards.utils";

export function bid(
  { round, numCards, currentPlayer }: WizardState,
  ctx: Ctx,
  numberOfTricks: number
): "INVALID_MOVE" | void {
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  if (!isValidBid(numberOfTricks, numCards, round.bids, currentPlayer)) {
    return INVALID_MOVE;
  }

  round.bids[Number.parseInt(ctx.currentPlayer, 10)] = numberOfTricks;
  ctx.events!.endTurn!();
}

export function sortCards({ currentPlayer, round }: WizardState): void {
  if (!round) return;
  // set sorted hand to state
  round.hands[currentPlayer] = sortHand(
    getClientHand(round.hands, currentPlayer),
    round.trump?.suit
  );
}

function endIf({ round }: WizardState): boolean {
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  return !round.bids.includes(null);
}

function onEnd({ round, numCards }: WizardState): void {
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  if (round.bids.includes(null)) {
    throw new Error("bids are not complete");
  }
  round.bidsMismatch = getBidsMismatch(round.bids as number[], numCards);
}

export const bidding: PhaseConfig = {
  moves: {
    bid,
    sortCards,
  },
  endIf,
  onEnd,
  next: Phase.Playing,
};
