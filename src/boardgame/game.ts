/* eslint-disable no-param-reassign */
import { Ctx } from "boardgame.io";
import { defaultG, G } from "./G";
import { setup } from "./phases/setup";
import { bidding } from "./phases/bidding";
import { playing } from "./phases/playing";
import { maxCards, PlayerID } from "./entities/players";

function endIf({ game: { numCards, numPlayers } }: G): boolean {
  return numCards > maxCards(numPlayers);
}

function onEnd(g: G): void {
  console.log("GAME ENDED", g.game.currentPlayer);
}

function onBeginTurn(g: G, ctx: Ctx): void {
  g.game.currentPlayer = Number.parseInt(ctx.currentPlayer, 10) as PlayerID;
}

export const game = {
  name: "Wizard",
  minPlayers: 3,
  maxPlayers: 6,

  setup: defaultG,
  turn: { onBegin: onBeginTurn },

  phases: {
    setup,
    bidding,
    playing,
  },
  endIf,
  onEnd,
};
