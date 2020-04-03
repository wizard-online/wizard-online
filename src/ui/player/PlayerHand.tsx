import React from "react";
import styled from "styled-components";
import { Card, playableCardsInHand } from "../../game/entities/cards";
import { PlayCard } from "../components/PlayCard";

export interface HandCardsProps {
  cards: (Card | null)[];
  isInteractive: boolean;
  onClickCard?: (cardIndex: number) => void;
  lead?: Card;
}

export const PlayerHand: React.FC<HandCardsProps> = ({
  cards,
  isInteractive,
  onClickCard = () => {},
  lead,
}) => {
  const playableCards =
    isInteractive && !cards.includes(null)
      ? playableCardsInHand(cards as Card[], lead)
      : undefined;

  return (
    <CardsContainer>
      {cards.map((card, i) => (
        <PlayingCardContainer key={cardKey(card, i)}>
          <PlayCard
            card={card}
            interactive={isInteractive}
            disabled={playableCards && !playableCards[i]}
            onClick={() => onClickCard(i)}
          />
        </PlayingCardContainer>
      ))}
    </CardsContainer>
  );
};

const CardsContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const PlayingCardContainer = styled.div`
  margin: 5px;
`;

function cardKey(card: Card | null, index: number): string {
  return card ? `${card.suit}-${card.rank}` : index.toString();
}
