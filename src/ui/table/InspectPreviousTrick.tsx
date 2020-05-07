import React, { useState } from "react";
import { IconButton, Icon, Dialog } from "@material-ui/core";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { Trick } from "./Trick";

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
      {round?.previousTrick && (
        <Dialog open={showModal} onClose={() => setShowModal(false)}>
          <DialogContent>
            <h3>Letzter Stich</h3>
            <Trick cards={round.previousTrick} />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

const DialogContent = styled.div`
  margin: 25px;
`;
