import React from "react";
import range from "lodash/range";
import styled from "styled-components";
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

const CardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 90px;
`;

const PlayingCardContainer = styled.div`
  margin: 5px;
  width: 10px;
  overflow: visible;
`;
