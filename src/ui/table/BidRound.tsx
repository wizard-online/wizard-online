import React from "react";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { isSetRound } from "../../game/WizardState";
import {
  playersRound,
  nextPlayer,
  getPlayerName,
} from "../../game/entities/players.utils";
import { TrickCardBox } from "./TrickCardBox";
import { colors } from "../util/colors";

export const BidRound: React.FC = () => {
  const {
    wizardState: { numPlayers, dealer, round, roundIndex, rounds },
    gameMetadata,
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
          player={getPlayerName(playerID, gameMetadata)}
          key={playerID}
        >
          <h2>{bids[playerID] ?? "_"}</h2>
        </TrickCardBox>
      ))}
      <TrickCardBox player="TOTAL">
        <TotalBox>
          <h2>
            {totalBids} von {rounds[roundIndex]}
          </h2>
        </TotalBox>
      </TrickCardBox>
    </>
  );
};

const TotalBox = styled.div`
  color: ${colors.wizard.green};
`;
