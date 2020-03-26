import range from "lodash/range";
import { generateCtx } from "../ctx.util";
import { defaultG } from "../G";
import { setup } from "./setup";

describe("shuffle", () => {
  test("creates new deck", () => {
    const ctx = generateCtx();
    const g = defaultG(ctx);
    const originalDeck = g.deck;
    setup.moves!.shuffle(g, ctx);
    expect(g.deck).not.toBe(originalDeck);
  });
});

describe("handout", () => {
  test("gives each player the specified number of hand cards", () => {
    const ctx = generateCtx();
    const g = defaultG(ctx);
    setup.moves!.handout(g, ctx);
    g.hands.forEach((hand) => {
      expect(hand).toBeInstanceOf(Array);
      expect(hand.length).toBe(g.numCardsOnHand);
    });
  });

  test("sets trump", () => {
    const ctx = generateCtx();
    const g = defaultG(ctx);

    const expectedTrump =
      g.deck[g.deck.length - g.numCardsOnHand * ctx.numPlayers - 1];
    setup.moves!.handout(g, ctx);
    expect(g.trump).toBe(expectedTrump);
  });

  test("removes cards from deck when handing them out to players", () => {
    const ctx = generateCtx();
    const g = defaultG(ctx);
    const originalLength = g.deck.length;
    setup.moves!.handout(g, ctx);
    expect(g.deck.length).toBe(
      originalLength - ctx.numPlayers * g.numCardsOnHand - 1
    );
  });

  test("distributes cards one by one", () => {
    const ctx = generateCtx();
    const g = {
      numCardsOnHand: 3,
      score: Array(ctx.numPlayers).fill(null),
      hands: Array(ctx.numPlayers).fill(null),
      deck: range(0, 60),
    };

    const cardsPlayer1 = range(0, g.numCardsOnHand).map(
      (cardI) => g.deck[g.deck.length - 1 - ctx.numPlayers * cardI]
    );

    setup.moves!.handout(g, ctx);

    expect(g.hands[1]).toEqual(cardsPlayer1);
  });

  test("distributes cards to players in correct order", () => {
    const ctx = generateCtx();
    const g = {
      numCardsOnHand: 3,
      score: Array(ctx.numPlayers).fill(null),
      hands: Array(ctx.numPlayers).fill(null),
      deck: range(0, 60),
    };

    const playerOrder = [1, 2, 3, 0];
    const expectedFirstCardByPlayer = playerOrder.map(
      (_, index) => g.deck[g.deck.length - 1 - index]
    );

    setup.moves!.handout(g, ctx);

    playerOrder.forEach((player, i) => {
      expect(g.hands[player][0]).toBe(expectedFirstCardByPlayer[i]);
    });
  });

  test("dispatches endPhase event", () => {
    const ctx = generateCtx();
    const g = defaultG(ctx);
    const mockEndPhase = jest.fn();
    ctx.events!.endPhase = mockEndPhase;

    setup.moves!.handout(g, ctx);

    expect(mockEndPhase).toBeCalled();
  });
});
