import { useCallback } from "react";
import audioAlertFile from "../../assets/kalimba.mp3";
import { useGameEventHandler } from "./game-event-handler";
import { GameEvent } from "../util/game-events";
import { useProfile } from "../ProfileProvider";

const audioAlert = new Audio(audioAlertFile);

export function useAlertClientTurn(): void {
  const profile = useProfile();
  const { turnAlert } = profile.preferences;
  const handleClientTurn = useCallback((): void => {
    if (turnAlert) {
      audioAlert.play();
    }
  }, [turnAlert]);
  useGameEventHandler(GameEvent.ClientTurn, handleClientTurn);
}
