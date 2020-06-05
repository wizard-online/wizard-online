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
import { ScoreRow } from "./ScoreRow";
import { RoundColCell, PlayerNameCell, ScoreCellProps } from "./Cells";
import { ScorePad as ScorePadModel } from "../../game/entities/score";
import { NumPlayers } from "../../game/entities/players";
import { maxCards } from "../../game/entities/players.utils";

export interface ScorePadProps {
  playerNames: string[];
  scorePad: ScorePadModel;
  rounds: number[];
  currentRound?: number;
  currentRoundBids?: (number | undefined)[];
}

export const ScorePad: React.FC<ScorePadProps> = ({
  playerNames,
  scorePad,
  rounds,
  currentRound,
  currentRoundBids,
}) => {
  const numPlayers = playerNames.length as NumPlayers;
  const allRounds = range(1, maxCards(numPlayers) + 1);
  const [colHighlighted, setColHighlighted] = useState(-1);
  const [rowHighlighted, setRowHighlighted] = useState(-1);
  const [highlightAll, setHighlightAll] = useState(false);
  return (
    <Container>
      <StyledTable>
        <Table size="small">
          <TableHead>
            <TableRow>
              <RoundColCell
                onMouseEnter={() => setHighlightAll(true)}
                onMouseLeave={() => setHighlightAll(false)}
              />
              {playerNames.map((playerName, i) => (
                <PlayerNameCell
                  key={playerName}
                  highlight={colHighlighted === i || highlightAll}
                  onMouseEnter={() => setColHighlighted(i)}
                  onMouseLeave={() => setColHighlighted(-1)}
                >
                  {playerName}
                </PlayerNameCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {allRounds.map((numCards, i) => {
              const roundScore = scorePad.find(
                (scoreRow) => scoreRow.numCards === numCards
              );
              const isCurrentRound = numCards === currentRound;
              let playerScores: ScoreCellProps[] = new Array(numPlayers).fill(
                {}
              );
              if (roundScore?.playerScores) {
                playerScores = roundScore.playerScores;
              } else if (isCurrentRound && currentRoundBids) {
                playerScores = currentRoundBids.map((bid) => ({
                  bid,
                }));
              }
              const skip = !rounds.includes(numCards);
              let thisColHighlighted: number | "all" | undefined;
              if (!skip) {
                thisColHighlighted =
                  highlightAll || rowHighlighted === i ? "all" : colHighlighted;
              }
              return (
                <ScoreRow
                  numCards={numCards}
                  playerScores={playerScores}
                  skip={skip}
                  current={isCurrentRound}
                  colHighlighted={thisColHighlighted}
                  key={numCards}
                  onMouseEnter={() => setRowHighlighted(i)}
                  onMouseLeave={() => setRowHighlighted(-1)}
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
