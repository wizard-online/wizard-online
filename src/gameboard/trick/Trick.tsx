import React, { useContext } from "react";
import { Box, Badge } from "@material-ui/core";
import styled from "styled-components";
import { GameContext } from "../GameContext";
import { isSetTrick } from "../../boardgame/G";
import { PlayCard } from "../components/PlayCard";

export const Trick: React.FC = () => {
  const { gamestate } = useContext(GameContext);
  if (!gamestate) return null;

  const { trick } = gamestate.G;
  if (!isSetTrick(trick)) return <Container />;
  const { cards } = trick;

  return (
    <Container>
      {cards.map(([card, playerID]) => (
        <PlayingCardContainer key={`${card.suit}-${card.rank}`}>
          <Badge badgeContent={playerID} color="primary">
            <PlayCard card={card} interactive={false} />
          </Badge>
        </PlayingCardContainer>
      ))}
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: lightgreen;
  border-radius: 15px;
  width: 100%;
  height: 150px;
  margin: 25px;
  padding: 25px;
`;

const PlayingCardContainer = styled(Box)`
  margin: 5px;
`;
