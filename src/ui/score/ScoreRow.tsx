import React from "react";
import { TableRow, TableCell, Tooltip } from "@material-ui/core";
import { Score } from "../../game/entities/score";

export interface ScoreRowProps {
  numCards: number;
  playerScores: Score[];
}

export const ScoreRow: React.FC<ScoreRowProps> = ({
  numCards,
  playerScores,
}) => {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {numCards}
      </TableCell>
      {playerScores.map(({ bid, tricks, score, total }, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <TableCell key={i}>
          <Tooltip
            arrow
            title={
              <>
                <p>
                  <b>{bid}</b> Stiche angesagt
                </p>
                <p>
                  <b>{tricks}</b> Stiche gemacht
                </p>
                <p>
                  <b>{score}</b> Punkte in dieser Runde
                </p>
                <p>
                  <b>{total}</b> Punkte insgesamt
                </p>
              </>
            }
          >
            <span>
              <b>{total}</b> | {bid}
            </span>
          </Tooltip>
        </TableCell>
      ))}
    </TableRow>
  );
};
