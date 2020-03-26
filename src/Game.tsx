import { Client } from "boardgame.io/react";

import { setup } from "./boardgame/phases/setup";
import { bidding } from "./boardgame/phases/bidding";
import { play } from "./boardgame/phases/play";
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
    play,
  },
};

export const Game = Client({
  game: WizardGame,
  board: WizardBoard,
  numPlayers: 4,
});
