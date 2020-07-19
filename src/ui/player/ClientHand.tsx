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

export interface HandCardsProps {
  cards: Card[];
  isPlayTurn: boolean;
  hasPlayed?: boolean;
  onClickCard?: (cardIndex: number) => void;
  lead?: Card;
  trumpSuit: Suit | null | undefined;
  handMeta: HandMeta;
}

export const ClientHand: React.FC<HandCardsProps> = ({
  cards,
  isPlayTurn,
  hasPlayed,
  onClickCard = () => {},
  lead,
  trumpSuit,
  handMeta,
}) => {
  const playableCards =
    lead && !hasPlayed ? playableCardsInHand(cards as Card[], lead) : undefined;

  const { preferences } = useProfile();
  const { handOrder } = preferences;
  const sortedCards = React.useMemo(
    () => sortHand(cards, trumpSuit, handMeta, handOrder),
    [cards, trumpSuit, handMeta, handOrder]
  );
  const [preselectedCard, setPreselectedCard] = React.useState<
    Card | undefined
  >();

  function getIndex(card: Card): number {
    return cards.findIndex((c) => card === c);
  }

  return (
    <CardsContainer data-testid="client-hand">
      {sortedCards.map((card) => (
        <PlayingCardContainer key={cardKey(card, getIndex(card))}>
          <PlayCard
            card={card}
            interactive={isPlayTurn || (!!lead && !hasPlayed)}
            disabled={playableCards && !playableCards[getIndex(card)]}
            onClick={() => {
              if (isPlayTurn) {
                onClickCard(getIndex(card));
              } else if (preselectedCard && equalCards(card, preselectedCard)) {
                setPreselectedCard(undefined);
              } else {
                setPreselectedCard(card);
              }
            }}
            preselected={preselectedCard && equalCards(card, preselectedCard)}
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
