import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";

import { predict } from "./predict";
import { G } from "../G";
import { generateCtx } from "../ctx.util";

interface GenerateOptions {
  numPlayers?: number;
  score?: Array<number | null>;
  numCardsOnHand?: number;
}

function generate({
  numPlayers = 4,
  score = Array(numPlayers).fill(null),
  numCardsOnHand = 3,
}: GenerateOptions): { g: G; ctx: Ctx } {
  const currentPlayer = score.findIndex((e) => e === null);
  const ctx: Ctx = generateCtx({
    turn: currentPlayer + 1,
    currentPlayer: currentPlayer.toString(),
  });
  const g: G = {
    numCardsOnHand,
    score,
    hands: Array(ctx.numPlayers).fill(null),
    deck: [],
  };
  return {
    g,
    ctx,
  };
}

describe("predict", () => {
  test("invalid when prediction below 0", () => {
    const { ctx, g } = generate({ score: [1, null, null, null] });
    expect(predict.moves?.predictNumberOfTricks(g, ctx, -1)).toBe(INVALID_MOVE);
  });

  test("invalid when prediction above number of cards", () => {
    const { ctx, g } = generate({ score: [1, null, null, null] });
    expect(predict.moves?.predictNumberOfTricks(g, ctx, 4)).toBe(INVALID_MOVE);
  });

  test("not invalid when prediction is 0", () => {
    const { ctx, g } = generate({ score: [1, null, null, null] });
    expect(predict.moves?.predictNumberOfTricks(g, ctx, 0)).not.toBe(
      INVALID_MOVE
    );
  });

  test("not invalid when prediction equals number of cards and not last player", () => {
    const { ctx, g } = generate({ score: [1, null, null, null] });
    expect(predict.moves?.predictNumberOfTricks(g, ctx, 3)).not.toBe(
      INVALID_MOVE
    );
  });

  test("invalid when last player's prediction makes it even", () => {
    {
      const { ctx, g } = generate({ score: [1, 0, 1, null] });
      expect(predict.moves?.predictNumberOfTricks(g, ctx, 1)).toBe(
        INVALID_MOVE
      );
    }
    {
      const { ctx, g } = generate({ score: [2, 0, 1, null] });
      expect(predict.moves?.predictNumberOfTricks(g, ctx, 0)).toBe(
        INVALID_MOVE
      );
    }
  });

  test("not invalid when last player's prediction makes it even in first round", () => {
    {
      const { ctx, g } = generate({
        score: [1, 0, 0, null],
        numCardsOnHand: 1,
      });
      expect(predict.moves?.predictNumberOfTricks(g, ctx, 0)).not.toBe(
        INVALID_MOVE
      );
    }
    {
      const { ctx, g } = generate({
        score: [0, 0, 0, null],
        numCardsOnHand: 1,
      });
      expect(predict.moves?.predictNumberOfTricks(g, ctx, 1)).not.toBe(
        INVALID_MOVE
      );
    }
  });

  test("sets the corresponding score", () => {
    const { ctx, g } = generate({ score: [1, null, null, null] });
    predict.moves?.predictNumberOfTricks(g, ctx, 2);
    expect(g.score[1]).toBe(2);
  });

  test("ends the turn", () => {
    const { ctx, g } = generate({ score: [1, null, null, null] });
    const mockEndTurn = jest.fn();
    ctx.events!.endTurn = mockEndTurn;
    predict.moves?.predictNumberOfTricks(g, ctx, 2);
    expect(mockEndTurn).toBeCalled();
  });
});
