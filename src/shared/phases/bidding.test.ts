import { FnContext } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";

import { bid, bidding } from "./bidding";
import { WizardState } from "../WizardState";
import { generateCtx } from "../../test/utils/ctx";
import { NumPlayers, PlayerID } from "../entities/players";
import { Phase } from "./phase";
import { EventsAPI } from "../boardgame.io.types";

interface GenerateOptions {
  numPlayers?: NumPlayers;
  bids?: (number | null)[];
  numCards?: number;
}

function mockEvents(overrides: Partial<EventsAPI> = {}): EventsAPI {
  return {
    endGame: () => {},
    endPhase: () => {},
    endStage: () => {},
    endTurn: () => {},
    pass: () => {},
    setActivePlayers: () => {},
    setPhase: () => {},
    setStage: () => {},
    ...overrides,
  };
}

function generate({
  numPlayers = 4,
  bids = new Array(numPlayers).fill(null),
  numCards = 3,
}: GenerateOptions): { g: WizardState; context: FnContext<WizardState> } {
  const currentPlayer = bids.findIndex((e) => e === null) as PlayerID;
  const ctx = generateCtx({
    turn: currentPlayer + 1,
    currentPlayer: currentPlayer.toString(),
  });
  const g: WizardState = {
    config: {},
    roundIndex: 0,
    rounds: [numCards],
    scorePad: [],
    dealer: 0 as PlayerID,
    numPlayers,
    currentPlayer,
    phase: Phase.Bidding,
    round: {
      bids,
      hands: new Array(ctx.numPlayers).fill(null),
      handsMeta: new Array(ctx.numPlayers).fill(null),
      deck: [],
      trump: { card: null },
      trickCount: new Array(ctx.numPlayers).fill(0),
    },
    trick: null,
  };
  const context: FnContext<WizardState> = {
    G: g,
    ctx,
    events: mockEvents(),
    random: {} as FnContext<WizardState>["random"],
    log: { setMetadata: () => {} },
  } as FnContext<WizardState>;
  return { g, context };
}

describe("bidding", () => {
  it("should throw if round is not set", () => {
    const { context, g } = generate({ bids: [1, null, null, null] });
    context.G = { ...g, round: null };
    expect(() => bid(context, 2)).toThrow();
  });

  test("invalid when prediction below 0", () => {
    const { context } = generate({ bids: [1, null, null, null] });
    expect(bid(context, -1)).toBe(INVALID_MOVE);
  });

  test("invalid when prediction above number of cards", () => {
    const { context } = generate({ bids: [1, null, null, null] });
    expect(bid(context, 4)).toBe(INVALID_MOVE);
  });

  test("not invalid when prediction is 0", () => {
    const { context } = generate({ bids: [1, null, null, null] });
    expect(bid(context, 0)).not.toBe(INVALID_MOVE);
  });

  test("not invalid when prediction equals number of cards and not last player", () => {
    const { context } = generate({ bids: [1, null, null, null] });
    expect(bid(context, 3)).not.toBe(INVALID_MOVE);
  });

  test("invalid when last player's prediction makes it even", () => {
    {
      const { context } = generate({ bids: [1, 0, 1, null] });
      expect(bid(context, 1)).toBe(INVALID_MOVE);
    }
    {
      const { context } = generate({ bids: [2, 0, 1, null] });
      expect(bid(context, 0)).toBe(INVALID_MOVE);
    }
  });

  test("not invalid when last player's prediction makes it even in first round", () => {
    {
      const { context } = generate({
        bids: [1, 0, 0, null],
        numCards: 1,
      });
      expect(bid(context, 0)).not.toBe(INVALID_MOVE);
    }
    {
      const { context } = generate({
        bids: [0, 0, 0, null],
        numCards: 1,
      });
      expect(bid(context, 1)).not.toBe(INVALID_MOVE);
    }
  });

  test("sets the corresponding score", () => {
    const { context, g } = generate({ bids: [1, null, null, null] });
    bid(context, 2);
    expect(g.round!.bids[1]).toBe(2);
  });

  test("ends the turn", () => {
    const { context } = generate({ bids: [1, null, null, null] });
    const mockEndTurn = jest.fn();
    context.events = mockEvents({ endTurn: mockEndTurn });
    bid(context, 2);
    expect(mockEndTurn).toHaveBeenCalled();
  });
});

describe("bidding endIf", () => {
  it("should throw if round is not set", () => {
    const { context, g } = generate({ bids: [1, 2, 3, null] });
    context.G = { ...g, round: null };
    expect(() => bidding.endIf(context)).toThrow();
  });

  it.each([
    [[null, null, null, null]],
    [[1, null, null, null]],
    [[1, 2, null, null]],
    [[1, 2, 3, null]],
    [[null, 2, 3, 4]],
  ])("should return false if some bids are still null", (bids) => {
    const { context } = generate({ bids });
    expect(bidding.endIf(context)).toBe(false);
  });

  it("should return true if all bids are set", () => {
    const { context } = generate({ bids: [1, 2, 3, 0] });
    expect(bidding.endIf(context)).toBe(true);
  });
});

describe("bidding onEnd", () => {
  it("should throw if round is not set", () => {
    const { context, g } = generate({ bids: [1, 2, 3, 0] });
    context.G = { ...g, round: null };
    expect(() => bidding.onEnd(context)).toThrow();
  });

  it("should throw if bids are not complete", () => {
    const { context } = generate({ bids: [1, 2, 3, null] });
    expect(() => bidding.onEnd(context)).toThrow();
  });

  it.each([
    [[1, 2, 3, 0], 3, 3],
    [[0, 0, 0, 0], 1, -1],
  ])("should set the bids mismatch", (bids, numCards, mismatch) => {
    const { context, g } = generate({ bids, numCards });
    bidding.onEnd(context);
    expect(g.round?.bidsMismatch).toBe(mismatch);
  });
});
