import React from "react";

import { Lobby, Client } from "boardgame.io/react";
import { applyMiddleware } from "redux";
import logger from "redux-logger";
import { wizardGameConfig } from "./boardgame/game";
import { WizardBoard } from "./gameboard/WizardBoard";

// en-/disable console logging of redux actions
const REDUX_LOGGER = false;

export const App: React.FC<{}> = () => (
  <Lobby
    gameServer="http://localhost:8000"
    lobbyServer="http://localhost:8000"
    gameComponents={[
      {
        game: wizardGameConfig,
        board: WizardBoard,
      },
    ]}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clientFactory={(opts: any) => {
      return Client({
        enhancer: REDUX_LOGGER ? applyMiddleware(logger) : undefined,
        ...opts,
      });
    }}
  />
);
