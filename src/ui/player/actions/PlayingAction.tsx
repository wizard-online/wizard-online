import React from "react";
import { Button } from "@material-ui/core";
import { SelectedCardContext } from "../../SelectedCardContext";

export const PlayingAction: React.FC = () => {
  const { selectedCardIndex, cancelPlay } = React.useContext(
    SelectedCardContext
  );

  return selectedCardIndex !== undefined ? (
    <Button
      title="Abbrechen"
      onClick={() => cancelPlay?.()}
      variant="contained"
    >
      Abbrechen
    </Button>
  ) : (
    <small>Wähle eine Karte</small>
  );
};
