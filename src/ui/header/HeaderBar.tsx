import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import styled from "styled-components";

import { useGameState } from "../GameContext";
import { maxCards } from "../../game/entities/players";
import { colors } from "../util/colors";

export const HeaderBar: React.FC = () => {
  const {
    wizardState: { numCards, numPlayers, round },
  } = useGameState();
  return (
    <StyledAppBar position="sticky">
      <Toolbar>
        <PageTitle>Wizard Online</PageTitle>
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
    </StyledAppBar>
  );
};

const StyledAppBar = styled(AppBar)`
  &.MuiAppBar-root {
    background-color: ${colors.wizard.green};
  }
`;

const PageTitle = styled.h1`
  font-style: italic;
  color: ${colors.white};
  /* text-outline effect only supported with prefix */
  -webkit-text-fill-color: ${colors.wizard.darker};
  -webkit-text-stroke: 1.5px ${colors.wizard.green};
  text-shadow: 0 0 12px ${colors.white};
`;

const SpaceFill = styled.div`
  flex-grow: 1;
`;

const InfoItem = styled.div`
  margin: 15px;
`;
