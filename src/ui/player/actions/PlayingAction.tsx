import React from "react";
import { SelectedCardContext } from "../../SelectedCardContext";
import { CancelableSubmitButton } from "../../components/playcard/CancelableSubmitButton";

export const PlayingAction: React.FC = () => {
  const {
    selectedCardIndex,
    setSelectedCardIndex,
    isInitiatingPlay,
    selectionType,
    play,
  } = React.useContext(SelectedCardContext);

  return selectedCardIndex !== undefined && isInitiatingPlay ? (
    <CancelableSubmitButton
      timeout={selectionType === "auto" ? 2500 : 1000}
      onSubmit={play}
      onCancel={() => setSelectedCardIndex(undefined)}
      isActive={isInitiatingPlay}
    />
  ) : (
    <small>Wähle eine Karte</small>
  );
};
