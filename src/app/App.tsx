import React from "react";

import { WizardLobby } from "./ui/lobby/WizardLobby";
import { ProfileProvider } from "./ui/ProfileProvider";
import { TopBar } from "./ui/lobby/TopBar";
import { HeaderElementsProvider } from "./ui/header/HeaderElementsProvider";
import { NotificationsProvider } from "./ui/NotificationsProvider";
import { WizardThemeProvider } from "./ui/WizardThemeProvider";

export const App: React.FC = () => (
  <NotificationsProvider>
    <ProfileProvider>
      <WizardThemeProvider>
        <HeaderElementsProvider>
          <TopBar />
          <WizardLobby />
        </HeaderElementsProvider>
      </WizardThemeProvider>
    </ProfileProvider>
  </NotificationsProvider>
);
