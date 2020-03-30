import React from "react";
import { Button } from "@material-ui/core";
import { useGameState } from "../../GameContext";

export const SetupAction: React.FC = () => {
  const {
    moves: { shuffle, handout },
  } = useGameState();
  return (
    <>
      <Button onClick={() => shuffle()}>Mischen</Button>
      <Button onClick={() => handout()}>Austeilen</Button>
    </>
  );
};
