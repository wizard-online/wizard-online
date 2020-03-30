import React from "react";
import { Box } from "@material-ui/core";
import styled from "styled-components";

import { Phase } from "../../boardgame/phases/phase";
import { useGameState } from "../GameContext";
import { PlayerHand } from "./PlayerHand";
import { Header } from "./Header";
import { ActionsContainer } from "./actions/ActionsContainer";

export const PlayerContainer: React.FC = () => {
  const {
    wizardState: { currentPlayer, phase, round, trick },
    clientID,
    moves: { play },
  } = useGameState();

  const isTurn = clientID === currentPlayer;

  return (
    <Container>
      <Header playerID={clientID} isTurn={isTurn} isClient />
      {round && (
        <PlayerHand
          cards={round.hands[clientID]}
          isInteractive={isTurn && phase === Phase.Playing}
          onClickCard={(i) => play(i)}
          lead={trick?.lead}
        />
      )}
      <ActionsContainer
        isTurn={isTurn}
        phase={phase}
        currentPlayer={currentPlayer}
      />
    </Container>
  );
};

const Container = styled(Box)`
  margin: 25px 0;
`;
