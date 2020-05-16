import React, { useState } from "react";
import styled, { css } from "styled-components";
import { Button } from "@material-ui/core";
import { TrickLabel } from "./TrickLabel";
import { PlayerID } from "../../game/entities/players";
import { usePlayerName, useGameState } from "../GameContext";
import { Blinker } from "../components/Blinker";
<<<<<<< HEAD
import { SettingsContainer } from "./SettingsContainer";
=======
import { sortHand, isSorted } from "../util/player-hands";
import { Card } from "../../game/entities/cards";
>>>>>>> latest enhancement

export interface HeaderProps {
  playerID: PlayerID;
  isTurn: boolean;
  isClient?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  playerID,
  isTurn,
  isClient,
}) => {
  const playerName = usePlayerName(playerID);
  const {
    wizardState: { round },
  } = useGameState();
  const cards = round?.hands[playerID];
  let isHandSorted = false;
  const showButton = isClient && !isHandSorted;

  if (showButton) {
    isHandSorted = isSorted(cards as Card[], round?.trump.suit);
  }

  if (isClient) {
    console.log("showButton", showButton);
  }

  return (
    <Container>
      <PlayerTitle isTurn={isTurn} as={isClient ? "h1" : undefined}>
        {playerName}
        {isClient && <Blinker on={isTurn} />}
      </PlayerTitle>
      <Spacer />
<<<<<<< HEAD
      {isClient && <SettingsContainer />}
      <Spacer />
=======
      {showButton && (
        <Button
          onClick={() => {
            sortHand(cards as Card[], round?.trump.suit);
            isHandSorted = true;
          }}
          type="button"
          disabled={isHandSorted}
        >
          Karten sortieren
        </Button>
      )}
      {showButton && <Spacer />}
>>>>>>> latest enhancement
      <TrickLabel playerID={playerID} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Spacer = styled.div`
  width: 10px;
  flex-grow: 1;
`;

const PlayerTitle = styled.h3<{ isTurn: boolean }>`
  margin: 0;
  ${({ isTurn }) =>
    isTurn
      ? css`
          text-decoration: underline;
        `
      : ""}
`;
