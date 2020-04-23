import React from "react";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { Trick } from "./Trick";
import { BidRound } from "./BidRound";

export const TableRound: React.FC = () => {
  const {
    wizardState: { trick, round },
  } = useGameState();
  return <Container>{trick && round ? <Trick /> : <BidRound />}</Container>;
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;
