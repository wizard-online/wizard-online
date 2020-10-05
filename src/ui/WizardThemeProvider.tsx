import React from "react";
import { ThemeProvider } from "@material-ui/core";
import { getWizardTheme } from "./util/mui-theme";
import { useProfileContext } from "./ProfileProvider";
import { characters } from "./util/character-theme";

export const WizardThemeProvider: React.FC = ({ children }) => {
  const { profile } = useProfileContext();
  const primaryColor =
    profile && profile.character
      ? characters[profile.character]?.color
      : undefined;
  return (
    <ThemeProvider theme={getWizardTheme(primaryColor)}>
      {children}
    </ThemeProvider>
  );
};
