import { Client } from "boardgame.io/react";

import logger from "redux-logger";
import { applyMiddleware } from "redux";
import { SocketIO } from 'boardgame.io/multiplayer'

import { setup } from "./boardgame/phases/setup";
import { bidding } from "./boardgame/phases/bidding";
import { playing } from "./boardgame/phases/playing";
import { defaultG } from "./boardgame/G";
import { WizardBoard } from "./gameboard/WizardBoard";

const WizardGame = {
  name: "Wizard",
  minPlayers: 3,
  maxPlayers: 6,

  setup: defaultG,
  turn: { moveLimit: 0 },

  phases: {
    setup,
    bidding,
    playing,
  },
};

export const Game = Client({
  game: WizardGame,
  board: WizardBoard,
  numPlayers: 4,
  multiplayer: SocketIO({ server: 'http://localhost:8000' }),
  enhancer: applyMiddleware(logger),
});

export const Wizard = WizardGame
