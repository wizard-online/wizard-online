import React from "react";
import { useGameEventsDispatcher } from "./hooks/game-events-dispatcher";
import { useNotifyTrickComplete } from "./hooks/notify-trick-complete";
import { useNotifyRoundComplete } from "./hooks/notify-round-complete";

export const GameEvents: React.FC = ({ children }) => {
  useGameEventsDispatcher();
  useNotifyTrickComplete();
  useNotifyRoundComplete();
  return <>{children}</>;
};
