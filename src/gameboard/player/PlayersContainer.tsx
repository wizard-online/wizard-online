import React, { useContext } from "react";
import { Box } from "@material-ui/core";
import range from "lodash/range";

import { GameContext } from "../GameContext";
import { Player } from "./Player";

export const PlayersContainer: React.FC = () => {
  const { gamestate } = useContext(GameContext);
  if (!gamestate) return null;
  const playerIDs = range(0, gamestate.ctx.numPlayers).map((id) =>
    id.toString()
  );
  return (
    <Box>
      {playerIDs.map((playerID) => (
        <Player playerID={playerID} key={playerID} />
      ))}
    </Box>
  );
};
