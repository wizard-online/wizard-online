import { useCallback } from "react";
import { useGameEventHandler } from "./game-event-handler";
import { GameEvent } from "../util/game-events";
import { useNotify } from "../NotificationsProvider";
import { GameState } from "../GameState";

export function useNotifyRoundComplete(): void {
  const notify = useNotify();

  const handleRoundComplete = useCallback(
    ({ wizardState: { scorePad }, clientID }: GameState) => {
      if (scorePad.length > 0) {
        const { numCards, playerScores } = scorePad[scorePad.length - 1];

        let message = `Runde ${numCards} beendet.`;
        if (clientID >= 0) {
          const { score } = playerScores[clientID];
          message += ` ${score} Punkte.`;
        }

        notify({ message });
      }
    },
    [notify]
  );

  useGameEventHandler(GameEvent.RoundComplete, handleRoundComplete);
}
