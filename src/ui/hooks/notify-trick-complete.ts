import { useCallback } from "react";
import { GameEvent } from "../util/game-events";
// import { useGameState } from "../GameContext";
// import { getTrickWinner } from "../../game/entities/cards.utils";
import { useNotify } from "../NotificationsProvider";
// import { getPlayerName } from "../../game/entities/players.utils";
import { useGameEventHandler } from "./game-event-handler";

export function useNotifyTrickComplete(): void {
  // const {
  //   wizardState: { round, trick },
  //   gameMetadata,
  // } = useGameState();
  const notify = useNotify();

  // const handleTrickComplete = useCallback(() => {
  //   console.log("trick completed!");
  //   if (round && trick) {
  //     const [, trickWinner] = getTrickWinner(
  //       trick.cards,
  //       round.trump.suit ?? null
  //     );
  //     const trickWinnerName = getPlayerName(trickWinner, gameMetadata);
  //     notify({ message: `${trickWinnerName} gewinnt den Stich!` });
  //   }
  // }, [round, trick, gameMetadata, notify]);
  const handleTrickComplete = useCallback(() => {
    console.log("trick complete!");
    notify({ message: "trick complete!" });
  }, [notify]);

  useGameEventHandler(GameEvent.TrickComplete, handleTrickComplete);
}
