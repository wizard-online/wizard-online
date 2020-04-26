import ReactGA from "react-ga";
import { useCallback } from "react";
import { useGameEventHandler } from "./game-event-handler";
import { GameEvent } from "../util/game-events";
import { GameState } from "../GameState";
import { getLeader } from "../../game/entities/score.utils";

export function useGameOverAnalytics(): void {
  const handleGameOver = useCallback(
    ({ wizardState: { scorePad }, clientID }: GameState) => {
      // only report once (not for all players)
      if (clientID === 0) {
        const winnerID = getLeader(scorePad);
        const latestRow = scorePad[scorePad.length - 1];
        const winnerScore = latestRow.playerScores[winnerID];
        ReactGA.event({
          category: "Game",
          action: "Finished Game",
          value: winnerScore.total,
        });
      }
    },
    []
  );

  useGameEventHandler(GameEvent.GameOver, handleGameOver);
}
