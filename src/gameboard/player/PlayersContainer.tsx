import React from "react";
import { Box } from "@material-ui/core";
import range from "lodash/range";

import { useGameState } from "../GameContext";
import { Player } from "./Player";
import { PlayerID } from "../../boardgame/entities/players";

export const PlayersContainer: React.FC = () => {
  const {
    wizardState: { numPlayers },
  } = useGameState();
  const playerIDs = range(0, numPlayers) as PlayerID[];
  return (
    <Box>
      {playerIDs.map((playerID) => (
        <Player playerID={playerID} key={playerID} />
      ))}
    </Box>
  );
};
