import React from "react";
import { ThemeProvider } from "@material-ui/core";
import { State } from "boardgame.io";
import styled from "styled-components";
import { GameContext } from "./GameContext";
import { HeaderBar } from "./header/HeaderBar";
import { PlayersContainer } from "./player/PlayersContainer";
import { Table } from "./table/Table";
import { PlayerID } from "../game/entities/players";
import { WizardState } from "../game/WizardState";
import { ScorePad } from "./score/ScorePad";
import { FinalScoreModal } from "./gameover/FinalScoreModal";
import { GameState } from "./GameState";
import { theme } from "./util/mui-theme";
import { Notifications } from "./components/Notifications";
import { GameEventDispatcher } from "./components/GameEventsDispatcher";

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
      <GameEventDispatcher />
      <ThemeProvider theme={theme}>
        <BoardContainer>
          <HeaderBar />
          <Notifications />

          <PlayersContainer upper />
          <Table />
          <PlayersContainer />
          <ScorePad />
        </BoardContainer>
        <FinalScoreModal />
      </ThemeProvider>
    </GameContext.Provider>
  );
};

const BoardContainer = styled.div`
  min-width: 1000px;
  max-width: 1400px;
`;
