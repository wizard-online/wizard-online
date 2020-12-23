/* eslint-disable no-param-reassign */
import { Ctx } from "boardgame.io";
import { WizardState } from "./WizardState";
import { PlayerID } from "./entities/players";
import { Phase } from "./phases/phase";

export function onBeginTurn(wizardState: WizardState, ctx: Ctx): void {
  // sync ctx.currentPlayer (string) to wizardState.currentPlayer (number)
  wizardState.currentPlayer = Number.parseInt(
    ctx.currentPlayer,
    10
  ) as PlayerID;
  // also sync phase to wizardState
  wizardState.phase = ctx.phase as Phase;
}
