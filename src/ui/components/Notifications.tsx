import React, { useState, useRef, useEffect } from "react";
import { Snackbar, SnackbarCloseReason } from "@material-ui/core";
import random from "lodash/random";
import { useGameState } from "../GameContext";
import { getTrickWinner } from "../../game/entities/cards.utils";
import { getPlayerName } from "../../game/entities/players.utils";
import { GameEvent } from "../util/game-events";

interface Notification {
  message: string;
}

interface NotificationWithKey extends Notification {
  key: number;
}

export const Notifications: React.FC = () => {
  const { gameMetadata } = useGameState();

  useEffect(() => {
    const handleTrickComplete = (): void => {
      console.log("trick completed!");
    };
    const handleRoundComplete = (): void => {
      console.log("round completed!");
    };
    document.addEventListener(GameEvent.TrickComplete, handleTrickComplete);
    document.addEventListener(GameEvent.RoundComplete, handleRoundComplete);
    return () => {
      document.removeEventListener(
        GameEvent.TrickComplete,
        handleTrickComplete
      );
      document.removeEventListener(
        GameEvent.RoundComplete,
        handleRoundComplete
      );
    };
  }, []);

  const [show, setShow] = useState(false);
  const [notification, setNotification] = useState<Notification | undefined>(
    undefined
  );
  const queue = useRef<NotificationWithKey[]>([]);
  function processQueue(): void {
    if (queue.current.length > 0) {
      setNotification(queue.current.shift());
      setShow(true);
    }
  }
  function showNotification(newNotification: Notification): void {
    queue.current.push({ ...newNotification, key: new Date().getTime() });
    if (show) {
      setShow(false);
    } else {
      processQueue();
    }
  }
  // eslint-disable-next-line no-empty-pattern
  function handleClose({}, reason: SnackbarCloseReason): void {
    if (reason === "clickaway") {
      return;
    }
    setShow(false);
  }
  function handleExited(): void {
    processQueue();
  }
  return (
    <div>
      <button
        type="button"
        onClick={() =>
          showNotification({
            message: `Hallo ${random(1, 100)}!!!`,
          })
        }
      >
        Notification
      </button>
      <Snackbar
        open={show}
        autoHideDuration={5000}
        onClose={handleClose}
        onExited={handleExited}
        message={notification ? notification.message : undefined}
      />
    </div>
  );
};
