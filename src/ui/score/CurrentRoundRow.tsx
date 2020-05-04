import React from "react";
import { TableRow, TableCell } from "@material-ui/core";
import { ScoreCell } from "./ScoreCell";

export interface CurrentRoundRowProps {
  numCards: number;
  bids: (number | null)[];
}

export const CurrentRoundRow: React.FC<CurrentRoundRowProps> = ({
  numCards,
  bids,
}) => {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {numCards}
      </TableCell>
      {bids.map((bid, i) => (
        // eslint-disable-next-line react/no-array-index-key
        <ScoreCell key={i}>
          <span>__ | {bid ?? "_"}</span>
        </ScoreCell>
      ))}
    </TableRow>
  );
};
