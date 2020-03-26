import React from "react";
import { Container } from "@material-ui/core";
import { GameContext } from "./GameContext";
import { HeaderBar } from "./header/HeaderBar";
import { PlayersContainer } from "./player/PlayersContainer";
import { GameState } from "./GameState";

export const WizardBoard: React.FC<GameState> = (props) => {
  return (
    <GameContext.Provider value={{ gamestate: props }}>
      <Container>
        <HeaderBar />
        <PlayersContainer />
      </Container>
    </GameContext.Provider>
  );
};
