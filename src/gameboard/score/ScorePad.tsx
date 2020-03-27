import React, { useContext } from "react";
import { TableContainer, Table, TableHead, TableCell } from "@material-ui/core";
import range from "lodash/range";
import { GameContext } from "../GameContext";

export const ScorePad: React.FC = () => {
  const { gamestate } = useContext(GameContext);
  if (!gamestate) return null;
  const {
    G: {
      game: { scorePad },
    },
    ctx: { numPlayers },
  } = gamestate;
  const playerIDs = range(0, numPlayers).map((num) => num.toString());

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableCell>#</TableCell>
          {playerIDs.map((playerID) => (
            <TableCell>Spieler {playerID}</TableCell>
          ))}
        </TableHead>
      </Table>
    </TableContainer>
  );
};
