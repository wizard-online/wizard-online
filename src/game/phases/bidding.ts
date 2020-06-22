/* eslint-disable no-param-reassign */
import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { WizardState, isSetRound } from "../WizardState";
import { isValidBid, getBidsMismatch } from "../entities/bid.utils";
import { Phase } from "./phase";

export function bid(
  { round, roundIndex, rounds, currentPlayer }: WizardState,
  ctx: Ctx,
  numberOfTricks: number
): "INVALID_MOVE" | void {
  const numCards = rounds[roundIndex];
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  if (!isValidBid(numberOfTricks, numCards, round.bids, currentPlayer)) {
    return INVALID_MOVE;
  }

  round.bids[Number.parseInt(ctx.currentPlayer, 10)] = numberOfTricks;
  ctx.events!.endTurn!();
}

function endIf({ round }: WizardState): boolean {
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  return !round.bids.includes(null);
}

function onEnd({ round, roundIndex, rounds }: WizardState): void {
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  if (round.bids.includes(null)) {
    throw new Error("bids are not complete");
  }
  round.bidsMismatch = getBidsMismatch(
    round.bids as number[],
    rounds[roundIndex]
  );
}

export const bidding: PhaseConfig = {
  moves: {
    bid,
  },
  endIf,
  onEnd,
  next: Phase.Playing,
};
