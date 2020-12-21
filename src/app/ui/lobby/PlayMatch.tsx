import React, { useEffect } from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import { WizardClient } from "../../WizardClient";
import { PlayerID } from "../../../shared/entities/players";
import { startedGameEventGA } from "../../analytics";

export interface PlayMatchProps {
  matchID: string;
  playerID?: PlayerID;
  credentials?: string;
}

export const PlayMatch: React.FC<PlayMatchProps> = ({
  matchID,
  playerID,
  credentials,
}) => {
  useEffect(() => {
    // only hit analytics event for one player
    if (playerID === 0) {
      startedGameEventGA();
    }
  }, [playerID]);
  return (
    <>
      {(playerID === undefined || !credentials) && (
        <AppBar position="static" color="transparent">
          <Toolbar variant="dense">
            <i>Zuschauer-Modus</i>
          </Toolbar>
        </AppBar>
      )}

      <WizardClient
        matchID={matchID}
        playerID={playerID?.toString()}
        credentials={credentials}
      />
    </>
  );
};
