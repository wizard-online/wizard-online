import React from "react";
import styled from "styled-components";
import { Phase } from "../../../game/phases/phase";
import { SetupAction } from "./SetupAction";
import { SelectingTrumpAction } from "./SelectingTrumpAction";
import { BiddingAction } from "./BiddingAction";
import { PlayingAction } from "./PlayingAction";
import { PlayerID } from "../../../game/entities/players";
import { usePlayerName } from "../../GameContext";

export interface ActionsContainerProps {
  isTurn: boolean;
  phase: Phase;
  currentPlayer: PlayerID;
}

export const ActionsContainer: React.FC<ActionsContainerProps> = ({
  isTurn,
  phase,
  currentPlayer,
}) => {
  const currentPlayerName = usePlayerName(currentPlayer);
  return (
    <Container>
      {isTurn ? (
        <>
          {phase === Phase.Setup && <SetupAction />}
          {phase === Phase.SelectingTrump && <SelectingTrumpAction />}
          {phase === Phase.Bidding && <BiddingAction />}
          {phase === Phase.Playing && <PlayingAction />}
        </>
      ) : (
        <span>{currentPlayerName} ist am Zug</span>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin: 15px 0;
  min-height: 100px;
`;
