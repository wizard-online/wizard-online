import React from "react";
import { Card, CardContent } from "@material-ui/core";
import styled from "styled-components";
import range from "lodash/range";
import { ScorePad } from "./ScorePad";
import { useGameState } from "../GameContext";

export const ScoreContainer: React.FC = () => {
  const {
    wizardState: { scorePad, roundIndex, rounds, round, numPlayers },
    gameMetadata,
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
              gameMetadata?.map(({ name }) => name) ?? range(0, numPlayers)
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
