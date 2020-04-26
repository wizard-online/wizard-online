import React, { useEffect } from "react";
import ReactGA from "react-ga";
import { AppBar, Toolbar } from "@material-ui/core";
import { WizardClient } from "../../WizardClient";
import { PlayerID } from "../../game/entities/players";

export interface PlayGameProps {
  gameID: string;
  playerID?: PlayerID;
  credentials?: string;
}

export const PlayGame: React.FC<PlayGameProps> = ({
  gameID,
  playerID,
  credentials,
}) => {
  useEffect(() => {
    // only hit analytics event for one player
    if (playerID === 0) {
      ReactGA.event({
        category: "Game",
        action: "Started Game",
      });
    }
  }, [playerID]);
  return (
    <>
      {(!playerID || !credentials) && (
        <AppBar position="static" color="transparent">
          <Toolbar variant="dense">
            <i>Zuschauer-Modus</i>
          </Toolbar>
        </AppBar>
      )}

      <WizardClient
        gameID={gameID}
        playerID={playerID?.toString()}
        credentials={credentials}
      />
    </>
  );
};
