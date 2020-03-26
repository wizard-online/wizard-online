import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { G, isSetRound } from "../G";

export const bidding: PhaseConfig = {
  moves: {
    predictNumberOfTricks(
      { round, game }: G,
      ctx: Ctx,
      numberOfTricks: number
    ): "INVALID_MOVE" | void {
      if (!isSetRound(round)) {
        throw Error("round is not set");
      }
      if (numberOfTricks < 0 || numberOfTricks > game.numCards) {
        return INVALID_MOVE;
      }
      const isNotFirstRound = game.numCards > 1;
      const isLastPlayer =
        round.bids.filter(
          (score, i) => i !== parseInt(ctx.currentPlayer, 10) && score === null
        ).length === 0;
      const isTotalPredictionEven =
        [numberOfTricks, ...round.bids].reduce(
          (sum, value) => (sum || 0) + (value || 0),
          0
        ) === game.numCards;
      if (isNotFirstRound && isLastPlayer && isTotalPredictionEven) {
        return INVALID_MOVE;
      }
      // eslint-disable-next-line no-param-reassign
      round.bids[parseInt(ctx.currentPlayer, 10)] = numberOfTricks;
      ctx.events!.endTurn!();
    },
  },
  endIf({ round }: G) {
    if (!isSetRound(round)) {
      throw Error("round is not set");
    }
    return !round.bids.includes(null);
  },
  next: "play",
};
