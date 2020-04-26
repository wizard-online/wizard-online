import { useGameEventHandler } from "./game-event-handler";
import { GameEvent } from "../util/game-events";
import { GameState } from "../GameState";
import { finishedGameEventGA } from "../../analytics";

export function useGameOverAnalytics(): void {
  useGameEventHandler(GameEvent.GameOver, handleGameOver);
}

export function handleGameOver({
  wizardState: { numPlayers },
  clientID,
}: GameState): void {
  // only report once (not for each player)
  if (clientID === 0) {
    finishedGameEventGA(numPlayers);
  }
}
