import flatten from "lodash/flatten";
import groupBy from "lodash/groupBy";
import { Card, Rank, Suit, equalCards } from "../../game/entities/cards";

/**
 * sorts the cards in a hand by the following scheme:
 * Ns come always to the left, Zs come always to the right
 * trump cards come next to the Zs
 * non-trump cards are sorted by the amount of cards of one suit
 * cards of the same suit are sorted by their rank
 *
 * @export
 * @param {Card[]} hand list of cards to be sorted
 * @param {(Suit | null)} [trumpSuit]
 * @returns {Card[]} the sorted cards
 */
export function sortHand(hand: Card[], trumpSuit?: Suit | null): Card[] {
  // group cards by suit / N / Z
  const groupedHand = groupBy(hand, (card) => {
    if (card.rank === Rank.Z || card.rank === Rank.N) return card.rank;
    return card.suit;
  });

  const sortedGroups = Object.entries(groupedHand)
    // sort groups in this order: [Ns, ... non-trump suits sorted by num card, trump suit, Zs]
    .sort(([keyA, cardsA], [keyB, cardsB]) => {
      // always sort N left and Z right
      if (keyA === Rank.N.toString() || keyB === Rank.Z.toString()) return -1;
      if (keyA === Rank.Z.toString() || keyB === Rank.N.toString()) return 1;
      // always sort trump beside Z
      if (keyA === trumpSuit) return 1;
      if (keyB === trumpSuit) return -1;
      // sort by number of cards of color
      return cardsA.length - cardsB.length;
    })
    // sort cards in each group by rank
    .map(([, cardGroup]) => cardGroup.sort((a, b) => a.rank - b.rank));
  // set sorted hand to state
  return flatten(sortedGroups);
}

export function isSorted(hand: Card[], trumpSuit?: Suit | null): boolean {
  console.log(hand);
  const sorted = sortHand(hand, trumpSuit);

  return hand.every((card, i) => {
    console.log(
      "cards",
      `hand: ${hand[i].rank},${hand[i].suit}, Sorted: ${sorted[i].rank},${sorted[i].suit}`
    );
    return equalCards(card, sorted[i]);
  });
}
