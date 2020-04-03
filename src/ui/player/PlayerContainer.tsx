import React, { useEffect } from "react";
import { Card, CardContent } from "@material-ui/core";
import styled from "styled-components";

import { Phase } from "../../game/phases/phase";
import { useGameState } from "../GameContext";
import { PlayerHand } from "./PlayerHand";
import { Header } from "./Header";
import { ActionsContainer } from "./actions/ActionsContainer";

export const PlayerContainer: React.FC = () => {
  const {
    wizardState: { currentPlayer, phase, round, trick },
    clientID,
    moves: { play, cleanupTrick },
  } = useGameState();

  const isTrickComplete = trick?.isComplete === true;

  useEffect(() => {
    if (isTrickComplete) {
      setTimeout(() => {
        cleanupTrick();
      }, 3000);
    }
  }, [isTrickComplete, cleanupTrick]);

  const isTurn = clientID === currentPlayer;

  return (
    <Container>
      <Header playerID={clientID} isTurn={isTurn} isClient />
      <Card>
        <HandContainer>
          {round && (
            <PlayerHand
              cards={round.hands[clientID]}
              isInteractive={isTurn && phase === Phase.Playing}
              onClickCard={(i) => play(i)}
              lead={trick?.lead}
            />
          )}
        </HandContainer>
      </Card>
      <ActionsContainer
        isTurn={isTurn}
        phase={phase}
        currentPlayer={currentPlayer}
      />
    </Container>
  );
};

const Container = styled.div`
  margin: 25px 0;
`;

const HandContainer = styled(CardContent)`
  min-height: 90px;
`;
