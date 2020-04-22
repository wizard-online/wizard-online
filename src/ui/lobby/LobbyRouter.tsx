import React from "react";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import { CreateGame } from "./CreateGame";
import { GameContainer } from "./GameContainer";
import { useProfileHeaderElement } from "../hooks/profile-header-element";

export const LobbyRouter: React.FC = () => {
  useProfileHeaderElement();
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <CreateGame />
        </Route>
        <Route path="/game/:gameID">
          <GameContainer />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
