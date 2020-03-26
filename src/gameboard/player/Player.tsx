import React, { useContext } from "react";
import { Box } from "@material-ui/core";
import styled from "styled-components";
import { GameContext } from "../GameContext";
import { PlayerOnSetup } from "./PlayerOnSetup";
import { PlayerProps } from "./Player.props";
import { PlayerOnBidding } from "./PlayerOnBidding";
import { PlayerOnPlaying } from "./PlayerOnPlaying";

export const Player: React.FC<PlayerProps> = ({ playerID }) => {
  const { gamestate } = useContext(GameContext);
  if (!gamestate) return null;

  const { phase } = gamestate.ctx;
  return (
    <Container>
      Spieler: {playerID}
      {phase === "setup" && <PlayerOnSetup playerID={playerID} />}
      {phase === "bidding" && <PlayerOnBidding playerID={playerID} />}
      {phase === "playing" && <PlayerOnPlaying playerID={playerID} />}
    </Container>
  );
};

const Container = styled(Box)`
  margin: 10px;
`;
