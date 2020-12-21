import React from "react";
import styled from "styled-components";
import { Phase } from "../../../../shared/phases/phase";
import { SetupAction } from "./SetupAction";
import { SelectingTrumpAction } from "./SelectingTrumpAction";
import { BiddingAction } from "./BiddingAction";
import { PlayingAction } from "./PlayingAction";

export interface ActionsContainerProps {
  phase: Phase;
}

export const ActionsContainer: React.FC<ActionsContainerProps> = ({
  phase,
}) => {
  return (
    <Container>
      {phase === Phase.Setup && <SetupAction />}
      {phase === Phase.SelectingTrump && <SelectingTrumpAction />}
      {phase === Phase.Bidding && <BiddingAction />}
      {phase === Phase.Playing && <PlayingAction />}
    </Container>
  );
};

const Container = styled.div``;
