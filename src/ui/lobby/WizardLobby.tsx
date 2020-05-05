import React from "react";
import { BrowserRouter } from "react-router-dom";
import { OnBoarding } from "./Onboarding";
import { useProfileContext } from "../ProfileProvider";

import { LobbyRouter } from "./LobbyRouter";

export const WizardLobby: React.FC = () => {
  const { profile } = useProfileContext();
  if (!profile) {
    return <OnBoarding />;
  }

  return (
    <BrowserRouter>
      <LobbyRouter />
    </BrowserRouter>
  );
};
