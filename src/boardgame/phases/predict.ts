import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { G } from "../G";

export const predict: PhaseConfig = {
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
        g.score.filter(
          (score, i) => i !== parseInt(ctx.currentPlayer, 10) && score === null
        ).length === 0;
      const isTotalPredictionEven =
        [numberOfTricks, ...g.score].reduce(
          (sum, value) => (sum || 0) + (value || 0),
          0
        ) === g.numCardsOnHand;
      if (isNotFirstRound && isLastPlayer && isTotalPredictionEven) {
        return INVALID_MOVE;
      }
      // eslint-disable-next-line no-param-reassign
      g.score[parseInt(ctx.currentPlayer, 10)] = numberOfTricks;
      ctx.events!.endTurn!();
    },
  },
  endIf(g: G) {
    return !g.score.includes(null);
  },
  next: "play",
};
