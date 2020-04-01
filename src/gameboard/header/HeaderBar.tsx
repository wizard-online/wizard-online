import React from "react";
import { AppBar, Box, Toolbar } from "@material-ui/core";
import styled from "styled-components";

import { useGameState } from "../GameContext";
import { maxCards } from "../../boardgame/entities/players";

export const HeaderBar: React.FC = () => {
  const {
    wizardState: { numCards, numPlayers, round },
  } = useGameState();
  return (
    <AppBar position="sticky">
      <Toolbar>
        <h1>Wizard Online</h1>
        <SpaceFill />
        {round && round.bidsMismatch !== undefined && (
          <InfoItem>
            {round.bidsMismatch > 0 && "+"}
            {round.bidsMismatch} Stiche Abweichung{" "}
            {round.bidsMismatch > 0 && "(offensiv)"}
            {round.bidsMismatch < 0 && "(defensiv)"}
            {round.bidsMismatch === 0 && "(ausgeglichen)"}
          </InfoItem>
        )}
        <InfoItem>
          Runde {numCards} / {maxCards(numPlayers)}
        </InfoItem>
        <InfoItem>{numPlayers} Spieler</InfoItem>
      </Toolbar>
    </AppBar>
  );
};

const SpaceFill = styled.div`
  flex-grow: 1;
`;

const InfoItem = styled(Box)`
  margin: 15px;
`;
