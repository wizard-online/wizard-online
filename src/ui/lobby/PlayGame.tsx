import React from "react";
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
    <div>
      <h1>Playing!</h1>
      <div>
        <WizardClient
          gameID={gameID}
          playerID={playerID?.toString()}
          credentials={credentials}
        />
      </div>
    </div>
  );
};
