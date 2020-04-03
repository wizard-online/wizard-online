import { Ctx } from "boardgame.io";
import { Phase } from "../phases/phase";

const defaultCtx: Ctx = {
  numPlayers: 4,
  turn: 0,
  currentPlayer: "0",
  numMoves: 0,
  playOrder: ["0", "1", "2", "3"],
  playOrderPos: 0,
  phase: Phase.Setup,
  activePlayers: null,
  events: {
    endGame: () => {},
    endPhase: () => {},
    endStage: () => {},
    endTurn: () => {},
    pass: () => {},
    setActivePlayers: () => {},
    setPhase: () => {},
    setStage: () => {},
  },
};

export function generateCtx(options: Partial<Ctx> = {}): Ctx {
  const ctx: Ctx = { ...defaultCtx, ...options };
  return ctx;
}
