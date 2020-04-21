import React from "react";
import { useHistory, useParams } from "react-router-dom";
import { EnterGame } from "./EnterGame";

export const GameContainer: React.FC = () => {
  const history = useHistory();
  const { gameID } = useParams();

  // redirect to start page if param is missing
  if (!gameID) {
    history.replace("/");
    return null;
  }
  return <EnterGame gameID={gameID} />;
};
