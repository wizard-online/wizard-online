import { Client } from "boardgame.io/react";

import logger from "redux-logger";
import { applyMiddleware } from "redux";

import { game as WizardGame } from "./boardgame/game";
import { WizardBoard } from "./gameboard/WizardBoard";

export const Game = Client({
  game: WizardGame,
  board: WizardBoard,
  numPlayers: 4,
  enhancer: applyMiddleware(logger),
});
