/* eslint-disable no-param-reassign */
import { FnContext } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { WizardState, isSetRound } from "../WizardState";
import { isValidBid, getBidsMismatch } from "../entities/bid.utils";
import { Phase } from "./phase";

export function bid(
  { G, ctx, events }: FnContext<WizardState>,
  numberOfTricks: number
): "INVALID_MOVE" | void {
  const { round, roundIndex, rounds, currentPlayer } = G;
  const numCards = rounds[roundIndex];
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  if (!isValidBid(numberOfTricks, numCards, round.bids, currentPlayer)) {
    return INVALID_MOVE;
  }

  round.bids[Number.parseInt(ctx.currentPlayer, 10)] = numberOfTricks;
  events.endTurn();
}

function endIf({ G }: FnContext<WizardState>): boolean {
  const { round } = G;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }
  return !round.bids.includes(null);
}

function onEnd({ G }: FnContext<WizardState>): void {
  const { round, roundIndex, rounds } = G;
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

export const bidding = {
  moves: {
    bid,
  },
  endIf,
  onEnd,
  next: Phase.Playing,
};
