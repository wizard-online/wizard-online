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
        <InfoItem>Phase: {boardgame.wizardState.phase}</InfoItem>
        <InfoItem>PlayerId: {boardgame.wizardState.currentPlayer}</InfoItem>
        <InfoItem>Runde: {boardgame.wizardState.numCards}</InfoItem>
        <InfoItem>#Spieler: {boardgame.wizardState.numPlayers}</InfoItem>
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
