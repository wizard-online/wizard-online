import React, { useContext } from "react";
import { GameState } from "./GameState";

export interface AppState {
  gamestate?: GameState;
}

export const GameContext = React.createContext<AppState>({});

export const useGameState = (): GameState => {
  const { gamestate } = useContext(GameContext);
  if (!gamestate) throw new Error("GameState is not defined");
  return gamestate;
};
