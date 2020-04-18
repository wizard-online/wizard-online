import { useEffect } from "react";
import { useGameState } from "../GameContext";
import { GameEvent } from "../util/game-events";

export function useGameEventsDispatcher(): void {
  const {
    wizardState: { round, trick },
  } = useGameState();

  // manage trick-complete event disptach
  const trickIsComplete = trick?.isComplete;
  useEffect(() => {
    if (trickIsComplete) {
      document.dispatchEvent(new Event(GameEvent.TrickComplete));
    }
  }, [trickIsComplete]);

  // manage round-complete event dispatch
  const roundIsComplete = round?.isComplete;
  useEffect(() => {
    if (roundIsComplete) {
      document.dispatchEvent(new Event(GameEvent.RoundComplete));
    }
  }, [roundIsComplete]);
}
