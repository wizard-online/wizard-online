import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import { Switch, Route } from "react-router-dom";
import { InitProfile } from "./InitProfile";
import { CreateGame } from "./CreateGame";
import { useProfile } from "../ProfileProvider";

export const WizardLobby: React.FC = () => {
  const { profile } = useProfile();
  if (!profile) {
    return <InitProfile />;
  }
  const { name } = profile;
  return (
    <div>
      <AppBar>
        <Toolbar>Hallo {name}!</Toolbar>
      </AppBar>
      <Switch>
        <Route path="/">
          <CreateGame />
        </Route>
      </Switch>
    </div>
  );
};
