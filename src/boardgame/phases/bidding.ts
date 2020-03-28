/* eslint-disable no-param-reassign */
import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { G, isSetRound } from "../G";
import { isValidBid } from "../util/bid";

export const bidding: PhaseConfig = {
  moves: {
    bid(
      { round, game }: G,
      ctx: Ctx,
      numberOfTricks: number
    ): "INVALID_MOVE" | void {
      if (!isSetRound(round)) {
        throw new Error("round is not set");
      }
      if (
        !isValidBid(
          numberOfTricks,
          game.numCards,
          round.bids,
          ctx.currentPlayer
        )
      ) {
        return INVALID_MOVE;
      }

      round.bids[Number.parseInt(ctx.currentPlayer, 10)] = numberOfTricks;
      ctx.events!.endTurn!();
    },
  },
  endIf({ round }: G) {
    if (!isSetRound(round)) {
      throw new Error("round is not set");
    }
    return !round.bids.includes(null);
  },
  next: "playing",
};
