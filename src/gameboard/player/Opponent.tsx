import React from "react";
import { Card, CardContent } from "@material-ui/core";
import { useGameState } from "../GameContext";
import { PlayerProps } from "./Player.props";
import { OpponentHand } from "./OpponentHand";
import { Header } from "./Header";

export const Opponent: React.FC<PlayerProps> = ({ playerID }) => {
  const {
    wizardState: { currentPlayer, round },
  } = useGameState();

  const isTurn = playerID === currentPlayer;
  return (
    <Card>
      <CardContent>
        <Header playerID={playerID} isTurn={isTurn} />
        {round && <OpponentHand numCards={round.hands[playerID].length} />}
      </CardContent>
    </Card>
  );
};
