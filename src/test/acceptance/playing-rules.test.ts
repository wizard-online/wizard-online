import { INVALID_MOVE } from "boardgame.io/core";
import { buildState, c, WIZARD, NULL_CARD } from "../utils/state-builder";
import { GameRunner } from "../utils/game-runner";
import { Suit, Rank } from "../../shared/entities/cards";
import { Phase } from "../../shared/phases/phase";
import { PlayerID } from "../../shared/entities/players";
import { play } from "../../shared/phases/playing";
import { updateScorePad } from "../../shared/entities/score.utils";

describe("Group A: Trick winner determination", () => {
  test("A1: Highest trump wins the trick", () => {
    const { g } = buildState({
      numPlayers: 3,
      phase: Phase.Playing,
      currentPlayer: 0 as PlayerID,
      rounds: [1, 2],
      round: {
        bids: [1, 0, 1],
        hands: [
          [c(Suit.Blue, Rank.Five)],
          [c(Suit.Blue, Rank.Three)],
          [c(Suit.Red, Rank.Two)],
        ],
        trickCount: [0, 0, 0],
        trump: { card: c(Suit.Red, Rank.One), suit: Suit.Red },
      },
    });

    const runner = new GameRunner(g, 3);
    runner.play(0 as PlayerID, c(Suit.Blue, Rank.Five));
    runner.play(1 as PlayerID, c(Suit.Blue, Rank.Three));
    runner.play(2 as PlayerID, c(Suit.Red, Rank.Two));

    expect(runner.state.round!.trickCount[2]).toBe(1);
    expect(runner.currentPlayer).toBe(2);
  });

  test("A2: First Wizard wins", () => {
    const { g } = buildState({
      numPlayers: 3,
      phase: Phase.Playing,
      currentPlayer: 0 as PlayerID,
      rounds: [1, 2],
      round: {
        bids: [1, 0, 0],
        hands: [
          [WIZARD(Suit.Blue)],
          [WIZARD(Suit.Red)],
          [c(Suit.Green, Rank.Thirteen)],
        ],
        trickCount: [0, 0, 0],
        trump: { card: null },
      },
    });

    const runner = new GameRunner(g, 3);
    runner.play(0 as PlayerID, WIZARD(Suit.Blue));
    runner.play(1 as PlayerID, WIZARD(Suit.Red));
    runner.play(2 as PlayerID, c(Suit.Green, Rank.Thirteen));

    expect(runner.state.round!.trickCount[0]).toBe(1);
    expect(runner.currentPlayer).toBe(0);
  });

  test("A3: All Nulls — first player wins", () => {
    const { g } = buildState({
      numPlayers: 3,
      phase: Phase.Playing,
      currentPlayer: 0 as PlayerID,
      rounds: [1, 2],
      round: {
        bids: [1, 0, 0],
        hands: [
          [NULL_CARD(Suit.Blue)],
          [NULL_CARD(Suit.Red)],
          [NULL_CARD(Suit.Green)],
        ],
        trickCount: [0, 0, 0],
        trump: { card: null },
      },
    });

    const runner = new GameRunner(g, 3);
    runner.play(0 as PlayerID, NULL_CARD(Suit.Blue));
    runner.play(1 as PlayerID, NULL_CARD(Suit.Red));
    runner.play(2 as PlayerID, NULL_CARD(Suit.Green));

    expect(runner.state.round!.trickCount[0]).toBe(1);
  });

  test("A4: Null leads trick — next regular card sets lead suit", () => {
    const { g } = buildState({
      numPlayers: 3,
      phase: Phase.Playing,
      currentPlayer: 0 as PlayerID,
      rounds: [1, 2],
      round: {
        bids: [0, 1, 0],
        hands: [
          [NULL_CARD(Suit.Blue)],
          [c(Suit.Green, Rank.Five)],
          [c(Suit.Green, Rank.Three)],
        ],
        trickCount: [0, 0, 0],
        trump: { card: null },
      },
    });

    const runner = new GameRunner(g, 3);
    runner.play(0 as PlayerID, NULL_CARD(Suit.Blue));
    runner.play(1 as PlayerID, c(Suit.Green, Rank.Five));
    runner.play(2 as PlayerID, c(Suit.Green, Rank.Three));

    expect(runner.state.round!.trickCount[1]).toBe(1);
  });

  test("A5: Trick winner becomes currentPlayer (leads next)", () => {
    const { g } = buildState({
      numPlayers: 3,
      phase: Phase.Playing,
      currentPlayer: 0 as PlayerID,
      rounds: [1, 2],
      round: {
        bids: [1, 0, 1],
        hands: [
          [c(Suit.Blue, Rank.Five)],
          [c(Suit.Blue, Rank.Three)],
          [c(Suit.Red, Rank.Two)],
        ],
        trickCount: [0, 0, 0],
        trump: { card: c(Suit.Red, Rank.One), suit: Suit.Red },
      },
    });

    const runner = new GameRunner(g, 3);
    runner.play(0 as PlayerID, c(Suit.Blue, Rank.Five));
    runner.play(1 as PlayerID, c(Suit.Blue, Rank.Three));
    runner.play(2 as PlayerID, c(Suit.Red, Rank.Two));

    expect(runner.currentPlayer).toBe(2);
  });
});

describe("Group B: Suit-following rules", () => {
  test("B6: Different suit when holding lead suit -> INVALID_MOVE", () => {
    const { g, ctx } = buildState({
      numPlayers: 3,
      phase: Phase.Playing,
      currentPlayer: 1 as PlayerID,
      round: {
        bids: [0, 0, 0],
        hands: [[], [c(Suit.Blue, Rank.Three), c(Suit.Red, Rank.Seven)], []],
        trickCount: [0, 0, 0],
      },
      trick: {
        cards: [
          { card: c(Suit.Blue, Rank.Five), player: 0 as PlayerID },
          { card: undefined, player: 1 as PlayerID },
          { card: undefined, player: 2 as PlayerID },
        ],
        lead: c(Suit.Blue, Rank.Five),
      },
    });

    const result = play(g, ctx, 1); // Red 7, wrong suit
    expect(result).toBe(INVALID_MOVE);
  });

  test("B7: Trump when holding lead suit -> INVALID_MOVE", () => {
    const { g, ctx } = buildState({
      numPlayers: 3,
      phase: Phase.Playing,
      currentPlayer: 1 as PlayerID,
      round: {
        bids: [0, 0, 0],
        hands: [[], [c(Suit.Blue, Rank.Three), c(Suit.Green, Rank.Two)], []],
        trickCount: [0, 0, 0],
        trump: { card: c(Suit.Green, Rank.One), suit: Suit.Green },
      },
      trick: {
        cards: [
          { card: c(Suit.Blue, Rank.Five), player: 0 as PlayerID },
          { card: undefined, player: 1 as PlayerID },
          { card: undefined, player: 2 as PlayerID },
        ],
        lead: c(Suit.Blue, Rank.Five),
      },
    });

    const result = play(g, ctx, 1); // Green 2 = trump, but has Blue
    expect(result).toBe(INVALID_MOVE);
  });

  test("B8: Any card allowed when out of lead suit", () => {
    const { g, ctx } = buildState({
      numPlayers: 3,
      phase: Phase.Playing,
      currentPlayer: 1 as PlayerID,
      round: {
        bids: [0, 0, 0],
        hands: [[], [c(Suit.Red, Rank.Three), c(Suit.Yellow, Rank.Seven)], []],
        trickCount: [0, 0, 0],
      },
      trick: {
        cards: [
          { card: c(Suit.Blue, Rank.Five), player: 0 as PlayerID },
          { card: undefined, player: 1 as PlayerID },
          { card: undefined, player: 2 as PlayerID },
        ],
        lead: c(Suit.Blue, Rank.Five),
      },
    });

    const result = play(g, ctx, 1); // Yellow 7, not lead suit but no Blue in hand
    expect(result).not.toBe(INVALID_MOVE);
  });

  test("B9: Null always allowed regardless of hand", () => {
    const { g, ctx } = buildState({
      numPlayers: 3,
      phase: Phase.Playing,
      currentPlayer: 1 as PlayerID,
      round: {
        bids: [0, 0, 0],
        hands: [[], [NULL_CARD(Suit.Blue), c(Suit.Blue, Rank.Three)], []],
        trickCount: [0, 0, 0],
      },
      trick: {
        cards: [
          { card: c(Suit.Blue, Rank.Five), player: 0 as PlayerID },
          { card: undefined, player: 1 as PlayerID },
          { card: undefined, player: 2 as PlayerID },
        ],
        lead: c(Suit.Blue, Rank.Five),
      },
    });

    const result = play(g, ctx, 0); // Null card
    expect(result).not.toBe(INVALID_MOVE);
  });

  test("B9b: Wizard always allowed regardless of hand", () => {
    const { g, ctx } = buildState({
      numPlayers: 3,
      phase: Phase.Playing,
      currentPlayer: 1 as PlayerID,
      round: {
        bids: [0, 0, 0],
        hands: [[], [WIZARD(Suit.Blue), c(Suit.Blue, Rank.Three)], []],
        trickCount: [0, 0, 0],
      },
      trick: {
        cards: [
          { card: c(Suit.Blue, Rank.Five), player: 0 as PlayerID },
          { card: undefined, player: 1 as PlayerID },
          { card: undefined, player: 2 as PlayerID },
        ],
        lead: c(Suit.Blue, Rank.Five),
      },
    });

    const result = play(g, ctx, 0); // Wizard card
    expect(result).not.toBe(INVALID_MOVE);
  });
});

describe("Group C: Multi-trick sequence", () => {
  test("C10: Complete 1-trick round -> round complete, scorePad updated", () => {
    const { g } = buildState({
      numPlayers: 3,
      phase: Phase.Playing,
      currentPlayer: 0 as PlayerID,
      rounds: [1, 2],
      roundIndex: 0,
      round: {
        bids: [0, 1, 0],
        hands: [
          [c(Suit.Blue, Rank.Five)],
          [c(Suit.Blue, Rank.Seven)],
          [c(Suit.Blue, Rank.Two)],
        ],
        trickCount: [0, 0, 0],
        trump: { card: null },
      },
    });

    const runner = new GameRunner(g, 3);
    runner.play(0 as PlayerID, c(Suit.Blue, Rank.Five));
    runner.play(1 as PlayerID, c(Suit.Blue, Rank.Seven));
    runner.play(2 as PlayerID, c(Suit.Blue, Rank.Two));

    expect(runner.isRoundComplete).toBe(true);
    expect(runner.state.round!.isComplete).toBe(true);
    expect(runner.state.round!.trickCount[1]).toBe(1);
    expect(runner.state.scorePad.length).toBe(1);

    const scores = runner.state.scorePad[0].playerScores;
    // Player 1: bid 1, won 1 -> 20 + 10 = 30
    expect(scores[1].score).toBe(30);
    // Players 0, 2: bid 0, won 0 -> 20
    expect(scores[0].score).toBe(20);
    expect(scores[2].score).toBe(20);
  });
});

describe("Group D: Score calculation", () => {
  test("D11: Hit bid exactly -> 20 + bid x 10", () => {
    const result = updateScorePad([2, 1, 0], [2, 1, 0], 3, []);
    expect(result[0].playerScores[0].score).toBe(40); // 20 + 2*10
    expect(result[0].playerScores[1].score).toBe(30); // 20 + 1*10
    expect(result[0].playerScores[2].score).toBe(20); // 20 + 0*10
  });

  test("D12: Bid 0, win 0 -> 20", () => {
    const result = updateScorePad([0], [0], 1, []);
    expect(result[0].playerScores[0].score).toBe(20);
  });

  test("D13: Bid 2, win 1 -> -10", () => {
    const result = updateScorePad([2], [1], 2, []);
    expect(result[0].playerScores[0].score).toBe(-10);
  });

  test("D14: Bid 0, win 1 -> -10", () => {
    const result = updateScorePad([0], [1], 1, []);
    expect(result[0].playerScores[0].score).toBe(-10);
  });
});
