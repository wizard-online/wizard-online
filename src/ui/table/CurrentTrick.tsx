import React from "react";
import { useGameState } from "../GameContext";
import { isSetTrick, isSetRound } from "../../game/WizardState";
import { getTrickWinner } from "../../game/entities/cards.utils";
import { PlayerID } from "../../game/entities/players";
import { checkTrickCard } from "../../game/entities/trick.utils";
import { TrickCard } from "../../game/entities/trick";
import { Trick } from "./Trick";

export const CurrentTrick: React.FC = () => {
  const {
    wizardState: { trick, round },
  } = useGameState();

  if (!isSetTrick(trick) || !isSetRound(round))
    return <span>Round or trick is null</span>;
  const { cards } = trick;
  let winningPlayerID: PlayerID | undefined;
  const playedCardsInTrick = cards.filter((optTrickCard) =>
    checkTrickCard(optTrickCard)
  ) as TrickCard[];
  if (playedCardsInTrick.length > 0) {
    const { player } = getTrickWinner(
      playedCardsInTrick,
      round?.trump.suit || null
    );
    winningPlayerID = player;
  }

  return <Trick cards={cards} winningPlayerID={winningPlayerID} />;
};
