/* eslint-disable no-param-reassign */
import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { WizardState, isSetRound } from "../WizardState";
import { isValidBid } from "../util/bid";
import { Phase } from "./phase";

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

function endIf({ round }: WizardState): boolean {
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  return !round.bids.includes(null);
}

export const bidding: PhaseConfig = {
  moves: {
    bid,
  },
  endIf,
  next: Phase.Playing,
};
