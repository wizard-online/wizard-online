export enum Suit {
  Blue = "BLUE",
  Red = "RED",
  Yellow = "YELLOW",
  Green = "GREEN",
}

export const allSuits = [Suit.Blue, Suit.Red, Suit.Yellow, Suit.Green];

export enum SuitLabel {
  Blue = "Blau",
  Red = "Rot",
  Yellow = "Gelb",
  Green = "Grün",
}

export enum Rank {
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
  Rank.One,
  Rank.Two,
  Rank.Three,
  Rank.Four,
  Rank.Five,
  Rank.Six,
  Rank.Seven,
  Rank.Eight,
  Rank.Nine,
  Rank.Ten,
  Rank.Eleven,
  Rank.Twelve,
  Rank.Thirteen,
];
export const specialRanks = [Rank.N, Rank.Z];
export const allRanks = [...regularRanks, ...specialRanks];

export interface Card {
  suit: Suit;
  rank: Rank;
}

/**
 * quick factory to create card objects
 *
 * @export
 * @param {Suit} suit
 * @param {Rank} rank
 * @returns {Card}
 */
export function Card(suit: Suit, rank: Rank): Card {
  return { suit, rank };
}

export function equalCards(cardA: Card, cardB: Card): boolean {
  // TODO: Should we see all Ns and all Zs as equal?
  return cardA.suit === cardB.suit && cardA.rank === cardB.rank;
}
