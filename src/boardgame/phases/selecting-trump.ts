import { Ctx, PhaseConfig } from "boardgame.io";
import { WizardState } from "../WizardState";
import { Suit } from "../entities/cards";
import { Phase } from "./phase";

export function selectTrump(
  wizardState: WizardState,
  ctx: Ctx,
  suit: Suit
): void {}

function first(g: WizardState, ctx: Ctx): number {
  return ctx.playOrder.findIndex(
    (playerID) => playerID === g.dealer.toString()
  );
}

export const selectingTrump: PhaseConfig = {
  moves: {
    selectTrump,
  },
  next: Phase.Bidding,
  turn: {
    order: {
      // returns playOrder index of dealer
      first,
    },
  },
};
