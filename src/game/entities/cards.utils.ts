import flatten from "lodash/flatten";
import groupBy from "lodash/groupBy";
import { PlayerID } from "./players";
import { Suit, SuitLabel, Rank, Card, allSuits, allRanks } from "./cards";

/**
 * checks if a card wins over another card given specified trump and lead suits
 *
 * @export
 * @param {Card} card card to check
 * @param {Card} other card to be compared with
 * @param {(Suit | null)} [trumpSuit=null] suit of the trump card
 * @param {(Suit | null)} [leadSuit=null] suit of the lead card
 * @returns {boolean}
 */
export function cardBeatsOther(
  card: Card,
  other: Card,
  trumpSuit: Suit | null = null,
  leadSuit: Suit | null = null
): boolean {
  // N is lower than all cards (also previously played Ns)
  if (card.rank === Rank.N) {
    return false;
  }
  // always lose against Z
  if (other.rank === Rank.Z) {
    return false;
  }
  // Z is higher than all cards but other Zs
  if (card.rank === Rank.Z) {
    return true;
  }
  // => neither card is Z or N

  // cards of same suit
  if (card.suit === other.suit) {
    return card.rank > other.rank;
  }
  // trump is higher than all non-trump cards
  if (card.suit === trumpSuit) {
    return true;
  }
  if (other.suit === trumpSuit) {
    return false;
  }
  // without trump, highest rank of lead suit wins
  // assume other card is lead card if no lead suit is specified
  const derivedLeadSuit = leadSuit || other.suit;
  // lead-suit card wins over non-lead-suit card
  if (card.suit === derivedLeadSuit) {
    return true;
  }
  if (other.suit === derivedLeadSuit) {
    return false;
  }
  // two differently suited cards which are not trump and lead suit have no winner
  return false;
}

/**
 * gets the winner of a trick
 *
 * @export
 * @param {[Card, PlayerID][]} cards
 * @param {(Suit | null)} trumpSuit
 * @returns {[Card, PlayerID]}
 */
export function getTrickWinner(
  cards: [Card, PlayerID][],
  trumpSuit: Suit | null
): [Card, PlayerID] {
  if (cards.length === 0) {
    throw new Error("expected non-empty array of cards");
  }
  const leadSuit = getLeadSuit(cards.map(([card]) => card));
  const winner = cards.reduce((winningCard, card, cardIndex) => {
    // skip first card
    if (cardIndex === 0) return winningCard;
    const beaten = cardBeatsOther(card[0], winningCard[0], trumpSuit, leadSuit);
    return beaten ? card : winningCard;
  }, cards[0]);
  return winner;
}

/**
 * gets the lead suit of a given trick
 *
 * @export
 * @param {Card[]} cards
 * @returns {(Suit | null | undefined)} suit of lead card or null if all cards a Ns or undefined if lead card is Z
 */
export function getLeadSuit(cards: Card[]): Suit | null | undefined {
  if (cards.length === 0) {
    return null;
  }
  const leadCard = cards[0];
  if (leadCard.rank === Rank.Z) {
    return undefined;
  }
  if (leadCard.rank === Rank.N) {
    return getLeadSuit(cards.slice(1));
  }
  return leadCard.suit;
}

/**
 * gets a list of all suits in a player's hand
 *
 * @export
 * @param {Card[]} hand the player's hand
 * @returns {Suit[]} set of suits in the player's hand
 */
export function getSuitsInHand(hand: Card[]): Suit[] {
  return allSuits.filter((suit) =>
    hand.find(
      (card) =>
        card.suit === suit && card.rank !== Rank.N && card.rank !== Rank.Z
    )
  );
}

/**
 * checks if a specified card can be played given the available suits in the player's hand and the trick's lead card
 *
 * @export
 * @param {Card} card card to be checked
 * @param {Suit[]} suitsInHand set of suits in the players hand
 * @param {(Card | null)} leadCard lead card or undefined if player is first in a trick
 * @returns {boolean}
 */
export function canPlayCard(
  card: Card,
  suitsInHand: Suit[],
  leadCard?: Card
): boolean {
  // as lead, every card can be played
  if (!leadCard) {
    return true;
  }
  // Zs and Ns can always be played
  if (card.rank === Rank.N || card.rank === Rank.Z) {
    return true;
  }
  // Ns cannot be leading card
  if (leadCard.rank === Rank.N) {
    throw new Error("N card cannot be leading card");
  }
  // if Z is leading card, every card can be played
  if (leadCard.rank === Rank.Z) {
    return true;
  }
  // if lead suit is not in hand, every card can be played
  if (!suitsInHand.includes(leadCard.suit)) {
    return true;
  }
  // otherwise card must be of lead suit
  return card.suit === leadCard.suit;
}

/**
 * returns a boolean list of which cards in a player's hand are playable given a lead card
 *
 * @export
 * @param {Card[]} hand
 * @param {Card} [leadCard]
 * @returns {boolean[]}
 */
export function playableCardsInHand(hand: Card[], leadCard?: Card): boolean[] {
  const suitsInHand = getSuitsInHand(hand);
  return hand.map((card) => canPlayCard(card, suitsInHand, leadCard));
}

/**
 * generates a new card deck instance
 *
 * @export
 * @param {Rank[]} [ranks=allRanks]
 * @returns {Card[]}
 */
export function generateCardDeck(ranks: Rank[] = allRanks): Card[] {
  const cards = flatten(
    allSuits.map((suit) => ranks.map((rank) => ({ suit, rank })))
  );

  return cards;
}

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

/**
 * gets the human-readable label for a given suit
 *
 * @export
 * @param {Suit} suit
 * @returns {SuitLabel}
 */
export function getSuitLabel(suit: Suit): SuitLabel {
  switch (suit) {
    case Suit.Blue:
      return SuitLabel.Blue;
    case Suit.Red:
      return SuitLabel.Red;
    case Suit.Yellow:
      return SuitLabel.Yellow;
    case Suit.Green:
      return SuitLabel.Green;
    default:
      throw new Error(`given argument is not a suit: ${suit}`);
  }
}

export function getRankLabel({ rank }: Card): string {
  switch (rank) {
    case Rank.Z:
      return "Z";
    case Rank.N:
      return "N";
    default:
      return rank.toString();
  }
}

export function getCardLabel(card: Card): string {
  const rankLabel = getRankLabel(card);
  switch (card.rank) {
    case Rank.Z:
    case Rank.N:
      return rankLabel;
    default: {
      const suitLabel = getSuitLabel(card.suit);
      return `${suitLabel} ${rankLabel}`;
    }
  }
}
