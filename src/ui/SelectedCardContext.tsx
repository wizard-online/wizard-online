import React from "react";
import { Card } from "../game/entities/cards";
import { playableCardsInHand } from "../game/entities/cards.utils";
import { useGameState } from "./GameContext";

enum SelectionType {
  Normal = "normal",
  Pre = "pre",
  Auto = "auto",
}

export interface SelectedCard {
  selectedCardIndex?: number;
  setSelectedCardIndex: (next?: number) => void;
  isInitiatingPlay: boolean;
  selectionType: SelectionType;
  play: () => void;
}

export const SelectedCardContext = React.createContext<SelectedCard>({
  setSelectedCardIndex: () => {},
  isInitiatingPlay: false,
  selectionType: SelectionType.Normal,
  play: () => {},
});

export const SelectedCardProvider: React.FC = ({ children }) => {
  const [selectedCardIndex, setSelectedCardIndex] = React.useState<
    number | undefined
  >();
  const [isInitiatingPlay, setIsInitiatingPlay] = React.useState(false);
  const cancelPlayRef = React.useRef<() => void>();
  const [selectionType, setSelectionType] = React.useState<SelectionType>(
    SelectionType.Normal
  );

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
    _selectionType?: SelectionType
  ): void => {
    setSelectedCardIndex(value);
    cancelPlayRef.current?.();
    cancelPlayRef.current = undefined;
    setSelectionType(
      _selectionType ?? (isTurn ? SelectionType.Normal : SelectionType.Pre)
    );
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
      updateSelectedCardIndex(onlyPlayableCardIndex, SelectionType.Auto);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canPreselectCard]);

  React.useEffect(() => {
    if (isTurn && isCardSelected) {
      if (selectionType !== SelectionType.Normal) {
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
        selectionType,
        play: playCard,
      }}
    >
      {children}
    </SelectedCardContext.Provider>
  );
};
