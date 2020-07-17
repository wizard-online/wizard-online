import React from "react";
import { ThemeProvider } from "@material-ui/core";

import { WizardLobby } from "./ui/lobby/WizardLobby";
import { ProfileProvider } from "./ui/ProfileProvider";
import { TopBar } from "./ui/lobby/TopBar";
import { theme } from "./ui/util/mui-theme";
import { HeaderElementsProvider } from "./ui/header/HeaderElementsProvider";
import { NotificationsProvider } from "./ui/NotificationsProvider";

export const App: React.FC = () => (
  <ThemeProvider theme={theme}>
    <NotificationsProvider>
      <ProfileProvider>
        <HeaderElementsProvider>
          <TopBar />
          <WizardLobby />
        </HeaderElementsProvider>
      </ProfileProvider>
    </NotificationsProvider>
  </ThemeProvider>
);
