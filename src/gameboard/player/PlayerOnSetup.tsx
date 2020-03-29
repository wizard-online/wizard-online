import React, { useContext } from "react";
import { Box, Button } from "@material-ui/core";
import { PlayerProps } from "./Player.props";
import { GameContext } from "../GameContext";

export const PlayerOnSetup: React.FC<PlayerProps> = ({ playerID }) => {
  const { gamestate } = useContext(GameContext);
  if (!gamestate) return null;

  const isTurn = gamestate.wizardState.currentPlayer === playerID;
  const { shuffle, handout } = gamestate.moves;
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
