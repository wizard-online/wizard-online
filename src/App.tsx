import React from "react";

import { BrowserRouter } from "react-router-dom";
import { WizardLobby } from "./ui/lobby/WizardLobby";
import { ProfileProvider } from "./ui/ProfileProvider";

export const App: React.FC<{}> = () => (
  <BrowserRouter>
    <ProfileProvider>
      <WizardLobby />
    </ProfileProvider>
  </BrowserRouter>
);
