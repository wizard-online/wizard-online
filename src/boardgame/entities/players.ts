import range from "lodash/range";

const deckSize = 60;
export type PlayerID = 0 | 1 | 2 | 3 | 4 | 5;
export function PlayerID(playerID: string): PlayerID { return parseInt(playerID,10) as PlayerID}
export type NumPlayers = 3 | 4 | 5 | 6;
export type MaxCards = 10 | 12 | 15 | 20;

export function maxCards(numPlayers: NumPlayers): MaxCards {
  return (deckSize / numPlayers) as MaxCards;
}

export function playersRound(
  startWith: number,
  numPlayers: NumPlayers
): PlayerID[] {
  return range(numPlayers).map(
    (e) => (e + startWith) % numPlayers
  ) as PlayerID[];
}
