import React from "react";
import { AppBar, Box, Toolbar } from "@material-ui/core";
import styled from "styled-components";

import { useGameState } from "../GameContext";

export const HeaderBar: React.FC = () => {
  const {
    wizardState: { phase, currentPlayer, numCards, numPlayers },
  } = useGameState();
  return (
    <AppBar position="sticky">
      <Toolbar>
        <h1>Wizard Online</h1>
        <SpaceFill />
        <InfoItem>Phase: {phase}</InfoItem>
        <InfoItem>PlayerId: {currentPlayer}</InfoItem>
        <InfoItem>Runde: {numCards}</InfoItem>
        <InfoItem>#Spieler: {numPlayers}</InfoItem>
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
