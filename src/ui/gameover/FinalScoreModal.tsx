import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, Button } from "@material-ui/core";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useGameState } from "../GameContext";
import { getLeaders } from "../../game/entities/score.utils";
import { PlayerID } from "../../game/entities/players";
import { getPlayerName } from "../../game/entities/players.utils";
import { ScoreContainer } from "../score/ScoreContainer";
import { ShareScore } from "./ShareScore";

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
  const {
    gameMetadata,
    wizardState: { scorePad },
    ctx: { gameover },
  } = useGameState();

  const winnerNames = winnerIDs.map((winnerID) =>
    getPlayerName(winnerID, gameMetadata ?? [])
  );
  return (
    <Container data-testid="final-score">
      <DialogTitle>
        {winnerNames.join("&")}{" "}
        {winnerNames.length > 1 ? "gewinnen" : "gewinnt"}!
      </DialogTitle>
      <SectionContainer>
        <ScoreContainer />
      </SectionContainer>
      <SectionContainer>
        <ShareScore
          finalResult={{
            date: new Date(gameover),
            playerNames: (gameMetadata ?? []).map(({ name }) => name),
            scorePad,
          }}
        />
      </SectionContainer>

      <SectionContainer>
        <Button
          color="primary"
          variant="contained"
          onClick={() => history.push("/")}
        >
          Spiel schließen
        </Button>
      </SectionContainer>
    </Container>
  );
};

const Container = styled.div`
  margin: 25px;
`;

const SectionContainer = styled.div`
  margin: 15px 0;
`;
