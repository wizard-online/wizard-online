import { useEffect, useCallback } from "react";
import { GameEvent } from "../util/game-events";
import { GameState } from "../GameState";

export function useGameEventHandler(
  eventType: GameEvent,
  callback: (gameState: GameState) => void
): void {
  const eventCallback = useCallback(
    (event: CustomEvent<GameState>) => callback(event.detail),
    [callback]
  ) as EventListener;
  useEffect(() => {
    document.addEventListener(eventType, eventCallback);
    return () => {
      document.removeEventListener(eventType, eventCallback);
    };
  }, [eventType, eventCallback]);
}
