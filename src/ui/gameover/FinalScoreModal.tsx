import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, Button } from "@material-ui/core";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { ScorePad } from "../score/ScorePad";
import { useGameState } from "../GameContext";
import { getLeaders } from "../../game/entities/score.utils";
import { PlayerID } from "../../game/entities/players";
import { getPlayerName } from "../../game/entities/players.utils";

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
      {showModal && <FinalScoreModalContent winnerIDs={getLeaders(scorePad)} />}
    </Dialog>
  );
};

interface FinalScoreModalContentProps {
  winnerIDs: PlayerID[];
}

const FinalScoreModalContent: React.FC<FinalScoreModalContentProps> = ({
  winnerIDs,
}) => {
  const history = useHistory();
  const { gameMetadata } = useGameState();

  const winnerNames = winnerIDs.map((winnerID) =>
    getPlayerName(winnerID, gameMetadata ?? [])
  );
  return (
    <Container data-testid="final-score">
      <DialogTitle>
        {winnerNames.join("&")}{" "}
        {winnerNames.length > 1 ? "gewinnen" : "gewinnt"}!
      </DialogTitle>
      <ScorePad />
      <ActionContainer>
        <Button
          color="primary"
          variant="contained"
          onClick={() => history.push("/")}
        >
          Spiel schließen
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
