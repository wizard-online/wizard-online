import { useCallback } from "react";
import { useGameEventHandler } from "./game-event-handler";
import { GameEvent } from "../util/game-events";
import { useNotify } from "../NotificationsProvider";
// import { useGameState } from "../GameContext";

export function useNotifyRoundComplete(): void {
  // const {
  //   wizardState: { round, trick },
  //   gameMetadata,
  // } = useGameState();
  const notify = useNotify();

  const handleRoundComplete = useCallback(() => {
    console.log("round completed!");
    notify({ message: "round completed!" });
  }, [notify]);

  useGameEventHandler(GameEvent.RoundComplete, handleRoundComplete);
}
