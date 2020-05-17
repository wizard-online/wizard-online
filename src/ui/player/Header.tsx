import React from "react";
import styled, { css } from "styled-components";
import { TrickLabel } from "./TrickLabel";
import { PlayerID } from "../../game/entities/players";
import { usePlayerName } from "../GameContext";
import { Blinker } from "../components/Blinker";
<<<<<<< HEAD
<<<<<<< HEAD
import { SettingsContainer } from "./SettingsContainer";
=======
import { sortHand, isSorted } from "../util/player-hands";
import { Card } from "../../game/entities/cards";
>>>>>>> latest enhancement
=======
import { ControlBar } from "./ControlBar";
>>>>>>> handOrder in profile, switch button

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

  return (
    <Container>
      <PlayerTitle isTurn={isTurn} as={isClient ? "h1" : undefined}>
        {playerName}
        {isClient && <Blinker on={isTurn} />}
      </PlayerTitle>
      <Spacer />
<<<<<<< HEAD
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
=======
      {isClient && <ControlBar />}
      <Spacer />
>>>>>>> handOrder in profile, switch button
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
