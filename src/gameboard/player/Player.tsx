import React, { useContext } from "react";
import { Box } from "@material-ui/core";
import styled from "styled-components";
import { GameContext } from "../GameContext";
import { PlayerOnSetup } from "./PlayerOnSetup";
import { PlayerProps } from "./Player.props";
import { PlayerOnBidding } from "./PlayerOnBidding";
import { PlayerOnPlaying } from "./PlayerOnPlaying";
import { TrickLabel } from "./TrickLabel";
import { Phase } from "../../boardgame/phases/phase";

export const Player: React.FC<PlayerProps> = ({ playerID }) => {
  const { gamestate , clientID} = useContext(GameContext);
  if (!gamestate) return null;


  const {
    //G: { currentPlayer },
    ctx: { phase }
  } = gamestate;

  const isClient = playerID === clientID;

  //const isTurn = playerID === currentPlayer;
  const playerTitle = <>Spieler: {playerID}</>;
  return (
    <Container>
      <PlayerTitle isClient={isClient}>{playerTitle}</PlayerTitle>
      <TrickLabel playerID={playerID} />
      {phase === Phase.Setup && <PlayerOnSetup playerID={playerID} />}
      {phase === Phase.Bidding && <PlayerOnBidding playerID={playerID} />}
      {phase === Phase.Playing && <PlayerOnPlaying playerID={playerID} />}
    </Container>
  );
};

const Container = styled(Box)`
  margin: 25px;
`;

const PlayerTitle = styled.h3<{ isClient: boolean }>`
  text-decoration: ${({ isClient }) => (isClient ? "underline" : "none")};
  color: ${({ isClient }) => (isClient ? "darkred" : "inherit")};
`;
