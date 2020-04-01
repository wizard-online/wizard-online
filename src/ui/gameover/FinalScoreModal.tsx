import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle } from "@material-ui/core";
import styled from "styled-components";
import { ScorePad } from "../score/ScorePad";
import { useGameState } from "../GameContext";
import { getLeader } from "../../boardgame/entities/score";

export const FinalScoreModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const {
    ctx: { gameover },
    wizardState: { scorePad },
  } = useGameState();

  useEffect(() => {
    setShowModal(!!gameover);
  }, [gameover]);

  const winner = showModal ? getLeader(scorePad) : "";
  return (
    <Dialog open={showModal}>
      <Container>
        <DialogTitle>Spieler {winner} gewinnt!</DialogTitle>
        <ScorePad />
      </Container>
    </Dialog>
  );
};

const Container = styled.div`
  margin: 25px;
`;
