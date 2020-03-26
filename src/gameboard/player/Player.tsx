import React from "react";
import { Box } from "@material-ui/core";
import styled from "styled-components";

export interface PlayerProps {
  playerID: string;
}

export const Player: React.FC<PlayerProps> = ({ playerID }) => {
  return <Container>Spieler: {playerID}</Container>;
};

const Container = styled(Box)`
  margin: 10px;
`;
