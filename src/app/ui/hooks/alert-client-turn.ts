import { useCallback } from "react";
import audioAlertFile from "../../assets/kalimba.mp3";
import { useGameEventHandler } from "./game-event-handler";
import { GameEvent } from "../util/game-events";
import { useProfile, useProfileContext } from "../ProfileProvider";

const audioAlert = new Audio(audioAlertFile);

export function useAlertClientTurn(): void {
  const profile = useProfile();
  const alert = useAlertClient();
  const { turnAlert } = profile.preferences;
  const handleClientTurn = useCallback(() => {
    if (turnAlert) {
      alert();
    }
  }, [turnAlert, alert]);
  useGameEventHandler(GameEvent.ClientTurn, handleClientTurn);
}

export function useAlertClient(): () => Promise<void> {
  const { updateProfile } = useProfileContext();

  return useCallback(async () => {
    try {
      await audioAlert.play();
    } catch {
      updateProfile({ preferences: { turnAlert: false } });
    }
  }, [updateProfile]);
}

export function alertClient(): Promise<void> {
  return audioAlert.play();
}
