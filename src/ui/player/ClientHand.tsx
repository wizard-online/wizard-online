import React from "react";
import styled from "styled-components";
import {
  playableCardsInHand,
  equalCards,
} from "../../game/entities/cards.utils";
import { PlayCard } from "../components/playcard/PlayCard";
import { Card, Suit } from "../../game/entities/cards";
import { useProfile } from "../ProfileProvider";
import { sortHand } from "../util/sort-hands";
import { HandMeta } from "../../game/WizardState";
import { SelectedCardContext } from "../SelectedCardContext";

export interface HandCardsProps {
  cards: Card[];
  isPlayTurn: boolean;
  hasPlayed?: boolean;
  lead?: Card;
  trumpSuit: Suit | null | undefined;
  handMeta: HandMeta;
}

export const ClientHand: React.FC<HandCardsProps> = ({
  cards,
  isPlayTurn,
  hasPlayed,
  lead,
  trumpSuit,
  handMeta,
}) => {
  const canPreselectCard = !!lead && !hasPlayed;
  const canSelectCard = isPlayTurn || canPreselectCard;
  const playableCards = canPreselectCard
    ? playableCardsInHand(cards as Card[], lead)
    : undefined;

  const { preferences } = useProfile();
  const { handOrder } = preferences;
  const sortedCards = React.useMemo(
    () => sortHand(cards, trumpSuit, handMeta, handOrder),
    [cards, trumpSuit, handMeta, handOrder]
  );
  const { selectedCardIndex, setSelectedCardIndex } = React.useContext(
    SelectedCardContext
  );

  function getIndex(card: Card): number {
    return cards.findIndex((c) => equalCards(card, c));
  }

  return (
    <CardsContainer data-testid="client-hand">
      {sortedCards.map((card) => {
        const index = getIndex(card);
        return (
          <PlayingCardContainer key={cardKey(card, index)}>
            <PlayCard
              card={card}
              interactive={canSelectCard}
              disabled={playableCards && !playableCards[index]}
              onClick={() => {
                if (index === selectedCardIndex) {
                  setSelectedCardIndex(undefined);
                } else {
                  setSelectedCardIndex(index);
                }
              }}
              preselected={index === selectedCardIndex}
            />
          </PlayingCardContainer>
        );
      })}
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
