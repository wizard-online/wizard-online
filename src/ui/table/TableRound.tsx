import React from "react";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { Trick } from "./Trick";
import { Phase } from "../../game/phases/phase";
import { BidRound } from "./BidRound";

export const TableRound: React.FC = () => {
  const {
    wizardState: { trick, round },
    ctx: { phase },
  } = useGameState();
  return (
    <Container>
      {trick && round && <Trick />}
      {phase === Phase.Bidding && <BidRound />}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;
