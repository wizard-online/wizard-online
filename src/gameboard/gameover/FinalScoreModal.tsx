import React, { useState, useContext, useEffect } from "react";
import { Dialog, DialogTitle, Box } from "@material-ui/core";
import styled from "styled-components";
import { ScorePad } from "../score/ScorePad";
import { GameContext } from "../GameContext";
import { getLeader } from "../../boardgame/entities/score";

export const FinalScoreModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const { gamestate } = useContext(GameContext);
  if (!gamestate) return null;

  const {
    ctx: { gameover },
    wizardState: { scorePad },
  } = gamestate;
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

const Container = styled(Box)`
  margin: 25px;
`;
