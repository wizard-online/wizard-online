import React, { useState } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
} from "@material-ui/core";
import range from "lodash/range";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { getPlayerName, maxCards } from "../../game/entities/players.utils";
import { PlayerID } from "../../game/entities/players";
import { ScoreRow } from "./ScoreRow";
import { RoundColCell, PlayerColCell } from "./Cells";
import { ScoreCellProps } from "./ScoreCell";
import { colors } from "../util/colors";

export const ScorePad: React.FC = () => {
  const {
    wizardState: { scorePad, roundIndex, rounds, round, numPlayers },
    gameMetadata,
  } = useGameState();
  const playerIDs = range(0, numPlayers) as PlayerID[];
  const currentRound = rounds[roundIndex];
  const allRounds = range(1, maxCards(numPlayers) + 1);
  const [colHighlighted, setColHighlighted] = useState(-1);
  return (
    <Container>
      <StyledTable>
        <Table size="small">
          <TableHead>
            <TableRow>
              <RoundColCell />
              {playerIDs.map((playerID) => (
                <PlayerNameCell
                  key={playerID}
                  $highlight={colHighlighted === playerID}
                  onMouseEnter={() => setColHighlighted(playerID)}
                  onMouseLeave={() => setColHighlighted(-1)}
                >
                  {getPlayerName(playerID, gameMetadata)}
                </PlayerNameCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allRounds.map((numCards) => {
              const roundScore = scorePad.find(
                (scoreRow) => scoreRow.numCards === numCards
              );
              const isCurrentRound = numCards === currentRound;
              let playerScores: ScoreCellProps[] = new Array(numPlayers).fill(
                {}
              );
              if (roundScore?.playerScores) {
                playerScores = roundScore.playerScores;
              } else if (round && isCurrentRound) {
                playerScores = round.bids.map((bid) => ({
                  bid: bid ?? undefined,
                }));
              }
              return (
                <ScoreRow
                  numCards={numCards}
                  playerScores={playerScores}
                  skip={!rounds.includes(numCards)}
                  current={isCurrentRound}
                  colHighlighted={colHighlighted}
                  key={numCards}
                />
              );
            })}
          </TableBody>
        </Table>
      </StyledTable>
    </Container>
  );
};

const Container = styled.div`
  width: fit-content;
`;

const StyledTable = styled(TableContainer)`
  border: 1px solid black;
  border-radius: 5px;
  width: initial;
  & .MuiTable-root {
    width: initial;
    border: 1px solid black;
  }
  & .MuiTableCell-root {
    border: 1px solid black;
    border-width: 1px 2px;
  }
`;

const PlayerNameCell = styled(PlayerColCell)<{ $highlight: boolean }>`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  background-color: ${({ $highlight }) =>
    $highlight ? colors.yellow.light : "inherit"};
`;
