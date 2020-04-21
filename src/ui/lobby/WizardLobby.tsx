import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import { Switch, Route, Redirect } from "react-router-dom";
import styled from "styled-components";
import { InitProfile } from "./InitProfile";
import { CreateGame } from "./CreateGame";
import { useProfileContext } from "../ProfileProvider";
import { GameContainer } from "./GameContainer";

export const WizardLobby: React.FC = () => {
  const { profile } = useProfileContext();
  if (!profile) {
    return <InitProfile />;
  }
  const { name } = profile;
  return (
    <div>
      <AppBar>
        <Toolbar>Hallo {name}!</Toolbar>
      </AppBar>
      <AppBarSpacer />
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
    </div>
  );
};

const AppBarSpacer = styled.div`
  height: 64px;
  margin-bottom: 5px;
`;
