import React from "react";
import { IconButton, Icon } from "@material-ui/core";
import { useGameState } from "../GameContext";

export const InspectPreviousTrick: React.FC = () => {
  const {
    wizardState: {
      config: { inspectPreviousTrick },
      round,
    },
  } = useGameState();

  if (!inspectPreviousTrick) {
    return null;
  }

  return (
    <IconButton disabled={!round?.previousTrick}>
      <Icon fontSize="small">styles</Icon>
    </IconButton>
  );
};
