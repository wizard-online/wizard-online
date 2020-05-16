import { Ctx } from "boardgame.io";
import { WizardState } from "./WizardState";
import { wizardGameConfig } from "./game";
import { Phase } from "./phases/phase";
import { onBeginTurn } from "./turn";
import { mockStateExample } from "./mock-state";

const mockState = false;

export function loadGameConfig(): unknown {
  if (mockState) {
    wizardGameConfig.setup = () => mockStateExample as WizardState;
    wizardGameConfig.phases[Phase.Setup].start = false;
    wizardGameConfig.phases[Phase.Playing].start = true;
    wizardGameConfig.phases[Phase.Playing].turn = {
      order: {
        first() {
          return 3;
        },
        next(wizardState: WizardState, ctx: Ctx) {
          const currentPlayerIndex = ctx.playOrder.findIndex(
            (playerID) => playerID === ctx.currentPlayer
          );
          return (currentPlayerIndex + 1) % ctx.numPlayers;
        },
      },
      onBegin: onBeginTurn,
    };
  }
  return wizardGameConfig;
}
