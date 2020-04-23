import React from "react";
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
