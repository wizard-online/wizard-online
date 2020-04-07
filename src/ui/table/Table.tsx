import React from "react";
import styled from "styled-components";
import { Trick } from "./Trick";
import { Deck } from "./Deck";
import { colors } from "../util/colors";
import { ActionsContainer } from "../player/actions/ActionsContainer";
import { useGameState, usePlayerName } from "../GameContext";

export const Table: React.FC = () => {
  const {
    wizardState: { currentPlayer, phase },
    clientID,
  } = useGameState();

  const isTurn = clientID === currentPlayer;
  const currentPlayerName = usePlayerName(currentPlayer);

  return (
    <TableContainer>
      <PlayRow data-testid="table-play">
        <Deck />
        <Trick />
        <SpaceFill />
      </PlayRow>
      <InfoRow>
        {isTurn && <ActionsContainer phase={phase} />}
        <SpaceFill />
        {isTurn ? (
          <TurnInfoClient>Du bist am Zug</TurnInfoClient>
        ) : (
          <TurnInfoOpponent>{currentPlayerName} ist am Zug</TurnInfoOpponent>
        )}
      </InfoRow>
    </TableContainer>
  );
};

const TableContainer = styled.div`
  background-color: ${colors.wood.medium};
  border: 2px solid ${colors.wood.dark};
  border-radius: 15px;
  min-height: 150px;
  margin: 25px 0;
  padding: 20px;
`;

const PlayRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid ${colors.wood.dark};
  padding-bottom: 25px;
`;

const InfoRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  min-height: 65px;
`;

const TurnInfoOpponent = styled.span`
  font-size: 18px;
`;

const TurnInfoClient = styled.span`
  font-size: 22px;
`;

const SpaceFill = styled.div`
  flex-grow: 1;
  margin: 0 3px;
`;
