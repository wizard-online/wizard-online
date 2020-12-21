import { useCallback } from "react";
import { GameEvent } from "../util/game-events";
import { getTrickWinner } from "../../../shared/entities/cards.utils";
import { useNotify } from "../NotificationsProvider";
import { getPlayerName } from "../../../shared/entities/players.utils";
import { useGameEventHandler } from "./game-event-handler";
import { GameState } from "../GameState";
import { checkTrickCard } from "../../../shared/entities/trick.utils";

export function useNotifyTrickComplete(): void {
  const notify = useNotify();

  const handleTrickComplete = useCallback(
    ({ wizardState: { round, trick }, matchData, clientID }: GameState) => {
      const trickCards = trick?.cards.filter(checkTrickCard);
      const trumpSuit = round?.trump.suit ?? null;

      if (trickCards) {
        const { player } = getTrickWinner(trickCards, trumpSuit);
        let message: string;

        if (player === clientID) {
          message = "Du gewinnst den Stich!";
        } else {
          const trickWinnerName = getPlayerName(player, matchData);
          message = `${trickWinnerName} gewinnt den Stich!`;
        }

        notify({ message, icon: "info" });
      }
    },
    [notify]
  );

  useGameEventHandler(GameEvent.TrickComplete, handleTrickComplete);
}
