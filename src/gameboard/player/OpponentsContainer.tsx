import React from "react";
import { Box } from "@material-ui/core";

import { useGameState } from "../GameContext";
import { Player } from "./Player";
import { PlayerID } from "../../boardgame/entities/players";

export const OpponentsContainer: React.FC = () => {
  const {
    clientID,
    ctx: { playOrder },
  } = useGameState();
  const clientPlayOrderIndex = playOrder.findIndex(
    (element) => element === clientID.toString()
  );

  const opponentIDs = [
    // opponents coming after client
    ...playOrder.slice(clientPlayOrderIndex + 1),
    // opponents coming before client
    ...playOrder.slice(0, clientPlayOrderIndex),
  ].map((opponentID) => Number.parseInt(opponentID, 10) as PlayerID);

  return (
    <Box>
      {opponentIDs.map((playerID) => (
        <Player playerID={playerID} key={playerID} />
      ))}
    </Box>
  );
};
