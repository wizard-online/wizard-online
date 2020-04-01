import React from "react";
import { Card, CardContent } from "@material-ui/core";
import styled from "styled-components";
import { useGameState } from "../GameContext";
import { PlayerProps } from "./Player.props";
import { OpponentHand } from "./OpponentHand";
import { Header } from "./Header";
import { colors } from "../util/colors";

export const Opponent: React.FC<PlayerProps> = ({ playerID }) => {
  const {
    wizardState: { currentPlayer, round },
  } = useGameState();

  const isTurn = playerID === currentPlayer;
  return (
    <StyledCard>
      <CardContent>
        <Header playerID={playerID} isTurn={isTurn} />
        {round && <OpponentHand numCards={round.hands[playerID].length} />}
      </CardContent>
    </StyledCard>
  );
};

const StyledCard = styled(Card)`
  border: 1px solid ${colors.wizard.green};
`;
