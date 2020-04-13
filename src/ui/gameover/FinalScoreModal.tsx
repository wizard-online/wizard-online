import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, Button } from "@material-ui/core";
import styled from "styled-components";
import { ScorePad } from "../score/ScorePad";
import { useGameState, usePlayerName } from "../GameContext";
import { getLeader } from "../../game/entities/score.utils";
import { PlayerID } from "../../game/entities/players";

export const FinalScoreModal: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const {
    ctx: { gameover },
    wizardState: { scorePad },
  } = useGameState();

  useEffect(() => {
    setShowModal(!!gameover);
  }, [gameover]);

  return (
    <Dialog open={showModal}>
      {showModal && <FinalScoreModalContent winnerID={getLeader(scorePad)} />}
    </Dialog>
  );
};

interface FinalScoreModalContentProps {
  winnerID: PlayerID;
}

const FinalScoreModalContent: React.FC<FinalScoreModalContentProps> = ({
  winnerID,
}) => {
  const winnerName = usePlayerName(winnerID);
  return (
    <Container data-testid="final-score">
      <DialogTitle>{winnerName} gewinnt!</DialogTitle>
      <ScorePad />
      <ActionContainer>
        <Button
          color="primary"
          variant="contained"
          onClick={() => {
            const exitButtonElement = document.querySelector(
              "#game-exit button"
            ) as HTMLElement | null;
            exitButtonElement?.click();
          }}
        >
          Zur Lobby
        </Button>
      </ActionContainer>
    </Container>
  );
};

const Container = styled.div`
  margin: 25px;
`;

const ActionContainer = styled.div`
  margin: 15px 0;
`;
