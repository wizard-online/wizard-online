import React from "react";
import styled from "styled-components";

import { useGameState } from "../GameContext";
import { PlayerID } from "../../../shared/entities/players";
import { Player } from "./Player";

export interface PlayersContainerProps {
  upper?: boolean;
}

export const PlayersContainer: React.FC<PlayersContainerProps> = ({
  upper,
}) => {
  const {
    clientID,
    ctx: { playOrder },
  } = useGameState();
  const clientPlayOrderIndex = playOrder.findIndex(
    (element) => element === clientID.toString()
  );

  const offset = upper ? 0 : Math.ceil(playOrder.length / 2);
  const fromIndex = 0 + offset;
  const toIndex = Math.ceil(playOrder.length / 2) + offset;

  const orderedPlayOrder = [
    // opponents coming after client
    ...playOrder.slice(clientPlayOrderIndex + 1),
    // opponents coming before client
    ...playOrder.slice(0, clientPlayOrderIndex + 1),
  ].map((opponentID) => Number.parseInt(opponentID, 10) as PlayerID);

  let usedPlayerIDs = orderedPlayOrder.slice(fromIndex, toIndex);
  if (!upper) {
    usedPlayerIDs = usedPlayerIDs.reverse();
  }

  return (
    <Container>
      {usedPlayerIDs.map((playerID) => (
        <FlexPlayer key={playerID} isClient={playerID === clientID}>
          <Player playerID={playerID} />
        </FlexPlayer>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin: 0 -10px;
`;

const FlexPlayer = styled.div<{ isClient: boolean }>`
  flex-grow: 1;
  display: flex;
  margin: 10px;
  min-width: ${({ isClient }) => (isClient ? 450 : 250)}px;
`;
