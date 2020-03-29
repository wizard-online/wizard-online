import React from "react";
import { Container } from "@material-ui/core";
import { State } from "boardgame.io";
import { GameContext } from "./GameContext";
import { HeaderBar } from "./header/HeaderBar";
import { PlayersContainer } from "./player/PlayersContainer";
import { Table } from "./table/Table";
import { PlayerID } from "../boardgame/entities/players";
import { WizardState } from "../boardgame/WizardState";
import { GameState } from "./GameState";

export const WizardBoard: React.FC<State> = ({
  G: wizardState,
  playerID,
  ...rest
}) => {
  return (
    <GameContext.Provider
      value={{
        gamestate: {
          wizardState: wizardState as WizardState,
          clientID: PlayerID(playerID),
          ...rest,
        } as GameState,
      }}
    >
      <Container>
        <HeaderBar />
        <Table />
        <PlayersContainer />
      </Container>
    </GameContext.Provider>
  );
};
