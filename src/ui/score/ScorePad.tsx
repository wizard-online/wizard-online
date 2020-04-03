import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import range from "lodash/range";
import { useGameState } from "../GameContext";
import { getPlayerName } from "../../game/util/players";
import { PlayerID } from "../../game/entities/players";

export const ScorePad: React.FC = () => {
  const {
    wizardState: { scorePad, numCards, round },
    ctx: { numPlayers },
    gameMetadata,
  } = useGameState();
  const playerIDs = range(0, numPlayers) as PlayerID[];

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            {playerIDs.map((playerID) => (
              <TableCell key={playerID}>
                {getPlayerName(playerID, gameMetadata)}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {scorePad.map(({ numCards: n, playerScores }) => (
            <TableRow key={n}>
              <TableCell component="th" scope="row">
                {n}
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
          ))}
          <TableRow>
            <TableCell component="th" scope="row">
              {numCards}
            </TableCell>
            {round &&
              round.bids.map((bid, i) => (
                // eslint-disable-next-line react/no-array-index-key
                <TableCell key={i}>
                  <span>__ | {bid ?? "_"}</span>
                </TableCell>
              ))}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
