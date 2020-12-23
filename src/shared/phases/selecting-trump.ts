/* eslint-disable no-param-reassign */
import { Ctx, PhaseConfig } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { WizardState, isSetRound } from "../WizardState";
import { Suit, allSuits } from "../entities/cards";
import { Phase } from "./phase";
import { onBeginTurn } from "../turn";

export function selectTrump(
  { round }: WizardState,
  ctx: Ctx,
  suit: Suit
): void | "INVALID_MOVE" {
  if (!allSuits.includes(suit)) {
    return INVALID_MOVE;
  }
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }

  // set trump
  round.trump.suit = suit;

  // end phase
  ctx.events!.endPhase!();
}

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
      next(wizardState: WizardState, ctx: Ctx): number {
        const currentPlayerIndex = ctx.playOrder.findIndex(
          (playerID) => playerID === ctx.currentPlayer
        );
        return (currentPlayerIndex + 1) % ctx.numPlayers;
      },
    },
    onBegin: onBeginTurn,
  },
};
