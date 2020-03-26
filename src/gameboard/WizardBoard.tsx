import React from "react";
import { Ctx } from "boardgame.io";
import { Container } from "@material-ui/core";
import { G } from "../boardgame/G";
import { GameContext } from "./GameContext";
import { HeaderBar } from "./header/HeaderBar";

export interface WizardBoardProps extends G, Ctx {
  plugins: {
    [pluginName: string]: {
      data: object;
    };
  };
  _undo: unknown[];
  _redo: unknown[];
  _stateID: number;
  isActive: boolean;
  log: unknown[];
  isConnected: boolean;
  gameID: string;
  playerID: string | null;
  credentials: null;
  debug: boolean;
  isMultiplayer: boolean;
  moves: object;
  events: object;
}

export const WizardBoard: React.FC<WizardBoardProps> = (
  props: WizardBoardProps
) => {
  return (
    <GameContext.Provider value={props}>
      <Container>
        <HeaderBar />
        <p>{JSON.stringify(props)}</p>
      </Container>
    </GameContext.Provider>
  );
};
