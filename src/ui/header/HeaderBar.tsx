import React from "react";

import { useGameState } from "../GameContext";
import { maxCards } from "../../game/entities/players.utils";
import { useHeaderElement } from "./HeaderElementsProvider";

export const HeaderBar: React.FC = () => {
  const {
    wizardState: { numCards, numPlayers, round },
  } = useGameState();
  useHeaderElement("game-players", `${numPlayers} Spieler`);
  useHeaderElement("game-round", `Runde ${numCards} / ${maxCards(numPlayers)}`);
  useHeaderElement(
    "game-bids",
    round?.bidsMismatch !== undefined
      ? `${round.bidsMismatch > 0 ? "+" : ""}
      ${round.bidsMismatch} Stiche Abweichung 
      ${round.bidsMismatch > 0 ? "(offensiv)" : ""}
      ${round.bidsMismatch < 0 ? "(defensiv)" : ""}
      ${round.bidsMismatch === 0 ? "(ausgeglichen)" : ""}`
      : ""
  );

  return null;
};
