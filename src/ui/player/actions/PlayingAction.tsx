import React from "react";
import { SelectedCardContext } from "../../SelectedCardContext";
import { CancelableSubmitButton } from "../../components/playcard/CancelableSubmitButton";

export const PlayingAction: React.FC = () => {
  const {
    selectedCardIndex,
    setSelectedCardIndex,
    isInitiatingPlay,
    play,
  } = React.useContext(SelectedCardContext);

  return selectedCardIndex !== undefined && isInitiatingPlay ? (
    <CancelableSubmitButton
      timeout={2000}
      onSubmit={play}
      onCancel={() => setSelectedCardIndex(undefined)}
      isActive={isInitiatingPlay}
    />
  ) : (
    <small>Wähle eine Karte</small>
  );
};
