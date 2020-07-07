import { useCallback } from "react";
import audioAlertFile from "../../assets/kalimba.mp3";
import { useGameEventHandler } from "./game-event-handler";
import { GameEvent } from "../util/game-events";
import { useProfile, useProfileContext } from "../ProfileProvider";

const audioAlert = new Audio(audioAlertFile);

export function useAlertClientTurn(): void {
  const { updateProfile } = useProfileContext();
  const profile = useProfile();
  const { turnAlert } = profile.preferences;
  const handleClientTurn = useCallback((): void => {
    if (turnAlert) {
      try {
        audioAlert.play();
      } catch (error) {
        updateProfile({ preferences: { turnAlert: false } });
      }
    }
  }, [turnAlert, updateProfile]);
  useGameEventHandler(GameEvent.ClientTurn, handleClientTurn);
}
