/* eslint-disable no-param-reassign */
import { Ctx } from "boardgame.io";
import { generateDefaultWizardState, WizardState } from "./WizardState";
import { setup } from "./phases/setup";
import { bidding } from "./phases/bidding";
import { playing } from "./phases/playing";
import { maxCards, PlayerID } from "./entities/players";
import { Phase } from "./phases/phase";
import { selectingTrump } from "./phases/selecting-trump";

function endIf({ numCards, numPlayers }: WizardState): boolean {
  return numCards > maxCards(numPlayers);
}

function onEnd(g: WizardState): void {
  // TODO: handle game end
  console.log("GAME ENDED", g.currentPlayer);
}

function onBeginTurn(g: WizardState, ctx: Ctx): void {
  // sync ctx.currentPlayer (string) to g.currentPlayer (number)
  g.currentPlayer = Number.parseInt(ctx.currentPlayer, 10) as PlayerID;
  // also sync phase to g
  g.phase = ctx.phase as Phase;
}

export const wizardGameConfig = {
  name: "Wizard",
  minPlayers: 3,
  maxPlayers: 6,

  setup: generateDefaultWizardState,
  turn: { onBegin: onBeginTurn },

  phases: {
    [Phase.Setup]: setup,
    [Phase.SelectingTrump]: selectingTrump,
    [Phase.Bidding]: bidding,
    [Phase.Playing]: playing,
  },
  endIf,
  onEnd,
};
