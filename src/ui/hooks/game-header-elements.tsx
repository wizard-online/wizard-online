import React, { useMemo } from "react";
import { useGameState } from "../GameContext";
import { useHeaderElement } from "../header/HeaderElementsProvider";
import { maxCards } from "../../game/entities/players.utils";

export function useGameHeaderElements(): void {
  const {
    wizardState: { roundIndex, rounds, numPlayers, round },
  } = useGameState();

  // spacer
  useHeaderElement(
    "game-spacer",
    2,
    useMemo(() => <div />, [])
  );
  // players
  useHeaderElement("game-players", 3, `${numPlayers} Spieler`);

  // round
  useHeaderElement(
    "game-round",
    4,
    `Runde ${rounds[roundIndex]} / ${maxCards(numPlayers)}`
  );

  // bids mismatch
  const bidsMismatch = round?.bidsMismatch;
  useHeaderElement(
    "game-bids",
    5,
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
