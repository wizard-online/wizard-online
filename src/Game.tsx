import { Ctx } from "boardgame.io";
import { Client } from "boardgame.io/react";

import { generateCardDeck } from "./boardgame/entities/cards";
import { setup } from "./boardgame/phases/setup";
import { predict } from "./boardgame/phases/predict";
import { play } from "./boardgame/phases/play";
import { G } from "./boardgame/G";

const WizardGame = {
  name: "Wizard",
  minPlayers: 3,
  maxPlayers: 6,

  setup: (ctx: Ctx): G => {
    return {
      numCardsOnHand: 3,
      score: Array(ctx.numPlayers).fill(null),
      hands: Array(ctx.numPlayers).fill(null),
      deck: generateCardDeck(),
    };
  },
  turn: { moveLimit: 0 },

  phases: {
    setup,
    predict,
    play,
  },
};

export const Game = Client({ game: WizardGame, numPlayers: 4 });
