import React from "react";
import { Card } from "../game/entities/cards";
import { playableCardsInHand } from "../game/entities/cards.utils";
import { useGameState } from "./GameContext";

export interface SelectedCard {
  selectedCardIndex?: number;
  setSelectedCardIndex: (next?: number) => void;
  isInitiatingPlay: boolean;
  play: () => void;
}

export const SelectedCardContext = React.createContext<SelectedCard>({
  setSelectedCardIndex: () => {},
  isInitiatingPlay: false,
  play: () => {},
});

export const SelectedCardProvider: React.FC = ({ children }) => {
  const [selectedCardIndex, setSelectedCardIndex] = React.useState<
    number | undefined
  >();
  const [isInitiatingPlay, setIsInitiatingPlay] = React.useState(false);
  const cancelPlayRef = React.useRef<() => void>();
  const isPreselectedRef = React.useRef<boolean>(false);

  const {
    wizardState: { currentPlayer, round, trick },
    moves: { play },
    clientID,
  } = useGameState();

  const cards = round?.hands[clientID];
  const lead = trick?.isComplete ? undefined : trick?.lead;
  const hasPlayed = !!trick?.cards.find(({ player }) => player === clientID)
    ?.card;
  const canPreselectCard = !!cards && !!lead && !hasPlayed;
  const playableCards = canPreselectCard
    ? playableCardsInHand(cards as Card[], lead)
    : undefined;

  const isCardSelected = selectedCardIndex !== undefined;
  const isTurn = clientID === currentPlayer;

  const updateSelectedCardIndex = (
    value: number | undefined,
    isPreselected?: boolean
  ): void => {
    setSelectedCardIndex(value);
    cancelPlayRef.current?.();
    cancelPlayRef.current = undefined;
    isPreselectedRef.current = isPreselected ?? !isTurn;
  };

  function playCard(): void {
    play(selectedCardIndex);
    updateSelectedCardIndex(undefined);
  }

  React.useEffect(() => {
    if (
      canPreselectCard &&
      playableCards?.filter((playable) => playable).length === 1
    ) {
      const onlyPlayableCardIndex = playableCards.findIndex(
        (playable) => playable
      );
      updateSelectedCardIndex(onlyPlayableCardIndex, true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canPreselectCard]);

  React.useEffect(() => {
    if (isTurn && isCardSelected) {
      if (isPreselectedRef.current) {
        setIsInitiatingPlay(true);
      } else {
        playCard();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTurn, isCardSelected]);

  return (
    <SelectedCardContext.Provider
      value={{
        selectedCardIndex,
        setSelectedCardIndex: updateSelectedCardIndex,
        isInitiatingPlay,
        play: playCard,
      }}
    >
      {children}
    </SelectedCardContext.Provider>
  );
};
