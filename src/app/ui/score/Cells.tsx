import React from "react";
import styled, { css } from "styled-components";
import { TableCell } from "@material-ui/core";
import { colors } from "../util/colors";

const cellWidth = 80;
const indexCellWidth = 30;
const bidBoxWidth = 15;
const cellHeight = 24;

const cellPadding = css`
  padding: 3px 6px;
`;

const BaseCell = styled(TableCell)<{ $width: number }>`
  min-width: ${({ $width }) => $width}px;
  max-width: ${({ $width }) => $width}px;
  && {
    padding: 0;
  }
`;

const CellContent = styled.div`
  ${cellPadding};
  text-align: center;
`;

export const IndexCell: React.FC = ({ children }) => (
  <BaseCell component="th" scope="row" $width={indexCellWidth}>
    <CellContent>{children}</CellContent>
  </BaseCell>
);

const PlayerContent = styled(CellContent)<{ $highlight: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${({ $highlight }) =>
    $highlight ? colors.yellow.light : "inherit"};
`;

export interface PlayerNameCellProps {
  highlight: boolean;
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

export const PlayerNameCell: React.FC<PlayerNameCellProps> = ({
  children,
  highlight,
  onMouseEnter,
  onMouseLeave,
}) => (
  <BaseCell
    component="th"
    $width={cellWidth}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
  >
    <PlayerContent $highlight={highlight}>{children}</PlayerContent>
  </BaseCell>
);

export const RoundColCell = styled(TableCell)`
  width: 10px;
  text-align: center;
  ${cellPadding}
`;

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
    <StyledCell $background={background} $width={cellWidth}>
      <FlexContainer>
        <ScoreBox>{total ?? " "}</ScoreBox>
        <BidBox>{bid ?? " "}</BidBox>
      </FlexContainer>
    </StyledCell>
  );
};

const StyledCell = styled(BaseCell)<{ $background: string }>`
  && {
    background-color: ${({ $background }) => $background ?? "inherit"};
  }
`;

const FlexContainer = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  height: ${cellHeight}px;
`;

const ScoreBox = styled(CellContent)`
  flex-grow: 1;
`;

const BidBox = styled(CellContent)`
  border-left: 1px solid #000000;
  width: ${bidBoxWidth}px;
  flex-grow: 0;
`;
