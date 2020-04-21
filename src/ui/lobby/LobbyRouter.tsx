import React from "react";
import { Switch, Route, Redirect, BrowserRouter } from "react-router-dom";
import { CreateGame } from "./CreateGame";
import { GameContainer } from "./GameContainer";
import { useHeaderElement } from "../header/HeaderElementsProvider";
import { useProfile } from "../ProfileProvider";

export const LobbyRouter: React.FC = () => {
  const { name } = useProfile();
  useHeaderElement("profile", name);
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
