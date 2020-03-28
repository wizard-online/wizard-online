import React, { useContext } from "react";
import { AppBar, Box, Toolbar } from "@material-ui/core";
import styled from "styled-components";

import { GameContext } from "../GameContext";

export const HeaderBar: React.FC = () => {
  const { gamestate: boardgame } = useContext(GameContext);
  if (!boardgame) return null;
  return (
    <AppBar position="sticky">
      <Toolbar>
        <h1>Wizard Online</h1>
        <SpaceFill />
        <InfoItem>Phase: {boardgame.G.phase}</InfoItem>
        <InfoItem>PlayerId: {boardgame.G.currentPlayer}</InfoItem>
        <InfoItem>Runde: {boardgame.G.numCards}</InfoItem>
        <InfoItem>#Spieler: {boardgame.G.numPlayers}</InfoItem>
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
