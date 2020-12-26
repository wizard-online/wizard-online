import React from "react";
import styled from "styled-components";
import { useTheme } from "@material-ui/core";
import { useGameState } from "../GameContext";
import { isSetRound } from "../../game/WizardState";
import {
  playersRound,
  nextPlayer,
  getPlayerName,
} from "../../game/entities/players.utils";
import { TrickCardBox } from "./TrickCardBox";

export const BidRound: React.FC = () => {
  const theme = useTheme();
  const {
    wizardState: { numPlayers, dealer, round, roundIndex, rounds },
    matchData,
  } = useGameState();

  if (!isSetRound(round)) {
    return null;
  }
  const { bids } = round;
  const totalBids = bids.reduce((sum: number, bid) => sum + (bid ?? 0), 0);
  const bidRoundOrder = playersRound(
    nextPlayer(dealer, numPlayers),
    numPlayers
  );
  return (
    <>
      {bidRoundOrder.map((playerID) => (
        <TrickCardBox
          player={getPlayerName(playerID, matchData)}
          key={playerID}
        >
          <h2>{bids[playerID] ?? "_"}</h2>
        </TrickCardBox>
      ))}
      <TrickCardBox player="TOTAL">
        <TotalBox $color={theme.palette.primary.main}>
          <h2>
            {totalBids} von {rounds[roundIndex]}
          </h2>
        </TotalBox>
      </TrickCardBox>
    </>
  );
};

const TotalBox = styled.div<{ $color: string }>`
  color: ${({ $color }) => $color};
`;
