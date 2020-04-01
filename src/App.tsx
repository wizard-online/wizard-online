import React from "react";

import { Lobby } from "boardgame.io/react";
import { wizardGameConfig } from "./boardgame/game";
import { WizardBoard } from "./gameboard/WizardBoard";

export const App: React.FC<{}> = () => (
  <Lobby
    gameServer="http://localhost:8000"
    lobbyServer="http://localhost:8000"
    gameComponents={[{ game: wizardGameConfig, board: WizardBoard }]}
  />
);
