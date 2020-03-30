import React from "react";
import { Box } from "@material-ui/core";

import styled from "styled-components";
import { useGameState } from "../GameContext";
import { PlayerID } from "../../boardgame/entities/players";
import { Opponent } from "./Opponent";

export const OpponentsContainer: React.FC = () => {
  const {
    clientID,
    ctx: { playOrder },
  } = useGameState();
  const clientPlayOrderIndex = playOrder.findIndex(
    (element) => element === clientID.toString()
  );

  const opponentIDs = [
    // opponents coming after client
    ...playOrder.slice(clientPlayOrderIndex + 1),
    // opponents coming before client
    ...playOrder.slice(0, clientPlayOrderIndex),
  ].map((opponentID) => Number.parseInt(opponentID, 10) as PlayerID);

  return (
    <Container>
      {opponentIDs.map((playerID) => (
        <FlexOpponent key={playerID}>
          <Opponent playerID={playerID} />
        </FlexOpponent>
      ))}
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -15px;
`;

const FlexOpponent = styled(Box)`
  flex-grow: 1;
  margin: 15px;
  min-width: 300px;
`;
