import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";

import { bid } from "./bidding";
import { G } from "../G";
import { generateCtx } from "../util/ctx.util";

interface GenerateOptions {
  numPlayers?: number;
  bids?: Array<number | null>;
  numCards?: number;
}

function generate({
  numPlayers = 4,
  bids = new Array(numPlayers).fill(null),
  numCards = 3,
}: GenerateOptions): { g: G; ctx: Ctx } {
  const currentPlayer = bids.findIndex((e) => e === null);
  const ctx: Ctx = generateCtx({
    turn: currentPlayer + 1,
    currentPlayer: currentPlayer.toString(),
  });
  const g: G = {
    game: {
      numCards,
      scorePad: [],
      dealer: "",
    },
    round: {
      bids,
      hands: new Array(ctx.numPlayers).fill(null),
      deck: [],
      trump: null,
      trickCount: new Array(ctx.numPlayers).fill(0),
    },
    trick: null,
  };
  return {
    g,
    ctx,
  };
}

describe("predict", () => {
  test("invalid when prediction below 0", () => {
    const { ctx, g } = generate({ bids: [1, null, null, null] });
    expect(bid(g, ctx, -1)).toBe(INVALID_MOVE);
  });

  test("invalid when prediction above number of cards", () => {
    const { ctx, g } = generate({ bids: [1, null, null, null] });
    expect(bid(g, ctx, 4)).toBe(INVALID_MOVE);
  });

  test("not invalid when prediction is 0", () => {
    const { ctx, g } = generate({ bids: [1, null, null, null] });
    expect(bid(g, ctx, 0)).not.toBe(INVALID_MOVE);
  });

  test("not invalid when prediction equals number of cards and not last player", () => {
    const { ctx, g } = generate({ bids: [1, null, null, null] });
    expect(bid(g, ctx, 3)).not.toBe(INVALID_MOVE);
  });

  test("invalid when last player's prediction makes it even", () => {
    {
      const { ctx, g } = generate({ bids: [1, 0, 1, null] });
      expect(bid(g, ctx, 1)).toBe(INVALID_MOVE);
    }
    {
      const { ctx, g } = generate({ bids: [2, 0, 1, null] });
      expect(bid(g, ctx, 0)).toBe(INVALID_MOVE);
    }
  });

  test("not invalid when last player's prediction makes it even in first round", () => {
    {
      const { ctx, g } = generate({
        bids: [1, 0, 0, null],
        numCards: 1,
      });
      expect(bid(g, ctx, 0)).not.toBe(INVALID_MOVE);
    }
    {
      const { ctx, g } = generate({
        bids: [0, 0, 0, null],
        numCards: 1,
      });
      expect(bid(g, ctx, 1)).not.toBe(INVALID_MOVE);
    }
  });

  test("sets the corresponding score", () => {
    const { ctx, g } = generate({ bids: [1, null, null, null] });
    bid(g, ctx, 2);
    expect(g.round!.bids[1]).toBe(2);
  });

  test("ends the turn", () => {
    const { ctx, g } = generate({ bids: [1, null, null, null] });
    const mockEndTurn = jest.fn();
    ctx.events!.endTurn = mockEndTurn;
    bid(g, ctx, 2);
    expect(mockEndTurn).toBeCalled();
  });
});
