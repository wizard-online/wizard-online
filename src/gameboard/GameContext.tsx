import React from "react";
import { GameState } from "./GameState";

export interface AppState {
  gamestate?: GameState;
}

export const GameContext = React.createContext<AppState>({});
