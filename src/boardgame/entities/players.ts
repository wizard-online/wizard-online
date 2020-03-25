import range from "lodash/range";

export function playersRound(startWith: number, numPlayers: number): number[] {
  return range(numPlayers).map((e) => (e + startWith) % numPlayers);
}
