import flatten from "lodash/flatten";

export enum CardSuit {
  Blue = "BLUE",
  Red = "RED",
  Yellow = "YELLOW",
  Green = "GREEN",
}
export const allSuits = [
  CardSuit.Blue,
  CardSuit.Red,
  CardSuit.Yellow,
  CardSuit.Green,
];

export enum CardRank {
  One = 1,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Eleven,
  Twelve,
  Thirteen,
  N = 0,
  Z = 26,
}
export const regularRanks = [
  CardRank.One,
  CardRank.Two,
  CardRank.Three,
  CardRank.Four,
  CardRank.Five,
  CardRank.Six,
  CardRank.Seven,
  CardRank.Eight,
  CardRank.Nine,
  CardRank.Ten,
  CardRank.Eleven,
  CardRank.Twelve,
  CardRank.Thirteen,
];
export const specialRanks = [CardRank.N, CardRank.Z];
export const allRanks = [...regularRanks, ...specialRanks];

export interface Card {
  suit: CardSuit;
  rank: CardRank;
}

export function isHigherThan(
  card: Card,
  other: Card,
  trumpSuit?: CardSuit | null,
  leadSuit?: CardSuit
): boolean {
  // N is lower than all cards (also previously played Ns)
  if (card.rank === CardRank.N) {
    return false;
  }
  // Z is higher than all cards but previously played Zs
  if (card.rank === CardRank.Z) {
    return other.rank !== CardRank.Z;
  }
  // card is lower if it's no Z but other is
  if (other.rank === CardRank.Z) return false;
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

export function getTrickWinner(
  cards: Card[],
  trumpSuit: CardSuit | null
): [number, Card] {
  if (cards.length < 2) {
    throw Error("too few cards");
  }
  const leadSuit = cards[0].suit;
  const winnerIndex = cards.slice(1).reduce((winningIndex, card, cardIndex) => {
    return isHigherThan(card, cards[winningIndex], trumpSuit, leadSuit)
      ? cardIndex
      : winningIndex;
  }, 0);
  return [winnerIndex, cards[winnerIndex]];
}

export function canPlayCard(
  card: Card,
  suitsInHand: CardSuit[],
  leadCard: Card | null
): boolean {
  // as lead, every card can be played
  if (!leadCard) {
    return true;
  }
  // Zs and Ns can always be played
  if (card.rank === CardRank.N || card.rank === CardRank.Z) {
    return true;
  }
  // Ns cannot be leading card
  if (leadCard.rank === CardRank.N) {
    throw Error("N card cannot be leading card");
  }
  // if Z is leading card, every card can be played
  if (leadCard.rank === CardRank.Z) {
    return true;
  }
  // if lead suit is not in hand, every card can be played
  if (!suitsInHand.includes(leadCard.suit)) {
    return true;
  }
  // otherwise card must be of lead suit
  return card.suit === leadCard.suit;
}

export function playableCardsInHand(
  hand: Card[],
  leadCard: Card | null
): boolean[] {
  const suitsInHand = allSuits.filter((suit) =>
    hand.find(
      (card) =>
        card.suit === suit &&
        card.rank !== CardRank.N &&
        card.rank !== CardRank.Z
    )
  );
  return hand.map((card) => canPlayCard(card, suitsInHand, leadCard));
}

export function generateCardDeck(): Card[] {
  const cards = flatten(
    allSuits.map((suit) => allRanks.map((rank) => ({ suit, rank })))
  );

  return cards;
}
