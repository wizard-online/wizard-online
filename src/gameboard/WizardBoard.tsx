import React from "react";
import { Container } from "@material-ui/core";
import { State } from "boardgame.io";
import { GameContext } from "./GameContext";
import { HeaderBar } from "./header/HeaderBar";
import { OpponentsContainer } from "./player/OpponentsContainer";
import { PlayerContainer } from "./player/PlayerContainer";
import { Table } from "./table/Table";
import { PlayerID } from "../boardgame/entities/players";
import { WizardState } from "../boardgame/WizardState";
import { ScorePad } from "./score/ScorePad";
import { FinalScoreModal } from "./gameover/FinalScoreModal";
import { GameState } from "./GameState";

export const WizardBoard: React.FC<State> = ({ G, playerID, ...rest }) => {
  return (
    <GameContext.Provider
      value={{
        gamestate: {
          wizardState: G as WizardState,
          clientID: PlayerID(playerID),
          ...rest,
        } as GameState,
      }}
    >
      <Container>
        <HeaderBar />
        <OpponentsContainer />
        <Table />
        <PlayerContainer />
        <ScorePad />
      </Container>
      <FinalScoreModal />
    </GameContext.Provider>
  );
};
