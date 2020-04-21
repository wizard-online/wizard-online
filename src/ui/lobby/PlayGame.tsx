import React from "react";
import { WizardClient } from "../../WizardClient";

export interface PlayGameProps {
  gameID: string;
  playerID: string;
  credentials: string;
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
          playerID={playerID}
          credentials={credentials}
        />
      </div>
    </div>
  );
};
