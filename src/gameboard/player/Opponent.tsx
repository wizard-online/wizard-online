import React from "react";
import { Box, Card, CardContent } from "@material-ui/core";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { PlayerProps } from "./Player.props";
import { TrickLabel } from "./TrickLabel";
import { OpponentHand } from "./OpponentHand";

export const Opponent: React.FC<PlayerProps> = ({ playerID }) => {
  const {
    wizardState: { currentPlayer, round },
  } = useGameState();

  const isTurn = playerID === currentPlayer;
  return (
    <Card>
      <CardContent>
        <Header>
          <PlayerTitle isTurn={isTurn}>Spieler {playerID}</PlayerTitle>
          <Spacer />
          <TrickLabel playerID={playerID} />
        </Header>

        {round && <OpponentHand numCards={round.hands[playerID].length} />}
      </CardContent>
    </Card>
  );
};

const Header = styled(Box)`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 15px 0;
`;

const Spacer = styled.div`
  width: 10px;
  flex-grow: 1;
`;

const PlayerTitle = styled.h3<{ isTurn: boolean }>`
  margin: 0;
  text-decoration: ${({ isTurn }) => (isTurn ? "underline" : "none")};
  color: ${({ isTurn }) => (isTurn ? "darkred" : "inherit")};
`;
