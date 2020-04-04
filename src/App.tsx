import React from "react";

import { Lobby, Client } from "boardgame.io/react";
import { applyMiddleware } from "redux";
import logger from "redux-logger";
import styled from "styled-components";
import { wizardGameConfig } from "./game/game";
import { WizardBoard } from "./ui/WizardBoard";

// en-/disable console logging of redux actions
const REDUX_LOGGER = false;

export const App: React.FC<{}> = () => (
  <StyledLobby>
    <Lobby
      gameServer="http://localhost:8000"
      lobbyServer="http://localhost:8000"
      gameComponents={[
        {
          game: wizardGameConfig,
          board: WizardBoard,
        },
      ]}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      clientFactory={(opts: any) => {
        return Client({
          enhancer: REDUX_LOGGER ? applyMiddleware(logger) : undefined,
          ...opts,
        });
      }}
    />{" "}
  </StyledLobby>
);

const StyledLobby = styled.div`
  padding: 10px;
  & #lobby-view {
    padding: 0 !important;
  }
  & .hidden {
    display: none;
  }
`;
