import { Client } from "boardgame.io/react";

import logger from "redux-logger";
import { applyMiddleware } from "redux";
import { SocketIO } from "boardgame.io/multiplayer";

import { wizardGameConfig } from "./game/game";
import { WizardBoard } from "./ui/WizardBoard";

export const WizardClient = Client({
  game: wizardGameConfig,
  board: WizardBoard,
  numPlayers: 4,
  multiplayer: SocketIO({ server: "http://localhost:8000" }),
  enhancer: applyMiddleware(logger),
});
