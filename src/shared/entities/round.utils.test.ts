import { generateRounds } from "./round.utils";
import { NumPlayers } from "./players";

describe("generateRounds", () => {
  test.each([3, 4, 5, 6])(
    "tournament game with %i players has 10 rounds",
    (numPlayers) => {
      expect(generateRounds(numPlayers as NumPlayers, true)).toHaveLength(10);
    }
  );

  test.each([
    [3, 20],
    [4, 15],
    [5, 12],
    [6, 10],
  ])(
    "non-tournament game with $i players has %i rounds",
    (numPlayers, expectedNumRounds) => {
      expect(generateRounds(numPlayers as NumPlayers)).toHaveLength(
        expectedNumRounds
      );
    }
  );
});
