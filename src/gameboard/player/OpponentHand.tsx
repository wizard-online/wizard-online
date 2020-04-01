import React from "react";
import range from "lodash/range";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import { PlayCard } from "../components/PlayCard";

export interface OpponentHandProps {
  numCards: number;
}

export const OpponentHand: React.FC<OpponentHandProps> = ({ numCards }) => {
  const cards = range(0, numCards);
  return (
    <CardsContainer>
      {cards.map((card) => (
        <PlayingCardContainer key={card}>
          <PlayCard card={null} interactive={false} />
        </PlayingCardContainer>
      ))}
    </CardsContainer>
  );
};

const CardsContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 90px;
`;

const PlayingCardContainer = styled(Box)`
  margin: 5px;
  width: 10px;
  overflow: visible;
`;
