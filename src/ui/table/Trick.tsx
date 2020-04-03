import React from "react";
import { Badge, Tooltip } from "@material-ui/core";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { isSetTrick } from "../../game/WizardState";
import { PlayCard } from "../components/PlayCard";
import { getPlayerName } from "../../game/entities/players.utils";

export const Trick: React.FC = () => {
  const {
    wizardState: { trick },
    gameMetadata,
  } = useGameState();

  if (!isSetTrick(trick)) return null;
  const { cards } = trick;

  return (
    <>
      {cards.map(([card, playerID]) => (
        <PlayingCardContainer key={`${card.suit}-${card.rank}`}>
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

const PlayingCardContainer = styled.div`
  margin: 5px 10px;
`;
