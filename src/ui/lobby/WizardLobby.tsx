import React from "react";
import { OnBoarding } from "./Onboarding";
import { useProfileContext } from "../ProfileProvider";

import { LobbyRouter } from "./LobbyRouter";

export const WizardLobby: React.FC = () => {
  const { profile } = useProfileContext();
  if (!profile) {
    return <OnBoarding />;
  }

  return <LobbyRouter />;
};
