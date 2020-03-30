import React from "react";
import { Box } from "@material-ui/core";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { PlayerOnSetup } from "./PlayerOnSetup";
import { PlayerProps } from "./Player.props";
import { PlayerOnBidding } from "./PlayerOnBidding";
import { PlayerOnPlaying } from "./PlayerOnPlaying";
import { TrickLabel } from "./TrickLabel";
import { Phase } from "../../boardgame/phases/phase";
import { PlayerOnSelectingTrump } from "./PlayerOnSelectingTrump";
import { PlayerHand } from "./PlayerHand";

export const Player: React.FC<PlayerProps> = ({ playerID }) => {
  const {
    wizardState: { currentPlayer, phase, round, trick },
    moves: { play },
  } = useGameState();

  const isTurn = playerID === currentPlayer;

  return (
    <Container>
      <PlayerTitle isTurn={isTurn}>Spieler {playerID}</PlayerTitle>
      <TrickLabel playerID={playerID} />
      {phase === Phase.Setup && <PlayerOnSetup playerID={playerID} />}
      {phase === Phase.SelectingTrump && (
        <PlayerOnSelectingTrump playerID={playerID} />
      )}
      {phase === Phase.Bidding && <PlayerOnBidding playerID={playerID} />}
      {phase === Phase.Playing && <PlayerOnPlaying playerID={playerID} />}
      {round && (
        <PlayerHand
          cards={round.hands[playerID]}
          isInteractive={isTurn && phase === Phase.Playing}
          onClickCard={(i) => play(i)}
          lead={trick?.lead}
        />
      )}
    </Container>
  );
};

const Container = styled(Box)`
  margin: 25px;
`;

const PlayerTitle = styled.h3<{ isTurn: boolean }>`
  text-decoration: ${({ isTurn }) => (isTurn ? "underline" : "none")};
  color: ${({ isTurn }) => (isTurn ? "darkred" : "inherit")};
`;
