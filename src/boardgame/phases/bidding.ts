import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { G } from "../G";

export const bidding: PhaseConfig = {
  moves: {
    predictNumberOfTricks(
      g: G,
      ctx: Ctx,
      numberOfTricks: number
    ): "INVALID_MOVE" | void {
      if (numberOfTricks < 0 || numberOfTricks > g.numCardsOnHand) {
        return INVALID_MOVE;
      }
      const isNotFirstRound = g.numCardsOnHand > 1;
      const isLastPlayer =
        g.bids.filter(
          (score, i) => i !== parseInt(ctx.currentPlayer, 10) && score === null
        ).length === 0;
      const isTotalPredictionEven =
        [numberOfTricks, ...g.bids].reduce(
          (sum, value) => (sum || 0) + (value || 0),
          0
        ) === g.numCardsOnHand;
      if (isNotFirstRound && isLastPlayer && isTotalPredictionEven) {
        return INVALID_MOVE;
      }
      // eslint-disable-next-line no-param-reassign
      g.bids[parseInt(ctx.currentPlayer, 10)] = numberOfTricks;
      ctx.events!.endTurn!();
    },
  },
  endIf(g: G) {
    return !g.bids.includes(null);
  },
  next: "play",
};
