import range from "lodash/range";
import { NumPlayers } from "./players";
import { maxCards } from "./players.utils";

export function generateRounds(numPlayers: NumPlayers): number[] {
  return range(1, maxCards(numPlayers) + 1);
}
