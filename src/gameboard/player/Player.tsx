import React from "react";
import { Box } from "@material-ui/core";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { PlayerOnSetup } from "./PlayerOnSetup";
import { PlayerOnBidding } from "./PlayerOnBidding";
import { PlayerOnPlaying } from "./PlayerOnPlaying";
import { Phase } from "../../boardgame/phases/phase";
import { PlayerOnSelectingTrump } from "./PlayerOnSelectingTrump";
import { PlayerHand } from "./PlayerHand";
import { Header } from "./Header";

export const Player: React.FC = () => {
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
      <ActionsContainer>
        {isTurn ? (
          <>
            {phase === Phase.Setup && <PlayerOnSetup />}
            {phase === Phase.SelectingTrump && <PlayerOnSelectingTrump />}
            {phase === Phase.Bidding && <PlayerOnBidding />}
            {phase === Phase.Playing && <PlayerOnPlaying />}
          </>
        ) : (
          <span>Spieler {currentPlayer} ist am Zug</span>
        )}
      </ActionsContainer>
    </Container>
  );
};

const Container = styled(Box)`
  margin: 25px 0;
`;

const ActionsContainer = styled(Box)`
  margin: 15px 0;
  min-height: 100px;
`;
