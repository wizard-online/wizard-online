import React, { useState } from "react";
import { IconButton, Icon, Dialog } from "@material-ui/core";
import { useGameState } from "../GameContext";

export const InspectPreviousTrick: React.FC = () => {
  const {
    wizardState: {
      config: { inspectPreviousTrick },
      round,
    },
  } = useGameState();
  const [showModal, setShowModal] = useState(false);

  if (!inspectPreviousTrick) {
    return null;
  }

  return (
    <>
      <IconButton
        disabled={!round?.previousTrick}
        title="Letzten Stich betrachten"
        onClick={() => setShowModal(true)}
      >
        <Icon fontSize="small">styles</Icon>
      </IconButton>
      <Dialog open={showModal} onClose={() => setShowModal(false)}>
        Letzter Stich
      </Dialog>
    </>
  );
};
