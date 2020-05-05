import { Ctx } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";

import { WizardState } from "../WizardState";
import { generateCtx } from "../../test/utils/ctx";
import { NumPlayers, PlayerID } from "../entities/players";
import { Phase } from "./phase";
import { Card, Suit } from "../entities/cards";
import { OptionalTrickCard } from "../entities/trick";
import { play } from "./playing";

interface GenerateOptions {
  numPlayers?: NumPlayers;
  hands: Card[][];
  trick: OptionalTrickCard[];
  currentPlayer: PlayerID;
  numCards?: number;
}

function generate({
  hands,
  trick,
  currentPlayer,
  numPlayers = 3,
  numCards = 3,
}: GenerateOptions): { g: WizardState; ctx: Ctx } {
  const ctx: Ctx = generateCtx({
    turn: currentPlayer + 1,
    currentPlayer: currentPlayer.toString(),
  });
  const g: WizardState = {
    config: {},
    roundIndex: 0,
    rounds: [numCards, numCards + 1],
    scorePad: [],
    dealer: 0 as PlayerID,
    numPlayers,
    currentPlayer,
    phase: Phase.Bidding,
    round: {
      bids: new Array(ctx.numPlayers).fill(0),
      hands,
      deck: [],
      trump: { card: null },
      trickCount: new Array(ctx.numPlayers).fill(0),
    },
    trick: {
      cards: trick,
      lead: trick?.[0].card,
    },
  };
  return {
    g,
    ctx,
  };
}

let scenario1: GenerateOptions;
beforeEach(() => {
  scenario1 = {
    trick: [
      {
        player: 0 as PlayerID,
        card: Card(Suit.Green, 4),
      },
      {
        player: 1 as PlayerID,
        card: undefined,
      },
      {
        player: 2 as PlayerID,
        card: undefined,
      },
    ],
    currentPlayer: 1 as PlayerID,
    hands: [
      [Card(Suit.Green, 5), Card(Suit.Yellow, 6)],
      [Card(Suit.Green, 3), Card(Suit.Red, 6), Card(Suit.Blue, 11)],
      [Card(Suit.Blue, 11), Card(Suit.Red, 4), Card(Suit.Blue, 1)],
    ],
  };
});

describe("play", () => {
  test("invalid if card index is < 0", () => {
    const { g, ctx } = generate(scenario1);

    expect(play(g, ctx, -1)).toBe(INVALID_MOVE);
  });
  test("invalid if card index is >= cards on hand", () => {
    const { g, ctx } = generate(scenario1);

    expect(play(g, ctx, 3)).toBe(INVALID_MOVE);
  });
  test("invalid if card cannot be played", () => {
    const { g, ctx } = generate(scenario1);

    expect(play(g, ctx, 1)).toBe(INVALID_MOVE);
    expect(play(g, ctx, 2)).toBe(INVALID_MOVE);
  });

  test("adds card to trick", () => {
    const { g, ctx } = generate(scenario1);
    const cardPlayed = g.round?.hands[1][0];
    play(g, ctx, 0);
    expect(g.trick?.cards[1].card).toBe(cardPlayed);
  });

  test("removes card from hand", () => {
    const { g, ctx } = generate(scenario1);
    const cardPlayed = g.round?.hands[1][0];
    play(g, ctx, 0);
    expect(g.round?.hands[1].length).toBe(2);
    expect(g.round?.hands[1].findIndex((card) => card === cardPlayed)).toBe(-1);
  });

  test("last card completes trick", () => {
    const { g, ctx } = generate(scenario1);
    // player 1
    play(g, ctx, 0);
    // player 2 completes trick
    g.currentPlayer = 2;
    ctx.currentPlayer = "2";
    play(g, ctx, 1);
    expect(g.trick?.isComplete).toBe(true);
  });

  test("first player can play any card", () => {
    const { g, ctx } = generate(scenario1);
    // player 1
    play(g, ctx, 0);
    // player 2 completes trick
    g.currentPlayer = 2;
    ctx.currentPlayer = "2";
    play(g, ctx, 1);
    // next player 0
    ctx.currentPlayer = "0";
    g.currentPlayer = 0;
    // plays other suit that previous trick's lead color
    const playReturn = play(g, ctx, 1);
    expect(playReturn).toBeUndefined();
  });
});
