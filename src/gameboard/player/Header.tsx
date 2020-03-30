import React from "react";
import styled from "styled-components";
import { Box } from "@material-ui/core";
import { TrickLabel } from "./TrickLabel";
import { PlayerID } from "../../boardgame/entities/players";

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
  return (
    <Container>
      <PlayerTitle isTurn={isTurn} as={isClient ? "h1" : undefined}>
        Spieler {playerID}
      </PlayerTitle>
      <Spacer />
      <TrickLabel playerID={playerID} />
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 15px 0;
`;

const Spacer = styled.div`
  width: 10px;
  flex-grow: 1;
`;

const PlayerTitle = styled.h3<{ isTurn: boolean }>`
  margin: 0;
  text-decoration: ${({ isTurn }) => (isTurn ? "underline" : "none")};
  color: ${({ isTurn }) => (isTurn ? "darkred" : "inherit")};
`;
