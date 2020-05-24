import { useEffect } from "react";
import { useGameState } from "../GameContext";
import { GameEvent } from "../util/game-events";
import { GameState } from "../GameState";

export function useGameEventsDispatcher(): void {
  const gameState = useGameState();
  const {
    wizardState: { round, trick, currentPlayer },
    ctx: { gameover },
    clientID,
  } = gameState;

  const isClientTurn = currentPlayer === clientID;
  useEffect(() => {
    if (isClientTurn) {
      document.dispatchEvent(
        new CustomEvent(GameEvent.ClientTurn, {
          detail: gameState,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClientTurn]);

  // manage trick-complete event disptach
  const trickIsComplete = trick?.isComplete;
  useEffect(() => {
    if (trickIsComplete) {
      document.dispatchEvent(
        new CustomEvent<GameState>(GameEvent.TrickComplete, {
          detail: gameState,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trickIsComplete]);

  // manage round-complete event dispatch
  const roundIsComplete = round?.isComplete;
  useEffect(() => {
    if (roundIsComplete) {
      document.dispatchEvent(
        new CustomEvent<GameState>(GameEvent.RoundComplete, {
          detail: gameState,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIsComplete]);

  const gameIsOver = !!gameover;
  useEffect(() => {
    if (gameIsOver) {
      document.dispatchEvent(
        new CustomEvent<GameState>(GameEvent.GameOver, {
          detail: gameState,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameIsOver]);
}
