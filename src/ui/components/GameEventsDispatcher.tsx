import React, { useEffect } from "react";
import { useGameState } from "../GameContext";
import { GameEvent } from "../util/game-events";

export const GameEventDispatcher: React.FC = () => {
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

  // do not render anything
  return null;
};
