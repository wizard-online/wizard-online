import React from "react";
import { useParams } from "react-router-dom";

export const EnterGame: React.FC = () => {
  const { gameID } = useParams();
  return <div>{gameID}</div>;
};
