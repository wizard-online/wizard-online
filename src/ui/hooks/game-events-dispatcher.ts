import { useEffect } from "react";
import { useGameState } from "../GameContext";
import { GameEvent } from "../util/game-events";
import { GameState } from "../GameState";

export function useGameEventsDispatcher(): void {
  const gameState = useGameState();
  const {
    wizardState: { round, trick },
  } = gameState;
  // manage trick-complete event disptach
  const trickIsComplete = trick?.isComplete;
  useEffect(() => {
    if (trickIsComplete) {
      document.dispatchEvent(
        new CustomEvent<GameState>(GameEvent.TrickComplete, {
          detail: gameState,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trickIsComplete]);

  // manage round-complete event dispatch
  const roundIsComplete = round?.isComplete;
  useEffect(() => {
    if (roundIsComplete) {
      document.dispatchEvent(
        new CustomEvent<GameState>(GameEvent.RoundComplete, {
          detail: gameState,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIsComplete]);
}
