import React from "react";
import styled from "styled-components";
import { TableCell } from "@material-ui/core";

export interface ScoreCellProps {
  total?: number;
  bid?: number;
  highlight?: boolean;
}

export const ScoreCell: React.FC<ScoreCellProps> = ({ total, bid }) => {
  return (
    <StyledCell>
      <FlexContainer>
        <ScoreBox>{total ?? " "}</ScoreBox>
        <BidBox>{bid ?? " "}</BidBox>
      </FlexContainer>
    </StyledCell>
  );
};

const StyledCell = styled(TableCell)`
  min-width: 50px;
  max-width: 50px;
  && {
    padding: 0;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  height: 32px;
`;

const ScoreBox = styled.div`
  padding: 6px 0;
  flex-grow: 1;
`;

const BidBox = styled.div`
  border-left: 1px solid #000000;
  width: 30px;
  padding: 6px 0;
`;
