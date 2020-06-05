import React from "react";
import { useGameEventsDispatcher } from "./hooks/game-events-dispatcher";
import { useNotifyTrickComplete } from "./hooks/notify-trick-complete";
import { useNotifyRoundComplete } from "./hooks/notify-round-complete";
import { useGameOverAnalytics } from "./hooks/game-over-analytics";
import { useAlertClientTurn } from "./hooks/alert-client-turn";

export const GameEvents: React.FC = ({ children }) => {
  useGameEventsDispatcher();
  useAlertClientTurn();
  useNotifyTrickComplete();
  useNotifyRoundComplete();
  useGameOverAnalytics();
  return <>{children}</>;
};
