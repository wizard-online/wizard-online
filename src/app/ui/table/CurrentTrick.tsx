import React from "react";
import { useGameState } from "../GameContext";
import { isSetTrick, isSetRound } from "../../../shared/WizardState";
import { getTrickWinner } from "../../../shared/entities/cards.utils";
import { PlayerID } from "../../../shared/entities/players";
import { checkTrickCard } from "../../../shared/entities/trick.utils";
import { TrickCard } from "../../../shared/entities/trick";
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
