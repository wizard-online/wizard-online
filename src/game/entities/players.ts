export type PlayerID = 0 | 1 | 2 | 3 | 4 | 5;
export type NumPlayers = 3 | 4 | 5 | 6;
export type MaxCards = 10 | 12 | 15 | 20;

export const DECKSIZE = 60;
export function PlayerID(playerID: string): PlayerID {
  return Number.parseInt(playerID, 10) as PlayerID;
}
