import range from "lodash/range";
import { generateCtx } from "../util/ctx.util";
import { generateDefaultWizardState, WizardState } from "../WizardState";
import { shuffle, handout } from "./setup";

describe("shuffle", () => {
  test("creates new deck", () => {
    const ctx = generateCtx();
    const g = generateDefaultWizardState(ctx);
    const originalDeck = g.round!.deck;
    shuffle(g);
    expect(g.round!.deck).not.toBe(originalDeck);
  });
});

describe("handout", () => {
  test("gives each player the specified number of hand cards", () => {
    const ctx = generateCtx();
    const g = generateDefaultWizardState(ctx);
    handout(g, ctx);
    g.round!.hands.forEach((hand) => {
      expect(hand).toBeInstanceOf(Array);
      expect(hand.length).toBe(g.numCards);
    });
  });

  test("sets trump", () => {
    const ctx = generateCtx();
    const g = generateDefaultWizardState(ctx);

    const expectedTrump = g.round!.deck[
      g.round!.deck.length - g.numCards * ctx.numPlayers - 1
    ];
    handout(g, ctx);
    expect(g.round!.trump.card).toBe(expectedTrump);
  });

  test("removes cards from deck when handing them out to players", () => {
    const ctx = generateCtx();
    const g = generateDefaultWizardState(ctx);
    const originalLength = g.round!.deck.length;
    handout(g, ctx);
    expect(g.round!.deck.length).toBe(
      originalLength - ctx.numPlayers * g.numCards - 1
    );
  });

  test("distributes cards one by one", () => {
    const ctx = generateCtx();
    const g: WizardState = generateDefaultWizardState(ctx);

    const cardsPlayer1 = range(0, g.numCards).map(
      (cardI) =>
        g.round!.deck[g.round!.deck.length - 1 - ctx.numPlayers * cardI]
    );

    handout(g, ctx);

    expect(g.round!.hands[1]).toEqual(cardsPlayer1);
  });

  test("distributes cards to players in correct order", () => {
    const ctx = generateCtx();
    const g: WizardState = generateDefaultWizardState(ctx);

    const playerOrder = [1, 2, 3, 0];
    const expectedFirstCardByPlayer = playerOrder.map(
      (_, index) => g.round!.deck[g.round!.deck.length - 1 - index]
    );

    handout(g, ctx);

    playerOrder.forEach((player, i) => {
      expect(g.round!.hands[player][0]).toBe(expectedFirstCardByPlayer[i]);
    });
  });

  test("dispatches endPhase event", () => {
    const ctx = generateCtx();
    const g = generateDefaultWizardState(ctx);
    const mockEndPhase = jest.fn();
    ctx.events!.endPhase = mockEndPhase;
    ctx.events!.setPhase = mockEndPhase;
    handout(g, ctx);

    expect(mockEndPhase).toBeCalled();
  });
});
