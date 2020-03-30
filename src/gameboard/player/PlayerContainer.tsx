import React from "react";
import { Box } from "@material-ui/core";

import { useGameState } from "../GameContext";
import { Player } from "./Player";

export const PlayerContainer: React.FC = () => {
  const { clientID } = useGameState();
  return (
    <Box>
      <h1>Ich bin Spieler {clientID}</h1>
      <Player playerID={clientID} />
    </Box>
  );
};
