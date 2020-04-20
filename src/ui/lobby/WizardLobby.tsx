import React from "react";
import { AppBar, Toolbar } from "@material-ui/core";
import { InitProfile } from "./InitProfile";
import { getProfile } from "../services/profile.service";
import { CreateGame } from "./CreateGame";

export const WizardLobby: React.FC = () => {
  const profile = getProfile();
  if (!profile) {
    return <InitProfile />;
  }
  const { name } = profile;
  return (
    <div>
      <AppBar>
        <Toolbar>Hallo {name}!</Toolbar>
      </AppBar>
      <CreateGame />
    </div>
  );
};
