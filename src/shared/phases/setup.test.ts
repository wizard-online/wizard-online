import range from "lodash/range";
import { generateCtx } from "../../test/utils/ctx";
import { generateDefaultWizardState, WizardState } from "../WizardState";
import { shuffleMove, handoutMove } from "./setup";
import { Suit, Rank } from "../entities/cards";
import { Phase } from "./phase";
import { EventsAPI, RandomAPI } from "../boardgame.io.types";

const randomMock = jest.fn();
const shuffleMock = jest.fn();
shuffleMock.mockImplementation((arr) => [...arr].reverse());

const diceNoop = (() => 0) as RandomAPI["D4"];
const mockRandom: RandomAPI = {
  Die: randomMock,
  Shuffle: shuffleMock,
  D4: diceNoop,
  D6: diceNoop,
  D10: diceNoop,
  D12: diceNoop,
  D20: diceNoop,
  Number: () => 0,
};

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

describe("shuffle", () => {
  test("creates new deck", () => {
    const ctx = generateCtx();
    const g = generateDefaultWizardState({ ctx, random: mockRandom });
    const originalDeck = g.round!.deck;
    shuffleMove(g, mockRandom);
    expect(g.round!.deck).not.toBe(originalDeck);
  });
});

describe("handout", () => {
  test("gives each player the specified number of hand cards", () => {
    const ctx = generateCtx();
    const g = generateDefaultWizardState({ ctx, random: mockRandom });

    handoutMove(g, mockEvents());
    g.round!.hands.forEach((hand) => {
      expect(hand).toBeInstanceOf(Array);
      expect(hand.length).toBe(g.rounds[g.roundIndex]);
    });
  });

  test("sets trump card", () => {
    const ctx = generateCtx();
    const g = generateDefaultWizardState({ ctx, random: mockRandom });

    const expectedTrump = g.round!.deck[
      g.round!.deck.length - g.rounds[g.roundIndex] * ctx.numPlayers - 1
    ];
    handoutMove(g, mockEvents());
    expect(g.round!.trump.card).toBe(expectedTrump);
  });

  test("sets correct trumpSuit state for cards with regular rank", () => {
    const testData = [
      {
        suit: Suit.Blue,
        rank: Rank.One,
      },
      {
        suit: Suit.Green,
        rank: Rank.Four,
      },
      {
        suit: Suit.Red,
        rank: Rank.Ten,
      },
      {
        suit: Suit.Yellow,
        rank: Rank.Thirteen,
      },
    ];
    testData.forEach(({ suit, rank }) => {
      const ctx = generateCtx();
      const g = generateDefaultWizardState({ ctx, random: mockRandom });
      const trumpIndex =
        g.round!.deck.length - g.rounds[g.roundIndex] * ctx.numPlayers - 1;
      g.round!.deck[trumpIndex] = { suit, rank };
      handoutMove(g, mockEvents());
      expect(g.round!.trump.suit).toBe(suit);
    });
  });

  test("sets trumpSuit to undefined if trump card is a Z", () => {
    const ctx = generateCtx();
    const g = generateDefaultWizardState({ ctx, random: mockRandom });
    const trumpIndex =
      g.round!.deck.length - g.rounds[g.roundIndex] * ctx.numPlayers - 1;

    g.round!.deck[trumpIndex] = { suit: Suit.Blue, rank: Rank.Z };
    handoutMove(g, mockEvents());
    expect(g.round!.trump.suit).toBeUndefined();
  });

  test("calls selecting-trump phase when trump card is a Z", () => {
    const ctx = generateCtx();
    const g = generateDefaultWizardState({ ctx, random: mockRandom });
    const trumpIndex =
      g.round!.deck.length - g.rounds[g.roundIndex] * ctx.numPlayers - 1;

    g.round!.deck[trumpIndex] = { suit: Suit.Blue, rank: Rank.Z };
    const setPhase = jest.fn();
    handoutMove(g, mockEvents({ setPhase }));
    expect(setPhase).toHaveBeenCalledWith(Phase.SelectingTrump);
  });

  test("sets trumpSuit to null if turmp card is a N", () => {
    const ctx = generateCtx();
    const g = generateDefaultWizardState({ ctx, random: mockRandom });
    const trumpIndex =
      g.round!.deck.length - g.rounds[g.roundIndex] * ctx.numPlayers - 1;

    g.round!.deck[trumpIndex] = { suit: Suit.Yellow, rank: Rank.N };
    handoutMove(g, mockEvents());
    expect(g.round!.trump.suit).toBeNull();
  });

  test("sets trumpCard and trumpSuit to null in final round", () => {
    const ctx = generateCtx({ numPlayers: 4 });
    const g = generateDefaultWizardState(
      { ctx, random: mockRandom },
      {},
      { roundIndex: 14 }
    );
    handoutMove(g, mockEvents());
    expect(g.round!.trump.card).toBeUndefined();
    expect(g.round!.trump.suit).toBeNull();
  });

  test("removes cards from deck when handing them out to players", () => {
    const ctx = generateCtx();
    const g = generateDefaultWizardState({ ctx, random: mockRandom });
    const originalLength = g.round!.deck.length;
    handoutMove(g, mockEvents());
    expect(g.round!.deck.length).toBe(
      originalLength - ctx.numPlayers * g.rounds[g.roundIndex] - 1
    );
  });

  test("distributes cards one by one", () => {
    const ctx = generateCtx();
    const g: WizardState = generateDefaultWizardState({
      ctx,
      random: mockRandom,
    });

    const cardsPlayer1 = range(0, g.rounds[g.roundIndex]).map(
      (cardI) =>
        g.round!.deck[g.round!.deck.length - 1 - ctx.numPlayers * cardI]
    );

    handoutMove(g, mockEvents());

    expect(g.round!.hands[1]).toEqual(cardsPlayer1);
  });

  test("distributes cards to players in correct order", () => {
    const ctx = generateCtx();
    const g: WizardState = generateDefaultWizardState({
      ctx,
      random: mockRandom,
    });

    const playerOrder = [1, 2, 3, 0];
    const expectedFirstCardByPlayer = playerOrder.map(
      (_, index) => g.round!.deck[g.round!.deck.length - 1 - index]
    );

    handoutMove(g, mockEvents());

    playerOrder.forEach((player, i) => {
      expect(g.round!.hands[player][0]).toBe(expectedFirstCardByPlayer[i]);
    });
  });

  test("dispatches endPhase event", () => {
    const ctx = generateCtx();
    const g = generateDefaultWizardState({ ctx, random: mockRandom });
    const mockEndPhase = jest.fn();
    handoutMove(
      g,
      mockEvents({ endPhase: mockEndPhase, setPhase: mockEndPhase })
    );

    expect(mockEndPhase).toHaveBeenCalled();
  });
});
