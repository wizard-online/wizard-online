import { FnContext, Game } from "boardgame.io";
import { WizardState } from "./WizardState";
import { wizardGameConfig } from "./game";
import { Phase } from "./phases/phase";
import { onBeginTurn } from "./turn";
import { mockStateExample } from "./mock-state";

const mockState = false;

export function loadGameConfig(): Game<WizardState> {
  if (mockState) {
    wizardGameConfig.setup = () => mockStateExample as WizardState;
    (wizardGameConfig.phases[Phase.Setup] as { start?: boolean }).start = false;
    (wizardGameConfig.phases[Phase.Playing] as {
      start?: boolean;
    }).start = true;
    (wizardGameConfig.phases[Phase.Playing] as { turn?: unknown }).turn = {
      order: {
        first() {
          return 3;
        },
        next({ ctx }: FnContext<WizardState>) {
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
