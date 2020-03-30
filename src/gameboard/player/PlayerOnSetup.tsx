import React from "react";
import { Box, Button } from "@material-ui/core";
import { PlayerProps } from "./Player.props";
import { useGameState } from "../GameContext";

export const PlayerOnSetup: React.FC<PlayerProps> = ({ playerID }) => {
  const {
    wizardState: { currentPlayer },
    moves: { shuffle, handout },
  } = useGameState();
  const isTurn = currentPlayer === playerID;
  return (
    <Box>
      {isTurn ? (
        <>
          <Button onClick={() => shuffle()}>Mischen</Button>
          <Button onClick={() => handout()}>Austeilen</Button>
        </>
      ) : (
        <em>Warten auf Geber</em>
      )}
    </Box>
  );
};
