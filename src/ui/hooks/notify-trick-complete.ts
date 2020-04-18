import { useCallback } from "react";
import { GameEvent } from "../util/game-events";
import { getTrickWinner } from "../../game/entities/cards.utils";
import { useNotify } from "../NotificationsProvider";
import { getPlayerName } from "../../game/entities/players.utils";
import { useGameEventHandler } from "./game-event-handler";
import { GameState } from "../GameState";

export function useNotifyTrickComplete(): void {
  const notify = useNotify();

  const handleTrickComplete = useCallback(
    ({ wizardState: { round, trick }, gameMetadata, clientID }: GameState) => {
      const trickCards = trick?.cards;
      const trumpSuit = round?.trump.suit ?? null;

      if (trickCards) {
        const [, trickWinner] = getTrickWinner(trickCards, trumpSuit);
        let message: string;

        if (trickWinner === clientID) {
          message = "Du gewinnst den Stich!";
        } else {
          const trickWinnerName = getPlayerName(trickWinner, gameMetadata);
          message = `${trickWinnerName} gewinnt den Stich!`;
        }

        notify({ message });
      }
    },
    [notify]
  );

  useGameEventHandler(GameEvent.TrickComplete, handleTrickComplete);
}
