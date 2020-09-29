import React from "react";
import { ThemeProvider } from "@material-ui/core";
import { getWizardTheme } from "./util/mui-theme";

export const WizardThemeProvider: React.FC = ({ children }) => {
  return <ThemeProvider theme={getWizardTheme()}>{children}</ThemeProvider>;
};
