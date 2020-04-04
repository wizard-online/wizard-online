import React from "react";
import { Badge, Tooltip } from "@material-ui/core";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { isSetTrick, isSetRound } from "../../game/WizardState";
import { PlayCard } from "../components/PlayCard";
import { getPlayerName } from "../../game/entities/players.utils";
import { getTrickWinner } from "../../game/entities/cards.utils";
import { colors } from "../util/colors";
import { PlayerID } from "../../game/entities/players";

export const Trick: React.FC = () => {
  const {
    wizardState: { trick, round },
    gameMetadata,
  } = useGameState();

  if (!isSetTrick(trick) || !isSetRound(round)) return null;
  const { cards } = trick;

  let winningPlayerID: PlayerID;
  if (cards.length > 0) {
    const [, trickWinner] = getTrickWinner(cards, round?.trump.suit || null);
    winningPlayerID = trickWinner;
  }

  return (
    <>
      {cards.map(([card, playerID]) => (
        <PlayingCardContainer
          isWinning={playerID === winningPlayerID}
          key={`${card.suit}-${card.rank}`}
        >
          <Tooltip
            title={getPlayerName(playerID, gameMetadata)}
            placement="bottom"
          >
            <Badge
              badgeContent={getPlayerName(playerID, gameMetadata, 7)}
              color="primary"
            >
              <PlayCard card={card} interactive={false} />
            </Badge>
          </Tooltip>
        </PlayingCardContainer>
      ))}
    </>
  );
};

const PlayingCardContainer = styled.div<{ isWinning: boolean }>`
  margin: 10px;
  border-radius: 7px;
  border: 2px solid
    ${({ isWinning }) => (isWinning ? colors.wizard.green : "transparent")};
`;
