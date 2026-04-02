import { FnContext } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { WizardState, isSetRound } from "../WizardState";
import { Suit, allSuits } from "../entities/cards";
import { Phase } from "./phase";
import { onBeginTurn } from "../turn";

export function selectTrump(
  { G, events }: FnContext<WizardState>,
  suit: Suit
): void | "INVALID_MOVE" {
  if (!allSuits.includes(suit)) {
    return INVALID_MOVE;
  }
  const { round } = G;
  if (!isSetRound(round)) {
    throw new Error("round is not set");
  }

  // set trump
  round.trump.suit = suit;

  // end phase
  events.endPhase();
}

function first({ G: g, ctx }: FnContext<WizardState>): number {
  return ctx.playOrder.findIndex(
    (playerID) => playerID === g.dealer.toString()
  );
}

export const selectingTrump = {
  moves: {
    selectTrump,
  },
  next: Phase.Bidding,
  turn: {
    order: {
      // returns playOrder index of dealer
      first,
      next({ ctx }: FnContext<WizardState>): number {
        const currentPlayerIndex = ctx.playOrder.findIndex(
          (playerID) => playerID === ctx.currentPlayer
        );
        return (currentPlayerIndex + 1) % ctx.numPlayers;
      },
    },
    onBegin: onBeginTurn,
  },
};
