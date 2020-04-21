import React from "react";
import { ThemeProvider } from "@material-ui/core";

import { WizardLobby } from "./ui/lobby/WizardLobby";
import { ProfileProvider } from "./ui/ProfileProvider";
import { TopBar } from "./ui/lobby/TopBar";
import { theme } from "./ui/util/mui-theme";
import { HeaderElementsProvider } from "./ui/header/HeaderElementsProvider";

export const App: React.FC<{}> = () => (
  <ThemeProvider theme={theme}>
    <ProfileProvider>
      <HeaderElementsProvider>
        <TopBar />
        <WizardLobby />
      </HeaderElementsProvider>
    </ProfileProvider>
  </ThemeProvider>
);
