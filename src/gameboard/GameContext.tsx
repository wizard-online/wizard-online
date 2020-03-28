import React from "react";
import { GameState } from "./GameState";
import { PlayerID } from "../boardgame/entities/players";

export interface AppState {
  gamestate?: GameState;
  clientID: PlayerID;
}

export const GameContext = React.createContext<AppState>({});
