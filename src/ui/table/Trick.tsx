import React from "react";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { isSetTrick, isSetRound } from "../../game/WizardState";
import { PlayCard } from "../components/playcard/PlayCard";
import { getPlayerName } from "../../game/entities/players.utils";
import { getTrickWinner } from "../../game/entities/cards.utils";
import { PlayerID } from "../../game/entities/players";
import { checkTrickCard } from "../../game/entities/trick.utils";
import { TrickCard } from "../../game/entities/trick";
import { TrickCardBox } from "./TrickCardBox";

export const Trick: React.FC = () => {
  const {
    wizardState: { trick, round },
    gameMetadata,
  } = useGameState();

  if (!isSetTrick(trick) || !isSetRound(round)) return null;
  const { cards } = trick;
  let winningPlayerID: PlayerID;
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

  return (
    <Container>
      {cards.map(({ card, player }) => (
        <TrickCardBox
          player={getPlayerName(player, gameMetadata)}
          isWinning={player === winningPlayerID}
          key={player}
        >
          <PlayCard card={card} interactive={false} />
        </TrickCardBox>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;
