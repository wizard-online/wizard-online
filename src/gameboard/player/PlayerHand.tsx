import React from "react";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import { Card, playableCardsInHand } from "../../boardgame/entities/cards";
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
      ? playableCardsInHand(cards as Card[], lead || null)
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

const CardsContainer = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const PlayingCardContainer = styled(Box)`
  margin: 5px;
`;

function cardKey(card: Card | null, index: number): string {
  return card ? `${card.suit}-${card.rank}` : index.toString();
}