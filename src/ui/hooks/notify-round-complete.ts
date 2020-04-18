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
        let icon;
        if (clientID >= 0) {
          const { score } = playerScores[clientID];
          message += ` ${score} Punkte.`;
          icon = score > 0 ? "check" : "highlight_off";
        }

        notify({ message, icon });
      }
    },
    [notify]
  );

  useGameEventHandler(GameEvent.RoundComplete, handleRoundComplete);
}
