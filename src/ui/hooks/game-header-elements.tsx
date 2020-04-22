import React, { useMemo } from "react";
import { useGameState } from "../GameContext";
import { useHeaderElement } from "../header/HeaderElementsProvider";
import { maxCards } from "../../game/entities/players.utils";

export function useGameHeaderElements(): void {
  const {
    wizardState: { numCards, numPlayers, round },
  } = useGameState();

  // players
  useHeaderElement("game-players", 2, `${numPlayers} Spieler`);

  // round
  useHeaderElement(
    "game-round",
    3,
    `Runde ${numCards} / ${maxCards(numPlayers)}`
  );

  // bids mismatch
  const bidsMismatch = round?.bidsMismatch;
  useHeaderElement(
    "game-bids",
    4,
    useMemo(
      () =>
        bidsMismatch !== undefined ? (
          <>
            {bidsMismatch > 0 && "+"}
            {bidsMismatch} Stiche Abweichung {bidsMismatch > 0 && "(offensiv)"}
            {bidsMismatch < 0 && "(defensiv)"}
            {bidsMismatch === 0 && "(ausgeglichen)"}
          </>
        ) : (
          ""
        ),
      [bidsMismatch]
    )
  );
}
