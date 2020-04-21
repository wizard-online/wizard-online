import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { EnterGame } from "./EnterGame";

export const GameContainer: React.FC = () => {
  const { gameID } = useParams<{ gameID: string }>();
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return <div>Playing...</div>;
  }
  return <EnterGame gameID={gameID} startGame={() => setPlaying(true)} />;
};
