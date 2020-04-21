import React from "react";
import { InitProfile } from "./InitProfile";
import { useProfileContext } from "../ProfileProvider";

import { LobbyRouter } from "./LobbyRouter";

export const WizardLobby: React.FC = () => {
  const { profile } = useProfileContext();
  if (!profile) {
    return <InitProfile />;
  }

  return <LobbyRouter />;
};
