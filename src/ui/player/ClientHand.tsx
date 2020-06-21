import React from "react";
import styled from "styled-components";
import { playableCardsInHand } from "../../game/entities/cards.utils";
import { PlayCard } from "../components/playcard/PlayCard";
import { Card } from "../../game/entities/cards";
import { useProfile } from "../ProfileProvider";
import { sortHand } from "../util/sort-hands";
import { useGameState } from "../GameContext";

export interface HandCardsProps {
  cards: (Card | null)[];
  isInteractive: boolean;
  onClickCard?: (cardIndex: number) => void;
  lead?: Card;
}

export const ClientHand: React.FC<HandCardsProps> = ({
  cards,
  isInteractive,
  onClickCard = () => {},
  lead,
}) => {
  const playableCards =
    isInteractive && !cards.includes(null)
      ? playableCardsInHand(cards as Card[], lead)
      : undefined;

  const { wizardState } = useGameState();
  const suit = wizardState?.round?.trump?.suit;
  const { preferences } = useProfile();
  const sortedCards = sortHand(cards as Card[], suit, preferences?.handOrder);

  function getIndex(card: Card): number {
    return cards.findIndex((c) => card === c);
  }

  return (
    <CardsContainer data-testid="client-hand">
      {sortedCards.map((card) => (
        <PlayingCardContainer key={cardKey(card, getIndex(card))}>
          <PlayCard
            card={card}
            interactive={isInteractive}
            disabled={playableCards && !playableCards[getIndex(card)]}
            onClick={() => onClickCard(getIndex(card))}
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
  margin: 0 -5px;
`;

const PlayingCardContainer = styled.div`
  margin: 5px;
`;

function cardKey(card: Card | null, index: number): string {
  return card ? `${card.suit}-${card.rank}` : index.toString();
}
