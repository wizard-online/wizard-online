/* eslint-disable no-param-reassign */
import { generateDefaultWizardState, WizardState } from "./WizardState";
import { setup } from "./phases/setup";
import { bidding } from "./phases/bidding";
import { playing } from "./phases/playing";
import { maxCards } from "./entities/players.utils";
import { Phase } from "./phases/phase";
import { selectingTrump } from "./phases/selecting-trump";
import { onBeginTurn } from "./turn";

function endIf({ numCards, numPlayers }: WizardState): boolean {
  return numCards > maxCards(numPlayers);
}

export const wizardGameConfig = {
  name: "wizard",
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
};
