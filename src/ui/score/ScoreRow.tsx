import React from "react";
import { TableRow } from "@material-ui/core";
import styled, { css } from "styled-components";
import { RoundColCell, ScoreCell, ScoreCellProps } from "./Cells";
import { colors } from "../util/colors";

export interface ScoreRowProps {
  numCards: number;
  playerScores: ScoreCellProps[];
  skip?: boolean;
  current?: boolean;
  colHighlighted?: number | "all";
  onMouseEnter?: (event: React.MouseEvent) => void;
  onMouseLeave?: (event: React.MouseEvent) => void;
}

export const ScoreRow: React.FC<ScoreRowProps> = ({
  numCards,
  playerScores,
  skip = false,
  current = false,
  colHighlighted,
  onMouseEnter,
  onMouseLeave,
}) => {
  const allHighlighted = colHighlighted === "all";
  return (
    <StyledRow
      $skip={skip}
      $current={current}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <StyledRoundColCell
        component="th"
        scope="row"
        $highlight={allHighlighted}
      >
        {numCards}
      </StyledRoundColCell>
      {playerScores.map(({ total, score, bid }, i) => (
        <ScoreCell
          total={total}
          score={score}
          bid={bid}
          highlight={!skip && (allHighlighted || i === colHighlighted)}
          // eslint-disable-next-line react/no-array-index-key
          key={i}
        />
      ))}
    </StyledRow>
  );
};

const strikethrough = css`
  /* based on https://stackoverflow.com/a/19670807/5025424 */
  & .MuiTableCell-root {
    position: relative;
  }
  & .MuiTableCell-root:before {
    content: " ";
    position: absolute;
    top: 50%;
    left: 0;
    border-bottom: 1px dotted #111;
    width: 100%;
    box-shadow: 0 0 2px grey;
  }
`;

const StyledRow = styled(TableRow)<{ $skip: boolean; $current: boolean }>`
  ${({ $skip }) => ($skip ? strikethrough : "")}
  ${({ $current }) =>
    $current
      ? css`
          & td,
          th {
            font-weight: bold;
            background-color: ${colors.lightgrey};
          }
        `
      : ""}
  border-top: 1px solid black;
`;

const StyledRoundColCell = styled(RoundColCell)<{ $highlight: boolean }>`
  && {
    background-color: ${({ $highlight }) =>
      $highlight ? colors.blue.light : "inherit"};
  }
`;
