import React, { useContext } from "react";
import { Box, Badge } from "@material-ui/core";
import styled from "styled-components";
import { GameContext } from "../GameContext";
import { isSetTrick } from "../../boardgame/WizardState";
import { PlayCard } from "../components/PlayCard";

export const Trick: React.FC = () => {
  const { gamestate } = useContext(GameContext);
  if (!gamestate) return null;

  const { trick } = gamestate.G;
  if (!isSetTrick(trick)) return null;
  const { cards } = trick;

  return (
    <>
      {cards.map(([card, playerID]) => (
        <PlayingCardContainer key={`${card.suit}-${card.rank}`}>
          <Badge badgeContent={playerID} color="primary">
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
