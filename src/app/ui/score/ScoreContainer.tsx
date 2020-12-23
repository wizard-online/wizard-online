import React from "react";
import { Card, CardContent } from "@material-ui/core";
import styled from "styled-components";
import range from "lodash/range";
import { ScorePad } from "./ScorePad";
import { useGameState } from "../GameContext";

export const ScoreContainer: React.FC = () => {
  const {
    wizardState: { scorePad, roundIndex, rounds, round, numPlayers },
    matchData,
  } = useGameState();
  return (
    <Card>
      <CardContent>
        <FlexContainer>
          <h2>Spielstand</h2>
          <ScorePad
            scorePad={scorePad}
            rounds={rounds}
            playerNames={
              matchData?.map(({ name, id }) => name ?? id.toString()) ??
              range(0, numPlayers).map((el) => el.toString())
            }
            currentRound={rounds[roundIndex]}
            currentRoundBids={round?.bids.map((bid) => bid ?? undefined)}
          />
        </FlexContainer>
      </CardContent>
    </Card>
  );
};

const FlexContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
`;
