import React from "react";
import styled from "styled-components";
import { TableCell } from "@material-ui/core";
import { colors } from "../util/colors";

export interface ScoreCellProps {
  total?: number;
  bid?: number;
  score?: number;
  highlight?: boolean;
}

export const ScoreCell: React.FC<ScoreCellProps> = ({
  total,
  bid,
  score,
  highlight,
}) => {
  let background = "";
  if (highlight) {
    if (score) {
      background = score > 0 ? colors.green.light : colors.red.light;
    } else {
      background = colors.blue.light;
    }
  }
  return (
    <StyledCell $background={background}>
      <FlexContainer>
        <ScoreBox>{total ?? " "}</ScoreBox>
        <BidBox>{bid ?? " "}</BidBox>
      </FlexContainer>
    </StyledCell>
  );
};

const StyledCell = styled(TableCell)<{ $background: string }>`
  min-width: 50px;
  max-width: 50px;
  && {
    padding: 0;
    background-color: ${({ $background }) => $background ?? "inherit"};
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
