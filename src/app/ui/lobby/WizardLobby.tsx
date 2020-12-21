import React from "react";
import { BrowserRouter } from "react-router-dom";
import { OnBoarding } from "./Onboarding";
import { useProfileContext } from "../ProfileProvider";

import { LobbyRouter } from "./LobbyRouter";
import { SideMenu } from "./SideMenu";
import { isValidProfile } from "../services/profile.service";

export const WizardLobby: React.FC = () => {
  const { profile } = useProfileContext();
  if (!isValidProfile(profile)) {
    return <OnBoarding />;
  }

  return (
    <BrowserRouter>
      <LobbyRouter />
      <SideMenu />
    </BrowserRouter>
  );
};
