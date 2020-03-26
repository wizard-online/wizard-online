import React, { useContext } from "react";
import { AppBar, Box, Toolbar } from "@material-ui/core";
import styled from "styled-components";

import { GameContext } from "../GameContext";

export const HeaderBar: React.FC = () => {
  const gameContext = useContext(GameContext);
  return (
    <AppBar position="sticky">
      <Toolbar>
        <h1>Wizard Online</h1>
        <SpaceFill />
        <InfoItem>PlayerId: {gameContext.ctx.currentPlayer}</InfoItem>
        <InfoItem>Runde: {gameContext.G.game.numCards}</InfoItem>
        <InfoItem>#Spieler: {gameContext.ctx.numPlayers}</InfoItem>
      </Toolbar>
    </AppBar>
  );
};

const SpaceFill = styled.div`
  flex-grow: 1;
`;

const InfoItem = styled(Box)`
  margin: 8px;
`;
