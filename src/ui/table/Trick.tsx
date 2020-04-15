import React from "react";
import { Badge, Tooltip } from "@material-ui/core";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { isSetTrick, isSetRound } from "../../game/WizardState";
import { PlayCard } from "../components/playcard/PlayCard";
import { getPlayerName } from "../../game/entities/players.utils";
import { getTrickWinner } from "../../game/entities/cards.utils";
import { colors } from "../util/colors";
import { PlayerID } from "../../game/entities/players";
import { checkTrickCard } from "../../game/entities/trick.utils";
import { TrickCard } from "../../game/entities/trick";

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
        <PlayingCardContainer
          isWinning={player === winningPlayerID}
          key={player}
        >
          <Tooltip
            title={getPlayerName(player, gameMetadata)}
            placement="bottom"
          >
            <Badge
              badgeContent={getPlayerName(player, gameMetadata, 7)}
              color="primary"
            >
              <PlayCard card={card} interactive={false} />
            </Badge>
          </Tooltip>
        </PlayingCardContainer>
      ))}
    </Container>
  );
};

const PlayingCardContainer = styled.div<{ isWinning: boolean }>`
  margin: 10px;
  border-radius: 7px;
  border: 2px solid
    ${({ isWinning }) => (isWinning ? colors.wizard.green : "transparent")};
`;

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;
