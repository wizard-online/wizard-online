import { Client } from "boardgame.io/react";

import { setup } from "./boardgame/phases/setup";
import { bidding } from "./boardgame/phases/bidding";
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
    predict: bidding,
    play,
  },
};

export const Game = Client({ game: WizardGame, numPlayers: 4 });
