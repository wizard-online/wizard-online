import React from "react";
import styled, { css } from "styled-components";
import { TrickLabel } from "./TrickLabel";
import { PlayerID } from "../../../shared/entities/players";
import { usePlayerName } from "../GameContext";
import { Blinker } from "../components/Blinker";
import { SettingsContainer } from "./SettingsContainer";

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
      {isClient && <SettingsContainer />}
      <Spacer />
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
