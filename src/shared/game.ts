/* eslint-disable no-param-reassign */
import { PlayerID } from "boardgame.io";
import { generateDefaultWizardState, WizardState } from "./WizardState";
import { setup } from "./phases/setup";
import { bidding } from "./phases/bidding";
import { playing } from "./phases/playing";
import { Phase } from "./phases/phase";
import { selectingTrump } from "./phases/selecting-trump";
import { onBeginTurn } from "./turn";

function endIf({ G }: { G: WizardState }): number | void {
  const { roundIndex, rounds, round } = G;
  if (roundIndex + 1 === rounds.length && !!round?.isComplete) {
    return Date.now();
  }
}

function playerView({
  G: wizardState,
  playerID,
}: {
  G: WizardState;
  playerID: PlayerID | null;
}): WizardState {
  // no changes if no round is set
  if (!wizardState.round) return wizardState;
  const {
    round: { deck, hands, handsMeta },
    round,
  } = wizardState;

  return {
    ...wizardState,
    round: {
      ...round,
      // strip deck cards
      deck: deck.map(() => null),
      // strip opponent cards
      hands: hands.map((hand, index) => {
        // keep client's hand
        if (index.toString() === playerID) return hand;
        return hand.map(() => null);
      }),
      handsMeta: handsMeta.map((hand, index) => {
        // keep client's hand
        if (index.toString() === playerID) return hand;
        return null;
      }),
    },
  };
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
  playerView,
};
