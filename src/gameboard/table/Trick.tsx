import React from "react";
import { Box, Badge } from "@material-ui/core";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { isSetTrick } from "../../boardgame/WizardState";
import { PlayCard } from "../components/PlayCard";

export const Trick: React.FC = () => {
  const {
    wizardState: { trick },
  } = useGameState();

  if (!isSetTrick(trick)) return null;
  const { cards } = trick;

  return (
    <>
      {cards.map(([card, playerID]) => (
        <PlayingCardContainer key={`${card.suit}-${card.rank}`}>
          <Badge badgeContent={playerID.toString()} color="primary">
            <PlayCard card={card} interactive={false} />
          </Badge>
        </PlayingCardContainer>
      ))}
    </>
  );
};

const PlayingCardContainer = styled(Box)`
  margin: 5px;
`;
