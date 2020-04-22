import React from "react";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import { CreateGame } from "./CreateGame";
import { GameContainer } from "./GameContainer";
import { useProfileHeaderElement } from "../hooks/profile-header-element";
import { ListGames } from "./ListGames";

export const LobbyRouter: React.FC = () => {
  useProfileHeaderElement();
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/">
          <CreateGame />
        </Route>
        <Route exact path="/games">
          <ListGames />
        </Route>
        <Route path="/games/:gameID">
          <GameContainer />
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};
