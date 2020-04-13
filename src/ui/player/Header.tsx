import React from "react";
import styled from "styled-components";
import { TrickLabel } from "./TrickLabel";
import { PlayerID } from "../../game/entities/players";
import { colors } from "../util/colors";
import { usePlayerName } from "../GameContext";

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
      </PlayerTitle>
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
      ? `
      text-decoration: underline;
      color: ${colors.wizard.darker};
      text-shadow: 0 0 3px ${colors.wizard.green};
  `
      : ""}
`;
