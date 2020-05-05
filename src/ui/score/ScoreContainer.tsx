import React from "react";
import { Card, CardContent } from "@material-ui/core";
import styled from "styled-components";
import { ScorePad } from "./ScorePad";

export const ScoreContainer: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <FlexContainer>
          <h2>Spielstand</h2>
          <ScorePad />
        </FlexContainer>
      </CardContent>
    </Card>
  );
};

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
`;
