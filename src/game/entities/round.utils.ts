import range from "lodash/range";
import { NumPlayers } from "./players";
import { maxCards } from "./players.utils";

export function generateRounds(
  numPlayers: NumPlayers,
  tournamentMode = false
): number[] {
  const fullRounds = range(1, maxCards(numPlayers) + 1);
  if (!tournamentMode) {
    return fullRounds;
  }
  switch (numPlayers) {
    case 3:
      return [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

    case 4:
      return [1, 3, 5, 7, 9, 11, 12, 13, 14, 15];

    case 5:
      return [2, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    case 6:
    default:
      return fullRounds;
  }
}
