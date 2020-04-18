import { useEffect } from "react";
import { GameEvent } from "../util/game-events";

export function useGameEventHandler(
  eventType: GameEvent,
  callback: () => void
): void {
  useEffect(() => {
    document.addEventListener(eventType, callback);
    return () => {
      document.removeEventListener(eventType, callback);
    };
  }, [eventType, callback]);
}
