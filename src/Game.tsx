import { Client } from "boardgame.io/react";

import { setup } from "./boardgame/phases/setup";
import { predict } from "./boardgame/phases/predict";
import { play } from "./boardgame/phases/play";
import { defaultG } from "./boardgame/G";

const WizardGame = {
  name: "Wizard",
  minPlayers: 3,
  maxPlayers: 6,

  setup: defaultG,
  turn: { moveLimit: 0 },

  phases: {
    setup,
    predict,
    play,
  },
};

export const Game = Client({ game: WizardGame, numPlayers: 4 });
