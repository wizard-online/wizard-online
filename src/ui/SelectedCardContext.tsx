import React from "react";
import { Card } from "../game/entities/cards";
import { playableCardsInHand } from "../game/entities/cards.utils";
import { useGameState } from "./GameContext";

export interface SelectedCard {
  selectedCardIndex?: number;
  setSelectedCardIndex: (next?: number) => void;
  cancelPlay?: () => void;
}

export const SelectedCardContext = React.createContext<SelectedCard>({
  setSelectedCardIndex: () => {},
});

export const SelectedCardProvider: React.FC = ({ children }) => {
  const [selectedCardIndex, setSelectedCardIndex] = React.useState<
    number | undefined
  >();
  const cancelPlayRef = React.useRef<() => void>();

  const updateSelectedCardIndex = (value: number | undefined): void => {
    setSelectedCardIndex(value);
    cancelPlayRef.current?.();
    cancelPlayRef.current = undefined;
  };

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

  async function playCard(): Promise<void> {
    try {
      await dispatchPlayAction();
      play(selectedCardIndex);
    } catch {
      // ignore
    }
    updateSelectedCardIndex(undefined);
  }

  function dispatchPlayAction(): Promise<void> {
    return new Promise((resolve, reject) => {
      const handle = setTimeout(resolve, 1000);
      cancelPlayRef.current = () => {
        clearTimeout(handle);
        reject();
      };
    });
  }

  React.useEffect(() => {
    if (
      canPreselectCard &&
      playableCards?.filter((playable) => playable).length === 1
    ) {
      const onlyPlayableCardIndex = playableCards.findIndex(
        (playable) => playable
      );
      setSelectedCardIndex(onlyPlayableCardIndex);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canPreselectCard]);

  React.useEffect(() => {
    if (isTurn && isCardSelected) {
      playCard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTurn, isCardSelected]);

  return (
    <SelectedCardContext.Provider
      value={{
        selectedCardIndex,
        setSelectedCardIndex: updateSelectedCardIndex,
        cancelPlay: cancelPlayRef.current,
      }}
    >
      {children}
    </SelectedCardContext.Provider>
  );
};
