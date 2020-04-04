import React from "react";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import { useGameState } from "../../GameContext";

export const SetupAction: React.FC = () => {
  const {
    moves: { shuffle, handout },
  } = useGameState();
  return (
    <Row>
      <RowElement>
        <Button onClick={() => shuffle()}>Mischen</Button>
      </RowElement>
      <RowElement>
        <Button onClick={() => handout()} color="primary" variant="contained">
          Austeilen
        </Button>
      </RowElement>
    </Row>
  );
};

const Row = styled.form`
  display: flex;
  flex-direction: row;
  margin: 0px -10px;
  align-items: center;
`;

const RowElement = styled.div`
  margin: 0 10px;
`;
