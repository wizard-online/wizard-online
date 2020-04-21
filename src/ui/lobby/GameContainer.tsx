import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { EnterGame } from "./EnterGame";
import { PlayGame } from "./PlayGame";

export const GameContainer: React.FC = () => {
  const { gameID } = useParams<{ gameID: string }>();
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return <PlayGame />;
  }
  return <EnterGame gameID={gameID} startGame={() => setPlaying(true)} />;
};
