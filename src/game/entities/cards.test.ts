import {
  generateCardDeck,
  Suit,
  Rank,
  allSuits,
  cardBeatsOther,
  Card,
  getTrickWinner,
  canPlayCard,
  playableCardsInHand,
} from "./cards";
import { PlayerID } from "./players";

describe("generateCardDeck", () => {
  test("contains 60 cards", () => {
    const deck = generateCardDeck();
    expect(deck.length).toBe(60);
  });

  test("has no duplicates", () => {
    const deck = generateCardDeck();
    const deckSet = new Set(deck.map((card) => JSON.stringify(card)));
    expect(deckSet.size).toBe(60);
  });
});

describe("cardBeatsOther", () => {
  // for performance reasons, use minimum deck
  const allCards = generateCardDeck([1, 13, Rank.N, Rank.Z]);
  const zCards = allCards.filter((card) => card.rank === Rank.Z);
  const nCards = allCards.filter((card) => card.rank === Rank.N);
  const nonZCards = allCards.filter((card) => card.rank !== Rank.Z);
  const regularCards = allCards.filter(
    (card) => card.rank !== Rank.N && card.rank !== Rank.Z
  );
  const expectCardsToMatchAllCards = (
    cards: Card[],
    expected: boolean,
    {
      comparingCards = allCards,
      trumpSuits = [...allSuits, null],
      leadSuits = [...allSuits, null],
    }: {
      comparingCards?: Card[];
      trumpSuits?: (Suit | null)[];
      leadSuits?: (Suit | null)[];
    } = {}
  ): void => {
    comparingCards.forEach((otherCard) =>
      trumpSuits.forEach((trumpSuit) =>
        leadSuits.forEach((leadSuit) =>
          cards.forEach((card) =>
            expect(cardBeatsOther(card, otherCard, trumpSuit, leadSuit)).toBe(
              expected
            )
          )
        )
      )
    );
  };
  test("N never wins", () => {
    nCards.forEach((n) => expectCardsToMatchAllCards([n], false));
  });

  test("Z wins against all non-Zs", () => {
    expectCardsToMatchAllCards(zCards, true, { comparingCards: nonZCards });
  });

  test("all cards lose against Zs", () => {
    expectCardsToMatchAllCards(allCards, false, { comparingCards: zCards });
  });

  test("highest rank wins for regular cards of same suit", () => {
    allSuits.forEach((suit) => {
      const suitCards = regularCards.filter((card) => card.suit === suit);
      suitCards.forEach((card) =>
        suitCards.forEach((otherCard) =>
          expect(cardBeatsOther(card, otherCard)).toBe(
            card.rank > otherCard.rank
          )
        )
      );
    });
  });

  test("trump wins agains all regular non-trump cards", () => {
    allSuits.forEach((suit) => {
      const trumpCards = regularCards.filter((card) => card.suit === suit);
      const nonTrumpCards = regularCards.filter((card) => card.suit !== suit);

      expectCardsToMatchAllCards(trumpCards, true, {
        comparingCards: nonTrumpCards,
        trumpSuits: [suit],
      });
    });
  });

  test("highest lead suit rank wins for regular non-trump cards", () => {
    allSuits.forEach((leadSuit) => {
      const leadSuitCards = regularCards.filter(
        (card) => card.suit === leadSuit
      );
      leadSuitCards.forEach((leadSuitCard) =>
        regularCards.forEach((otherCard) =>
          expect(cardBeatsOther(leadSuitCard, otherCard, null, leadSuit)).toBe(
            otherCard.suit !== leadSuit || leadSuitCard.rank > otherCard.rank
          )
        )
      );
    });
  });

  test("switching arguments gives contraire results except for regular non-trump non-leading non-same suits card", () => {
    const trumpSuits = [...allSuits, null];
    trumpSuits.forEach((trumpSuit) =>
      allSuits.forEach((leadSuit) => {
        regularCards.forEach((card) =>
          regularCards
            .filter(
              (otherCard) =>
                JSON.stringify(card) !== JSON.stringify(otherCard) &&
                (otherCard.suit === trumpSuit || otherCard.suit === leadSuit)
            )
            .forEach((otherCard) => {
              expect(
                cardBeatsOther(card, otherCard, trumpSuit, leadSuit)
              ).not.toBe(cardBeatsOther(otherCard, card, trumpSuit, leadSuit));
            })
        );
      })
    );
  });

  test("switchign arguments gives always false for regular non-trump non-lead-suit non-same-suit cards", () => {
    const trumpSuits = [...allSuits, null];
    trumpSuits.forEach((trumpSuit) =>
      allSuits.forEach((leadSuit) => {
        const nonTrumpNonLeadCards = regularCards.filter(
          (card) => card.suit !== trumpSuit && card.suit !== leadSuit
        );

        nonTrumpNonLeadCards.forEach((card) =>
          nonTrumpNonLeadCards
            .filter((otherCard) => otherCard.suit !== card.suit)
            .forEach((otherCard) => {
              expect(cardBeatsOther(card, otherCard, trumpSuit, leadSuit)).toBe(
                false
              );
              expect(cardBeatsOther(otherCard, card, trumpSuit, leadSuit)).toBe(
                false
              );
            })
        );
      })
    );
  });

  test("without trump, n, z, the highest lead-suit card wins", () => {
    allSuits.forEach((leadSuit) =>
      regularCards
        .filter((card) => card.suit === leadSuit)
        .forEach((leadSuitCard) =>
          regularCards.forEach((otherCard) => {
            if (
              leadSuitCard.suit === otherCard.suit &&
              leadSuitCard.rank === otherCard.rank
            )
              return;
            expect(
              cardBeatsOther(leadSuitCard, otherCard, null, leadSuit)
            ).toBe(
              otherCard.suit !== leadSuit || leadSuitCard.rank > otherCard.rank
            );
          })
        )
    );
  });
});

describe("getTrickWinner", () => {
  interface TestData {
    cards: [Card, PlayerID][];
    trumpSuit: Suit;
    winnerIndex: number;
  }
  test("first Z wins", () => {
    const testData: TestData[] = [
      {
        cards: [
          [Card(Suit.Blue, Rank.Z), 1],
          [Card(Suit.Red, 13), 2],
          [Card(Suit.Yellow, 8), 0],
        ],
        trumpSuit: Suit.Yellow,
        winnerIndex: 0,
      },
      {
        cards: [
          [Card(Suit.Red, 13), 0],
          [Card(Suit.Yellow, 8), 1],
          [Card(Suit.Blue, Rank.Z), 2],
        ],
        trumpSuit: Suit.Yellow,
        winnerIndex: 2,
      },
      {
        cards: [
          [Card(Suit.Red, 13), 2],
          [Card(Suit.Yellow, Rank.Z), 0],
          [Card(Suit.Blue, Rank.Z), 1],
        ],
        trumpSuit: Suit.Red,
        winnerIndex: 1,
      },
      {
        cards: [
          [Card(Suit.Red, Rank.Z), 1],
          [Card(Suit.Yellow, Rank.Z), 2],
          [Card(Suit.Blue, Rank.Z), 0],
        ],
        trumpSuit: Suit.Green,
        winnerIndex: 0,
      },
    ];

    testData.forEach(({ cards, trumpSuit, winnerIndex }) =>
      expect(getTrickWinner(cards, trumpSuit)).toEqual(cards[winnerIndex])
    );
  });

  test("highest leading rank wins without trump and z", () => {
    const data: TestData[] = [
      {
        cards: [
          [Card(Suit.Red, 7), 0],
          [Card(Suit.Yellow, 13), 1],
          [Card(Suit.Red, 9), 2],
        ],
        trumpSuit: Suit.Green,
        winnerIndex: 2,
      },
      {
        cards: [
          [Card(Suit.Blue, 3), 1],
          [Card(Suit.Blue, 2), 2],
          [Card(Suit.Red, 9), 0],
        ],
        trumpSuit: Suit.Green,
        winnerIndex: 0,
      },
    ];

    data.forEach(({ cards, trumpSuit, winnerIndex }) =>
      expect(getTrickWinner(cards, trumpSuit)).toEqual(cards[winnerIndex])
    );
  });

  test("highest trump wins without z", () => {
    const data: TestData[] = [
      {
        cards: [
          [Card(Suit.Red, 7), 2],
          [Card(Suit.Green, 1), 0],
          [Card(Suit.Red, 9), 1],
        ],
        trumpSuit: Suit.Green,
        winnerIndex: 1,
      },
      {
        cards: [
          [Card(Suit.Blue, 3), 0],
          [Card(Suit.Blue, 2), 1],
          [Card(Suit.Red, 9), 2],
        ],
        trumpSuit: Suit.Blue,
        winnerIndex: 0,
      },
      {
        cards: [
          [Card(Suit.Green, 10), 1],
          [Card(Suit.Blue, Rank.N), 2],
          [Card(Suit.Blue, 9), 0],
        ],
        trumpSuit: Suit.Blue,
        winnerIndex: 2,
      },
    ];

    data.forEach(({ cards, trumpSuit, winnerIndex }) =>
      expect(getTrickWinner(cards, trumpSuit)).toEqual(cards[winnerIndex])
    );
  });

  describe("on first card N", () => {
    test("first N wins if only Ns", () => {
      const { cards, trumpSuit, winnerIndex }: TestData = {
        cards: [
          [Card(Suit.Red, Rank.N), 2],
          [Card(Suit.Yellow, Rank.N), 0],
          [Card(Suit.Blue, Rank.N), 1],
        ],
        trumpSuit: Suit.Green,
        winnerIndex: 0,
      };
      expect(getTrickWinner(cards, trumpSuit)).toEqual(cards[winnerIndex]);
    });

    test("highest trump wins without z", () => {
      const data: TestData[] = [
        {
          cards: [
            [Card(Suit.Red, Rank.N), 3],
            [Card(Suit.Green, 1), 0],
            [Card(Suit.Red, 13), 1],
            [Card(Suit.Green, 9), 2],
          ],
          trumpSuit: Suit.Green,
          winnerIndex: 3,
        },
        {
          cards: [
            [Card(Suit.Blue, Rank.N), 0],
            [Card(Suit.Blue, 2), 1],
            [Card(Suit.Red, 9), 2],
            [Card(Suit.Blue, 1), 3],
          ],
          trumpSuit: Suit.Blue,
          winnerIndex: 1,
        },
      ];

      data.forEach(({ cards, trumpSuit, winnerIndex }) =>
        expect(getTrickWinner(cards, trumpSuit)).toEqual(cards[winnerIndex])
      );
    });

    test("highest leading rank wins without trump and z", () => {
      const data: TestData[] = [
        {
          cards: [
            [Card(Suit.Red, Rank.N), 0],
            [Card(Suit.Yellow, 13), 1],
            [Card(Suit.Red, 9), 2],
          ],
          trumpSuit: Suit.Green,
          winnerIndex: 1,
        },
        {
          cards: [
            [Card(Suit.Blue, Rank.N), 2],
            [Card(Suit.Blue, 2), 3],
            [Card(Suit.Red, 9), 0],
            [Card(Suit.Blue, 5), 1],
          ],
          trumpSuit: Suit.Green,
          winnerIndex: 3,
        },
      ];

      data.forEach(({ cards, trumpSuit, winnerIndex }) =>
        expect(getTrickWinner(cards, trumpSuit)).toEqual(cards[winnerIndex])
      );
    });
  });
});

describe("canPlayCard", () => {
  test("always can play Z", () => {
    expect(
      canPlayCard(Card(Suit.Blue, Rank.Z), allSuits, Card(Suit.Red, 8))
    ).toBe(true);
    expect(canPlayCard(Card(Suit.Yellow, Rank.Z), [], Card(Suit.Blue, 8))).toBe(
      true
    );
    expect(
      canPlayCard(Card(Suit.Red, Rank.Z), [Suit.Red], Card(Suit.Red, 8))
    ).toBe(true);
  });

  test("always can play N", () => {
    expect(
      canPlayCard(Card(Suit.Blue, Rank.N), allSuits, Card(Suit.Red, 8))
    ).toBe(true);
    expect(canPlayCard(Card(Suit.Yellow, Rank.N), [], Card(Suit.Blue, 8))).toBe(
      true
    );
    expect(
      canPlayCard(Card(Suit.Red, Rank.N), [Suit.Red], Card(Suit.Red, 8))
    ).toBe(true);
  });

  test("can play card of lead suit", () => {
    expect(canPlayCard(Card(Suit.Red, 3), allSuits, Card(Suit.Red, 8))).toBe(
      true
    );
  });

  test("can play card of non-lead-suit if lead suit is blank", () => {
    expect(
      canPlayCard(
        Card(Suit.Green, 4),
        [Suit.Green, Suit.Yellow, Suit.Red],
        Card(Suit.Blue, 8)
      )
    ).toBe(true);
  });

  test("cannot play card of non-lead-suit if lead suit is not blank", () => {
    expect(
      canPlayCard(
        Card(Suit.Green, 4),
        [Suit.Blue, Suit.Green],
        Card(Suit.Blue, 8)
      )
    ).toBe(false);
  });

  test("can play any card if lead is Z", () => {
    expect(
      canPlayCard(Card(Suit.Green, 4), allSuits, Card(Suit.Blue, Rank.Z))
    ).toBe(true);
    expect(
      canPlayCard(Card(Suit.Red, 13), allSuits, Card(Suit.Yellow, Rank.Z))
    ).toBe(true);
  });
});

describe("playableCardsInHand", () => {
  test("all playable if lead is Z", () => {
    const hand = [
      Card(Suit.Yellow, 7),
      Card(Suit.Red, 13),
      Card(Suit.Green, 2),
      Card(Suit.Blue, Rank.N),
      Card(Suit.Yellow, Rank.Z),
    ];
    const leadCard = Card(Suit.Yellow, Rank.Z);

    expect(playableCardsInHand(hand, leadCard)).toEqual(
      new Array(5).fill(true)
    );
  });

  test("error when N given as lead", () => {
    const hand = [
      Card(Suit.Yellow, 7),
      Card(Suit.Red, 13),
      Card(Suit.Green, 2),
      Card(Suit.Blue, Rank.N),
      Card(Suit.Yellow, Rank.Z),
    ];
    const leadCard = Card(Suit.Yellow, Rank.N);
    expect(() => playableCardsInHand(hand, leadCard)).toThrowError();
  });

  test("all playable if lead suit is blank", () => {
    const hand = [
      Card(Suit.Blue, 7),
      Card(Suit.Red, 13),
      Card(Suit.Green, 2),
      Card(Suit.Blue, Rank.N),
      Card(Suit.Yellow, Rank.Z),
    ];
    const leadCard = Card(Suit.Yellow, 11);

    expect(playableCardsInHand(hand, leadCard)).toEqual(
      new Array(5).fill(true)
    );
  });

  test("only lead, z, n playable if lead is not blank", () => {
    const hand = [
      Card(Suit.Blue, 7),
      Card(Suit.Red, 13),
      Card(Suit.Yellow, 2),
      Card(Suit.Blue, Rank.N),
      Card(Suit.Blue, Rank.Z),
    ];
    const leadCard = Card(Suit.Yellow, 11);

    expect(playableCardsInHand(hand, leadCard)).toEqual([
      false,
      false,
      true,
      true,
      true,
    ]);
  });
});
