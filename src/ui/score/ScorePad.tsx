import React from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow,
} from "@material-ui/core";
import range from "lodash/range";
import { useGameState } from "../GameContext";
import { getPlayerName } from "../../game/entities/players.utils";
import { PlayerID } from "../../game/entities/players";
import { ScoreRow } from "./ScoreRow";
import { CurrentRoundRow } from "./CurrentRoundRow";

export const ScorePad: React.FC = () => {
  const {
    wizardState: { scorePad, numCards, round },
    ctx: { numPlayers, gameover },
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
            <ScoreRow numCards={n} playerScores={playerScores} key={n} />
          ))}
          {round && !round.isComplete && !gameover && (
            <CurrentRoundRow numCards={numCards} bids={round.bids} />
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
